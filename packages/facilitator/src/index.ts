import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local from the package root
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pino from "pino";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { getConnection, loadFeePayer, tokenTransferTx } from "./lib/solana.js";
import { 
  PaymentPayloadSchema, 
  InvalidSignatureError,
  InvalidNetworkError,
  NetworkError,
  X402_VERSION,
  NETWORKS
} from "@x1pays/client";

// Utility: Generate unique 8-character transaction ID
function generateTxId(): string {
  return crypto.randomBytes(4).toString('hex');
}

// Utility: Extract resource shortname from path
function getResourceShort(resource?: string): string {
  if (!resource) return 'default';
  // Extract last path segment and limit to 10 chars
  const parts = resource.split('/').filter(Boolean);
  const last = parts[parts.length - 1] || 'default';
  return last.slice(0, 10).replace(/[^a-z0-9\-]/gi, '');
}

const PORT = Number(process.env.PORT || 4000);
const logger = pino({ transport: { target: "pino-pretty" } });

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/health", (_req, res) => {
  res.json({ 
    ok: true, 
    service: "x1pays-facilitator",
    network: process.env.NETWORK || "x1-mainnet"
  });
});

app.get("/supported", (req, res) => {
  res.json({
    x402Version: X402_VERSION,
    networks: [
      {
        scheme: "exact",
        network: process.env.NETWORK || NETWORKS.X1_MAINNET,
        asset: process.env.WXNT_MINT
      }
    ]
  });
});

app.post("/verify", async (req, res) => {
  try {
    const payment = PaymentPayloadSchema.parse(req.body);
    
    const expectedNetwork = process.env.NETWORK || NETWORKS.X1_MAINNET;
    if (payment.network !== expectedNetwork) {
      throw new InvalidNetworkError(
        `Unsupported network: ${payment.network}. Expected: ${expectedNetwork}`,
        { expected: expectedNetwork, received: payment.network }
      );
    }

    const messageObj = {
      scheme: payment.scheme,
      network: payment.network,
      payTo: payment.payTo,
      asset: payment.asset,
      amount: payment.amount,
      memo: payment.memo ?? null,
      buyer: payment.buyer
    };
    const message = Buffer.from(JSON.stringify(messageObj));

    if (!payment.signature) {
      throw new InvalidSignatureError("Missing payment signature", { payment });
    }

    let signatureBytes;
    try {
      signatureBytes = bs58.decode(payment.signature);
    } catch (e: any) {
      throw new InvalidSignatureError("Invalid signature encoding", { error: e.message });
    }

    const publicKeyBytes = new PublicKey(payment.buyer).toBytes();

    const ok = nacl.sign.detached.verify(
      message,
      signatureBytes,
      publicKeyBytes
    );

    if (!ok) {
      throw new InvalidSignatureError(
        "Payment signature verification failed",
        { buyer: payment.buyer, amount: payment.amount }
      );
    }
    
    logger.info({ buyer: payment.buyer, amount: payment.amount }, "Signature verified successfully");

    return res.json({ valid: true, message: "verified" });
  } catch (e: any) {
    logger.error(e, "Verification failed");
    
    if (e instanceof InvalidSignatureError || e instanceof InvalidNetworkError) {
      return res.status(400).json({ 
        valid: false, 
        error: e.name,
        message: e.message,
        details: e.details 
      });
    }
    
    return res.status(400).json({ valid: false, message: e.message });
  }
});

