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

app.use("/premium", x420(), x402("X1Pays"), premium);

app.listen(PORT, () => logger.info(`🚀 API up on :${PORT}`));
