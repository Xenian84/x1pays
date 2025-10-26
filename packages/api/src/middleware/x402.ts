import axios from "axios";
import type { Request, Response, NextFunction } from "express";

export function x402(domainBrand = "X1Pays") {
  return async (req: Request, res: Response, next: NextFunction) => {
    const paymentHeader = req.headers["x-payment"];

    if (!paymentHeader) {
      res.setHeader("Cache-Control", "no-store");
      return res.status(402).json({
        x402Version: 1,
        info: `${domainBrand} x402`,
        feePercent: Number(process.env.FEE_PERCENT || 1),
        accepts: [{
          scheme: "exact",
          network: process.env.NETWORK || "x1-mainnet",
          payTo: process.env.PAYTO_ADDRESS,
          asset: process.env.WXNT_MINT,
          maxAmountRequired: "1000",
          resource: req.originalUrl,
          description: "Premium API access (per-call via wXNT)"
        }]
      });
    }

    try {
      const payment = JSON.parse(String(paymentHeader));
      
      // Server-side validation: ensure payment matches expected configuration
      if (payment.network !== (process.env.NETWORK || "x1-mainnet")) {
        return res.status(402).json({ error: "Invalid network" });
      }
      
      if (payment.payTo !== process.env.PAYTO_ADDRESS) {
        return res.status(402).json({ error: "Invalid payTo address" });
      }
      
      if (payment.asset !== process.env.WXNT_MINT) {
        return res.status(402).json({ error: "Invalid asset" });
      }
      
      // Validate amount meets minimum requirement
      const requiredAmount = BigInt("1000"); // Should be configurable per endpoint
      if (BigInt(payment.amount) < requiredAmount) {
        return res.status(402).json({ error: "Insufficient payment amount" });
      }
      
      const verify = await axios.post(
        `${process.env.FACILITATOR_URL}/verify`,
        payment,
        { timeout: 10_000 }
      );

      if (!verify.data.valid) {
        return res.status(402).json(verify.data);
      }

      const settle = await axios.post(
        `${process.env.FACILITATOR_URL}/settle`,
        payment,
        { timeout: 20_000 }
      );

      // Store settlement details (fee split model)
      res.locals.merchantTx = settle.data.merchantTx;
      res.locals.feeTx = settle.data.feeTx;
      res.locals.feePercent = settle.data.feePercent;
      res.locals.merchantAmount = settle.data.merchantAmount;
      res.locals.feeAmount = settle.data.feeAmount;
      res.locals.simulated = settle.data.simulated;
      
      // Backward compatibility: use merchantTx as primary txHash
      res.locals.txHash = settle.data.merchantTx;
      
      return next();
    } catch (e: any) {
      return res.status(402).json({
        error: "Invalid or missing payment",
        detail: e.message
      });
    }
  };
}
