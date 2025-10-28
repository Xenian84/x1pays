import "dotenv/config";
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
    const messageStr = JSON.stringify(messageObj);
    const message = Buffer.from(messageStr);

    logger.info({ 
      messageStr, 
      messageLength: message.length,
      buyer: payment.buyer,
      signatureLength: payment.signature?.length 
    }, "Verifying signature");

    if (!payment.signature) {
      throw new InvalidSignatureError("Missing payment signature", { payment });
    }

    let signatureBytes;
    try {
      signatureBytes = bs58.decode(payment.signature);
      logger.info({ signatureBytesLength: signatureBytes.length }, "Decoded signature");
    } catch (e: any) {
      throw new InvalidSignatureError("Invalid signature encoding", { error: e.message });
    }

    const publicKeyBytes = new PublicKey(payment.buyer).toBytes();
    logger.info({ publicKeyBytesLength: publicKeyBytes.length }, "Public key bytes");

    const ok = nacl.sign.detached.verify(
      message,
      signatureBytes,
      publicKeyBytes
    );

    logger.info({ ok, buyer: payment.buyer }, "Signature verification result");

    if (!ok) {
      throw new InvalidSignatureError(
        "Payment signature verification failed",
        { buyer: payment.buyer, amount: payment.amount }
      );
    }

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
    const mint = new PublicKey(payment.asset);
    const buyer = new PublicKey(payment.buyer);
    const merchant = new PublicKey(payment.payTo);
    const totalAmount = BigInt(payment.amount);

    // MVP MODE: For demonstration, we return simulated transaction hashes
    // This allows the x402 flow to complete for testing the protocol
    // PRODUCTION: Remove this block and implement one of these patterns:
    // 1. Delegate approval: buyer pre-approves facilitator to transfer exact amount
    // 2. Client-signed transaction: buyer signs the transaction and includes txSignature
    // 3. Escrow: funds locked in program-controlled account released on verification
    
    if (!payment.txSignature) {
      logger.warn("MVP mode: simulating settlement without actual on-chain transaction");
      
      // Generate simulated transaction hash for demonstration
      const simulatedTx = `SIM_TX_${Buffer.from(
        `${payment.buyer}_${totalAmount}_${Date.now()}`
      ).toString('base64').substring(0, 64)}`;
      
      logger.info({ 
        simulatedTx,
        buyer: payment.buyer,
        merchant: payment.payTo,
        amount: payment.amount,
        mode: "MVP_SIMULATION"
      }, "Payment simulated - 100% to merchant (not settled on-chain)");
      
      return res.json({ 
        txHash: simulatedTx,
        simulated: true,
        amount: totalAmount.toString(),
        message: "MVP mode: payment verified but not settled on-chain. See PRODUCTION_NOTES.md for implementation patterns."
      });
    }

    // PRODUCTION PATH: With buyer's transaction signature
    // Transfer 100% to merchant (0% protocol fee)
    const merchantTx = await tokenTransferTx({
      connection,
      mint,
      from: buyer,
      to: merchant,
      amount: totalAmount,
      feePayer
    });
    
    // Add buyer's signature to transaction
    merchantTx.addSignature(buyer, Buffer.from(bs58.decode(payment.txSignature)));
    const txHash = await connection.sendTransaction(merchantTx, [feePayer], { skipPreflight: false });
    await connection.confirmTransaction(txHash, "confirmed");
    
    logger.info({ 
      txHash, 
      buyer: payment.buyer, 
      merchant: payment.payTo,
      amount: totalAmount.toString() 
    }, "Payment settled on-chain - 100% to merchant");

    return res.json({ 
      txHash,
      simulated: false,
      amount: totalAmount.toString()
    });
  } catch (e: any) {
    logger.error(e, "Settlement failed");
    return res.status(400).json({ error: e.message });
  }
});

app.listen(PORT, () => logger.info(`✅ Facilitator up on :${PORT}`));
