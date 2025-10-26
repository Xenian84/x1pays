import { Router, type Request, type Response } from "express";

const r: Router = Router();

r.get("/data", async (req: Request, res: Response) => {
  const tx = res.locals.txHash || "unpaid";
  const paymentResponse = {
    merchantTx: res.locals.merchantTx,
    feeTx: res.locals.feeTx,
    feePercent: res.locals.feePercent,
    merchantAmount: res.locals.merchantAmount,
    feeAmount: res.locals.feeAmount,
    simulated: res.locals.simulated,
    // Backward compatibility
    txHash: tx
  };
  
  res.setHeader("X-PAYMENT-RESPONSE", JSON.stringify(paymentResponse));
  res.json({
    ok: true,
    service: "x1pays-premium",
    ts: new Date().toISOString(),
    paidTx: tx,
    payment: paymentResponse,
    sample: { msg: "Access granted via x402 on X1 (wXNT)" }
  });
});

export default r;
