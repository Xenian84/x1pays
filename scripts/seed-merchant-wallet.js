import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

console.log("Generating new X1 wallet for merchant...\n");

const kp = Keypair.generate();

console.log("PUBLIC KEY (use for PAYTO_ADDRESS):");
console.log(kp.publicKey.toBase58());
console.log();

console.log("SECRET KEY (base58, use for FEE_PAYER_SECRET or store securely):");
console.log(bs58.encode(kp.secretKey));
console.log();

console.log("⚠️  IMPORTANT: Store the secret key securely!");
console.log("Never commit it to version control or share it publicly.");
console.log();
console.log("Add to your .env file:");
console.log(`PAYTO_ADDRESS=${kp.publicKey.toBase58()}`);
console.log(`FEE_PAYER_SECRET=${bs58.encode(kp.secretKey)}`);
