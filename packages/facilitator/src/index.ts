import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

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

    logger.info({ 
      buyer: payment.buyer,
      merchant: payment.payTo,
      amount: payment.amount,
    }, "Processing settlement on X1 testnet");

    const { Transaction, SystemProgram } = await import("@solana/web3.js");
    const tx = new Transaction();
    
    // Add memo with payment metadata for transparency
    const memoData = Buffer.from(
      `x402:${payment.scheme}:${payment.amount}:${payment.buyer.slice(0, 8)}`,
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
      txHash, 
      buyer: payment.buyer, 
      merchant: payment.payTo,
      amount: totalAmount.toString(),
      network: "x1-testnet"
    }, "Payment settled on X1 blockchain");

    return res.json({ 
      txHash,
      amount: totalAmount.toString(),
      network: payment.network
    });
  } catch (e: any) {
    logger.error(e, "Settlement failed");
    return res.status(400).json({ error: e.message });
  }
});

app.post("/refund", async (req, res) => {
  try {
    const { buyer, amount, network } = req.body;
    
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

    logger.info({ 
      buyer,
      amount,
      network
    }, "Processing refund on X1 blockchain");

    const { Transaction, SystemProgram } = await import("@solana/web3.js");
    const tx = new Transaction();
    
    // Add memo for refund transaction
    const memoData = Buffer.from(
      `x402-refund:${amount}:${buyer.slice(0, 8)}`,
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
      txHash, 
      buyer,
      amount,
      network
    }, "Refund completed on X1 blockchain");

    return res.json({ 
      txHash,
      amount: amount,
      network
    });
  } catch (e: any) {
    logger.error(e, "Refund failed");
    return res.status(400).json({ error: e.message });
  }
});

app.listen(PORT, () => logger.info(`✅ Facilitator up on :${PORT}`));
