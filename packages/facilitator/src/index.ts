import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pino from "pino";
import { z } from "zod";
import { PublicKey } from "@solana/web3.js";
import * as nacl from "tweetnacl";
import bs58 from "bs58";
import { getConnection, loadFeePayer, tokenTransferTx } from "./lib/solana.js";

const PORT = Number(process.env.PORT || 4000);
const logger = pino({ transport: { target: "pino-pretty" } });

const PaymentSchema = z.object({
  scheme: z.literal("exact"),
  network: z.enum(["x1-mainnet", "x1-devnet"]),
  payTo: z.string().min(32),
  asset: z.string().min(32),
  amount: z.string().regex(/^\d+$/),
  buyer: z.string().min(32),
  signature: z.string().optional(),
  txSignature: z.string().optional(), // Buyer's signature on the transaction
  memo: z.string().optional().nullable()
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/supported", (req, res) => {
  res.json({
    x402Version: 1,
    networks: [
      {
        scheme: "exact",
        network: process.env.NETWORK || "x1-mainnet",
        asset: process.env.WXNT_MINT
      }
    ]
  });
});

app.post("/verify", async (req, res) => {
  try {
    const payment = PaymentSchema.parse(req.body);
    
    if (payment.network !== (process.env.NETWORK || "x1-mainnet")) {
      throw new Error("Unsupported network");
    }

    const message = Buffer.from(JSON.stringify({
      scheme: payment.scheme,
      network: payment.network,
      payTo: payment.payTo,
      asset: payment.asset,
      amount: payment.amount,
      buyer: payment.buyer,
      memo: payment.memo ?? null
    }));

    if (!payment.signature) {
      throw new Error("Missing signature");
    }

    const ok = nacl.sign.detached.verify(
      message,
      bs58.decode(payment.signature),
      new PublicKey(payment.buyer).toBytes()
    );

    if (!ok) {
      throw new Error("Signature invalid");
    }

    return res.json({ valid: true, message: "verified" });
  } catch (e: any) {
    logger.error(e, "Verification failed");
    return res.status(400).json({ valid: false, message: e.message });
  }
});

app.post("/settle", async (req, res) => {
  try {
    const payment = PaymentSchema.parse(req.body);
    const connection = getConnection();
    const feePayer = loadFeePayer();
    const mint = new PublicKey(payment.asset);
    const buyer = new PublicKey(payment.buyer);
    const merchant = new PublicKey(payment.payTo);
    
    // Calculate protocol fee
    const feePercent = Number(process.env.FEE_PERCENT || 1);
    const totalAmount = BigInt(payment.amount);
    const feeAmount = (totalAmount * BigInt(feePercent)) / BigInt(100);
    const merchantAmount = totalAmount - feeAmount;
    
    const treasury = process.env.TREASURY_ADDRESS 
      ? new PublicKey(process.env.TREASURY_ADDRESS)
      : null;

    // MVP MODE: For demonstration, we return simulated transaction hashes
    // This allows the x402 flow to complete for testing the protocol
    // PRODUCTION: Remove this block and implement one of these patterns:
    // 1. Delegate approval: buyer pre-approves facilitator to transfer exact amount
    // 2. Client-signed transaction: buyer signs the transaction and includes txSignature
    // 3. Escrow: funds locked in program-controlled account released on verification
    
    if (!payment.txSignature) {
      logger.warn("MVP mode: simulating settlement without actual on-chain transaction");
      
      // Generate simulated transaction hashes for demonstration
      const simulatedMerchantTx = `SIM_MERCHANT_${Buffer.from(
        `${payment.buyer}_${merchantAmount}_${Date.now()}`
      ).toString('base64').substring(0, 64)}`;
      
      const simulatedFeeTx = treasury ? `SIM_FEE_${Buffer.from(
        `${payment.buyer}_${feeAmount}_${Date.now()}`
      ).toString('base64').substring(0, 64)}` : null;
      
      logger.info({ 
        simulatedMerchantTx,
        simulatedFeeTx,
        buyer: payment.buyer,
        totalAmount: payment.amount,
        merchantAmount: merchantAmount.toString(),
        feeAmount: feeAmount.toString(),
        feePercent,
        mode: "MVP_SIMULATION"
      }, "Payment simulated with fee split (not settled on-chain)");
      
      return res.json({ 
        merchantTx: simulatedMerchantTx,
        feeTx: simulatedFeeTx,
        simulated: true,
        feePercent,
        merchantAmount: merchantAmount.toString(),
        feeAmount: feeAmount.toString(),
        message: "MVP mode: payment verified but not settled on-chain. See PRODUCTION_NOTES.md for implementation patterns."
      });
    }

    // PRODUCTION PATH: With buyer's transaction signature
    // Transfer to merchant
    const merchantTx = await tokenTransferTx({
      connection,
      mint,
      from: buyer,
      to: merchant,
      amount: merchantAmount,
      feePayer
    });
    
    // Add buyer's signature to merchant transaction
    merchantTx.addSignature(buyer, Buffer.from(bs58.decode(payment.txSignature)));
    const merchantSig = await connection.sendTransaction(merchantTx, [feePayer], { skipPreflight: false });
    await connection.confirmTransaction(merchantSig, "confirmed");
    
    logger.info({ 
      txHash: merchantSig, 
      buyer: payment.buyer, 
      merchant: payment.payTo,
      amount: merchantAmount.toString() 
    }, "Merchant payment settled on-chain");

    // Transfer fee to treasury if configured
    let feeSig = null;
    if (treasury && feeAmount > 0n) {
      const feeTx = await tokenTransferTx({
        connection,
        mint,
        from: buyer,
        to: treasury,
        amount: feeAmount,
        feePayer
      });
      
      feeTx.addSignature(buyer, Buffer.from(bs58.decode(payment.txSignature)));
      feeSig = await connection.sendTransaction(feeTx, [feePayer], { skipPreflight: false });
      await connection.confirmTransaction(feeSig, "confirmed");
      
      logger.info({ 
        txHash: feeSig, 
        treasury: treasury.toBase58(),
        feeAmount: feeAmount.toString(),
        feePercent
      }, "Fee applied: wXNT → Treasury");
    }

    return res.json({ 
      merchantTx: merchantSig,
      feeTx: feeSig,
      simulated: false,
      feePercent,
      merchantAmount: merchantAmount.toString(),
      feeAmount: feeAmount.toString()
    });
  } catch (e: any) {
    logger.error(e, "Settlement failed");
    return res.status(400).json({ error: e.message });
  }
});

app.listen(PORT, () => logger.info(`✅ Facilitator up on :${PORT}`));
