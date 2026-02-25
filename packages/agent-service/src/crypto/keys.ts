import { Keypair } from '@solana/web3.js';
import { createHash, createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const DERIVATION_MSG = 'X1PAYS_AGENT_KEY_V1';
const ALGORITHM = 'aes-256-gcm';

export function generateAgentKeypair(): Keypair {
  return Keypair.generate();
}

export function deriveEncryptionKey(walletAddress: string): Buffer {
  return createHash('sha256')
    .update(`${DERIVATION_MSG}:${walletAddress}`)
    .digest();
}

export function encryptKeypair(keypair: Keypair, walletAddress: string): string {
  const key = deriveEncryptionKey(walletAddress);
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const secretBytes = Buffer.from(keypair.secretKey);
  const encrypted = Buffer.concat([cipher.update(secretBytes), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, authTag, encrypted]).toString('base64');
}

export function decryptKeypair(encrypted: string, walletAddress: string): Keypair {
  const key = deriveEncryptionKey(walletAddress);
  const data = Buffer.from(encrypted, 'base64');

  const iv = data.subarray(0, 12);
  const authTag = data.subarray(12, 28);
  const ciphertext = data.subarray(28);

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return Keypair.fromSecretKey(new Uint8Array(decrypted));
}

export function encryptString(plaintext: string, walletAddress: string): string {
  const key = deriveEncryptionKey(walletAddress);
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(Buffer.from(plaintext, 'utf-8')),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, authTag, encrypted]).toString('base64');
}

export function decryptString(encrypted: string, walletAddress: string): string {
  const key = deriveEncryptionKey(walletAddress);
  const data = Buffer.from(encrypted, 'base64');

  const iv = data.subarray(0, 12);
  const authTag = data.subarray(12, 28);
  const ciphertext = data.subarray(28);

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf-8');
}
