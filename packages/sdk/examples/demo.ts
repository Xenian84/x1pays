import { Keypair } from "@solana/web3.js";
import { getWithPayment } from "../src/index.js";

const payer = Keypair.generate();

const data = await getWithPayment(
  "http://localhost:3000/premium/data",
  payer,
  {
    facilitatorUrl: "http://localhost:4000",
    payTo: process.env.PAYTO_ADDRESS!,
    asset: process.env.WXNT_MINT!,
    amountAtomic: "1000"
  }
);

console.log(data);
