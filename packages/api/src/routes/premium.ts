import { Router, type Request, type Response } from "express";

const r: Router = Router();

r.get("/data", async (req: Request, res: Response) => {
  const tx = res.locals.txHash || "unpaid";
  const paymentResponse = {
    txHash: tx,
    amount: res.locals.amount,
    network: res.locals.network
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
