import axios from "axios";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { Keypair } from "@solana/web3.js";

export type PayConfig = {
  facilitatorUrl: string;
  payTo: string;
  asset: string;
  network?: "x1-mainnet" | "x1-devnet";
  amountAtomic: string;
};

export function signPayment(payer: Keypair, payload: object) {
  const msg = Buffer.from(JSON.stringify(payload));
  const sig = nacl.sign.detached(msg, payer.secretKey);
  return bs58.encode(sig);
}

export async function getWithPayment(url: string, payer: Keypair, cfg: PayConfig) {
  const pay = {
    scheme: "exact" as const,
    network: cfg.network || "x1-mainnet" as const,
    payTo: cfg.payTo,
    asset: cfg.asset,
    amount: cfg.amountAtomic,
    buyer: payer.publicKey.toBase58(),
    memo: null
  };

  const signature = signPayment(payer, pay);
  const headers = { "X-PAYMENT": JSON.stringify({ ...pay, signature }) };

  const res = await axios.get(url, { headers, validateStatus: () => true });

  if (res.status === 402) {
    throw new Error("Payment not accepted / verify failed");
  }

  return res.data;
}