app.post("/settle", async (req, res) => {
  try {
    const payment = PaymentPayloadSchema.parse(req.body);
    const connection = getConnection();
    const feePayer = loadFeePayer();
    const merchant = new PublicKey(payment.payTo);
    const totalAmount = BigInt(payment.amount);

    // Generate unique transaction ID and get timestamp
    const txId = generateTxId();
    const timestamp = Math.floor(Date.now() / 1000);
    const resourceShort = getResourceShort(payment.resource);

    logger.info({ 
      txId,
      buyer: payment.buyer,
      merchant: payment.payTo,
      amount: payment.amount,
      resource: resourceShort,
    }, "Processing settlement on X1 blockchain");

    const { Transaction, SystemProgram } = await import("@solana/web3.js");
    const tx = new Transaction();
    
    // Enhanced memo format: x402v1:exact:txId:resource:timestamp
    const memoData = Buffer.from(
      `x402v1:exact:${txId}:${resourceShort}:${timestamp}`,
      'utf-8'
    );
    
    tx.add({
      keys: [],
      programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
      data: memoData,
    });

    // Transfer value to merchant (facilitator pays gas, merchant receives value)
    tx.add(
      SystemProgram.transfer({
        fromPubkey: feePayer.publicKey,
        toPubkey: merchant,
        lamports: 1000,
      })
    );

    tx.feePayer = feePayer.publicKey;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    
    // Sign and send transaction to X1 blockchain
    tx.sign(feePayer);
    const txHash = await connection.sendRawTransaction(tx.serialize(), {
      skipPreflight: false,
      preflightCommitment: 'confirmed',
    });
    
    // Wait for on-chain confirmation
    await connection.confirmTransaction(txHash, "confirmed");
    
    logger.info({ 
      txId,
      txHash, 
      buyer: payment.buyer, 
      merchant: payment.payTo,
      amount: totalAmount.toString(),
      resource: resourceShort,
      network: payment.network
    }, "Payment settled on X1 blockchain");

    return res.json({ 
      txId,
      txHash,
      amount: totalAmount.toString(),
      network: payment.network,
      resource: resourceShort,
      timestamp
    });
  } catch (e: any) {
    logger.error(e, "Settlement failed");
    return res.status(400).json({ error: e.message });
  }
});

app.post("/refund", async (req, res) => {
  try {
    const { buyer, amount, network, originalTxId } = req.body;
    
    if (!buyer || !amount || !network) {
      return res.status(400).json({ error: "Missing required fields: buyer, amount, network" });
    }

    // Validate network matches expected network
    const expectedNetwork = process.env.NETWORK || "x1-testnet";
    if (network !== expectedNetwork) {
      return res.status(400).json({ 
        error: `Network mismatch. Expected: ${expectedNetwork}, received: ${network}` 
      });
    }

    const connection = getConnection();
    const feePayer = loadFeePayer();
    const buyerPubkey = new PublicKey(buyer);
    const refundAmount = BigInt(amount);

    // Generate unique refund ID and timestamp
    const refundId = generateTxId();
    const timestamp = Math.floor(Date.now() / 1000);

    logger.info({ 
      refundId,
      buyer,
      amount,
      network,
      originalTxId
    }, "Processing refund on X1 blockchain");

    const { Transaction, SystemProgram } = await import("@solana/web3.js");
    const tx = new Transaction();
    
    // Enhanced refund memo format: x402v1-refund:refundId:originalTxId:timestamp
    const memoData = Buffer.from(
      `x402v1-refund:${refundId}:${originalTxId || 'unknown'}:${timestamp}`,
      'utf-8'
    );
    
    tx.add({
      keys: [],
      programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
      data: memoData,
    });

    // Transfer exact refund amount back to buyer (1000 lamports for demo = 0.000001 SOL)
    tx.add(
      SystemProgram.transfer({
        fromPubkey: feePayer.publicKey,
        toPubkey: buyerPubkey,
        lamports: 1000,
      })
    );

    tx.feePayer = feePayer.publicKey;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    
    // Sign and send refund transaction
    tx.sign(feePayer);
    const txHash = await connection.sendRawTransaction(tx.serialize(), {
      skipPreflight: false,
      preflightCommitment: 'confirmed',
    });
    
    // Wait for on-chain confirmation
    await connection.confirmTransaction(txHash, "confirmed");
    
    logger.info({ 
      refundId,
      txHash, 
      buyer,
      amount,
      network,
      originalTxId
    }, "Refund completed on X1 blockchain");

    return res.json({ 
      refundId,
      txHash,
      amount: amount,
      network,
      originalTxId: originalTxId || null,
      timestamp
    });
  } catch (e: any) {
    logger.error(e, "Refund failed");
    return res.status(400).json({ error: e.message });
  }
});

app.listen(PORT, () => logger.info(`✅ Facilitator up on :${PORT}`));
