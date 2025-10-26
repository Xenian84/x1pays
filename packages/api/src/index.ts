import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pino from "pino";
import { x402 } from "./middleware/x402.js";
import { x420 } from "./middleware/x420.js";
import premium from "./routes/premium.js";

const PORT = Number(process.env.PORT || 3000);
const logger = pino({ transport: { target: "pino-pretty" } });
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());

app.get("/health", (_req, res) => res.json({ ok: true, service: "x1pays-api" }));

app.get("/stats", (_req, res) => {
  const stats = {
    totalPayments: 1247,
    totalVolume: "124,700",
    avgPaymentSize: "100",
    treasuryBalance: "1,247",
    merchantCount: 42,
    last24h: {
      payments: 89,
      volume: "8,900"
    }
  };
  
  res.json(stats);
});

app.use("/premium", x420(), x402("X1Pays"), premium);

app.listen(PORT, () => logger.info(`🚀 API up on :${PORT}`));
