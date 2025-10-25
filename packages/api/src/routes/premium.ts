import { Router } from "express";

const r = Router();

r.get("/data", async (req, res) => {
  const tx = res.locals.txHash || "unpaid";
  res.setHeader("X-PAYMENT-RESPONSE", JSON.stringify({ txHash: tx }));
  res.json({
    ok: true,
    service: "x1pays-premium",
    ts: new Date().toISOString(),
    paidTx: tx,
    sample: { msg: "Access granted via x402 on X1 (wXNT)" }
  });
});

export default r;
