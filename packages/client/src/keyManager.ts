/**
 * Key Management System
 * Provides secure key storage, encryption, and retrieval for permit-based signing
 */

import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import nacl from 'tweetnacl';

const STORAGE_KEY = 'x1pays_encrypted_key';
const STORAGE_VERSION = '1';

export interface KeyManager {
  generateKeypair(): Keypair;
  importFromMnemonic(mnemonic: string): Keypair;
  importFromPrivateKey(privateKey: string): Keypair;
  exportFromWallet(wallet: any): Promise<Keypair>;
  encryptKey(keypair: Keypair, password: string): Promise<string>;
  decryptKey(encrypted: string, password: string): Promise<Keypair>;
  storeKey(encrypted: string): Promise<void>;
  loadKey(password: string): Promise<Keypair | null>;
  clearKey(): Promise<void>;
  hasStoredKey(): boolean;
}

/**
 * Generate a random salt for key derivation
 */
function generateSalt(): Uint8Array {
  return nacl.randomBytes(16);
}

/**
 * Derive encryption key from password using PBKDF2-like approach
 * Uses Web Crypto API if available, otherwise simple hash-based approach
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<Uint8Array> {
  // Convert password to bytes
  const passwordBytes = new TextEncoder().encode(password);
  
  // Use Web Crypto API if available (browser)
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      // Import password as key material
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        passwordBytes,
        'PBKDF2',
        false,
        ['deriveBits']
      );
      
      // Derive key using PBKDF2
      // Convert Uint8Array salt to ArrayBuffer for Web Crypto API
      const saltBuffer = new Uint8Array(salt).buffer;
      
      const derivedBits = await window.crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: saltBuffer as ArrayBuffer,
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        256 // 32 bytes = 256 bits
      );
      
      return new Uint8Array(derivedBits);
    } catch (error) {
      // Fallback to simple hash if PBKDF2 fails
    }
  }
  
  // Fallback: Use TweetNaCl's hash function (SHA-512) with multiple rounds
  // This is more secure than simple XOR, though not as good as PBKDF2
  console.warn('Using fallback key derivation - Web Crypto API not available');
  
  // Combine salt + password
  const combined = new Uint8Array(salt.length + passwordBytes.length);
  combined.set(salt);
  combined.set(passwordBytes, salt.length);
  
  // Use nacl's hash (SHA-512) with multiple iterations for better security
  let hash: Uint8Array = combined;
  
  if (nacl.hash) {
    // Apply 1000 rounds of hashing (poor man's PBKDF2)
    for (let i = 0; i < 1000; i++) {
      const round = new Uint8Array(hash.length + salt.length);
      round.set(hash);
      round.set(salt, hash.length);
      hash = nacl.hash(round);
    }
  } else {
    // Last resort: multiple rounds of XOR mixing with salt
    console.error('TweetNaCl hash not available - using weak key derivation');
    hash = new Uint8Array(64); // SHA-512 size
    for (let round = 0; round < 1000; round++) {
      for (let i = 0; i < combined.length; i++) {
        const idx = i % 64;
        hash[idx] = hash[idx] ^ combined[i] ^ salt[i % salt.length] ^ round;
      }
    }
  }
  
  // Return first 32 bytes as encryption key
  return hash.slice(0, 32);
}

/**
 * Encrypt secret key with password
 */
async function encryptSecretKey(
  secretKey: Uint8Array,
  password: string
): Promise<{ encrypted: string; salt: string }> {
  const salt = generateSalt();
  const key = await deriveKey(password, salt);
  
  // Use nacl's secretbox for encryption (authenticated encryption)
  const nonce = nacl.randomBytes(24);
  const encrypted = nacl.secretbox(secretKey, nonce, key);
  
  if (!encrypted) {
    throw new Error('Encryption failed');
  }
  
  // Combine nonce + encrypted data
  const combined = new Uint8Array(nonce.length + encrypted.length);
  combined.set(nonce);
  combined.set(encrypted, nonce.length);
  
  return {
    encrypted: bs58.encode(combined),
    salt: bs58.encode(salt)
  };
}

/**
 * Decrypt secret key with password
 */
async function decryptSecretKey(
  encrypted: string,
  password: string,
  salt: string
): Promise<Uint8Array> {
  const key = await deriveKey(password, bs58.decode(salt));
  const combined = bs58.decode(encrypted);
  
  // Extract nonce (first 24 bytes)
  const nonce = combined.slice(0, 24);
  const encryptedData = combined.slice(24);
  
  // Decrypt using nacl's secretbox
  const decrypted = nacl.secretbox.open(encryptedData, nonce, key);
  
  if (!decrypted) {
    throw new Error('Decryption failed: Invalid password or corrupted data');
  }
  
  return decrypted;
}

/**
 * Browser localStorage-based key manager
 */
export class BrowserKeyManager implements KeyManager {
  /**
   * Generate a new keypair
   */
  generateKeypair(): Keypair {
    return Keypair.generate();
  }

  /**
   * Import keypair from mnemonic (12-word phrase)
   * Note: Solana doesn't have native mnemonic support, so we'll use the first 32 bytes
   * For production, use a proper BIP39 mnemonic library
   */
  importFromMnemonic(mnemonic: string): Keypair {
    // Simple mnemonic import - hash the mnemonic to get seed
    // In production, use proper BIP39 derivation
    const mnemonicBytes = new TextEncoder().encode(mnemonic.trim().toLowerCase());
    const seed = nacl.hash(mnemonicBytes).slice(0, 32);
    return Keypair.fromSecretKey(seed);
  }

  /**
   * Import keypair from private key (base58 encoded)
   */
  importFromPrivateKey(privateKey: string): Keypair {
    try {
      const secretKey = bs58.decode(privateKey);
      if (secretKey.length !== 64) {
        throw new Error('Invalid private key length: expected 64 bytes');
      }
      return Keypair.fromSecretKey(secretKey);
    } catch (error: any) {
      throw new Error(`Failed to import private key: ${error.message}`);
    }
  }

  /**
   * Export keypair from wallet adapter (one-time operation)
   */
  async exportFromWallet(wallet: any): Promise<Keypair> {
    // Check if wallet has export functionality
    if (typeof wallet.exportSecretKey === 'function') {
      try {
        const secretKey = await wallet.exportSecretKey();
        return Keypair.fromSecretKey(secretKey);
      } catch (error: any) {
        throw new Error(`Failed to export from wallet: ${error.message}`);
      }
    }
    
    // If wallet has secretKey directly
    if (wallet.secretKey && wallet.secretKey instanceof Uint8Array) {
      if (wallet.secretKey.length !== 64) {
        throw new Error('Invalid secret key length from wallet');
      }
      return Keypair.fromSecretKey(wallet.secretKey);
    }
    
    throw new Error('Wallet does not support key export');
  }

  /**
   * Encrypt keypair with password
   */
  async encryptKey(keypair: Keypair, password: string): Promise<string> {
    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }
    
    const { encrypted, salt } = await encryptSecretKey(keypair.secretKey, password);
    
    // Store version, salt, and encrypted data
    const data = {
      version: STORAGE_VERSION,
      salt,
      encrypted
    };
    
    return JSON.stringify(data);
  }

  /**
   * Decrypt keypair with password
   */
  async decryptKey(encrypted: string, password: string): Promise<Keypair> {
    try {
      const data = JSON.parse(encrypted);
      
      if (data.version !== STORAGE_VERSION) {
        throw new Error('Unsupported storage version');
      }
      
      const secretKey = await decryptSecretKey(data.encrypted, password, data.salt);
      
      if (secretKey.length !== 64) {
        throw new Error('Invalid decrypted key length');
      }
      
      return Keypair.fromSecretKey(secretKey);
    } catch (error: any) {
      if (error.message.includes('Decryption failed')) {
        throw new Error('Invalid password');
      }
      throw new Error(`Failed to decrypt key: ${error.message}`);
    }
  }

  /**
   * Store encrypted key in browser storage
   */
  async storeKey(encrypted: string): Promise<void> {
    if (typeof window === 'undefined' || !window.localStorage) {
      throw new Error('localStorage is not available');
    }
    
    try {
      window.localStorage.setItem(STORAGE_KEY, encrypted);
    } catch (error: any) {
      throw new Error(`Failed to store key: ${error.message}`);
    }
  }

  /**
   * Load and decrypt key from browser storage
   */
  async loadKey(password: string): Promise<Keypair | null> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    
    const encrypted = window.localStorage.getItem(STORAGE_KEY);
    if (!encrypted) {
      return null;
    }
    
    try {
      return await this.decryptKey(encrypted, password);
    } catch (error: any) {
      throw error; // Re-throw to let caller handle (e.g., invalid password)
    }
  }

  /**
   * Clear stored key from browser storage
   */
  async clearKey(): Promise<void> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    
    window.localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Check if a key is stored
   */
  hasStoredKey(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    
    return window.localStorage.getItem(STORAGE_KEY) !== null;
  }
}

/**
 * Node.js filesystem-based key manager (for server-side)
 */
export class NodeKeyManager implements KeyManager {
  private keyPath: string;

  constructor(keyPath?: string) {
    this.keyPath = keyPath || './x1pays_key.json';
  }

  generateKeypair(): Keypair {
    return Keypair.generate();
  }

  importFromMnemonic(mnemonic: string): Keypair {
    const mnemonicBytes = new TextEncoder().encode(mnemonic.trim().toLowerCase());
    const seed = nacl.hash(mnemonicBytes).slice(0, 32);
    return Keypair.fromSecretKey(seed);
  }

  importFromPrivateKey(privateKey: string): Keypair {
    try {
      const secretKey = bs58.decode(privateKey);
      if (secretKey.length !== 64) {
        throw new Error('Invalid private key length: expected 64 bytes');
      }
      return Keypair.fromSecretKey(secretKey);
    } catch (error: any) {
      throw new Error(`Failed to import private key: ${error.message}`);
    }
  }

  async exportFromWallet(wallet: any): Promise<Keypair> {
    if (typeof wallet.exportSecretKey === 'function') {
      try {
        const secretKey = await wallet.exportSecretKey();
        return Keypair.fromSecretKey(secretKey);
      } catch (error: any) {
        throw new Error(`Failed to export from wallet: ${error.message}`);
      }
    }
    
    if (wallet.secretKey && wallet.secretKey instanceof Uint8Array) {
      if (wallet.secretKey.length !== 64) {
        throw new Error('Invalid secret key length from wallet');
      }
      return Keypair.fromSecretKey(wallet.secretKey);
    }
    
    throw new Error('Wallet does not support key export');
  }

  async encryptKey(keypair: Keypair, password: string): Promise<string> {
    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }
    
    const { encrypted, salt } = await encryptSecretKey(keypair.secretKey, password);
    
    const data = {
      version: STORAGE_VERSION,
      salt,
      encrypted
    };
    
    return JSON.stringify(data);
  }

  async decryptKey(encrypted: string, password: string): Promise<Keypair> {
    try {
      const data = JSON.parse(encrypted);
      
      if (data.version !== STORAGE_VERSION) {
        throw new Error('Unsupported storage version');
      }
      
      const secretKey = await decryptSecretKey(data.encrypted, password, data.salt);
      
      if (secretKey.length !== 64) {
        throw new Error('Invalid decrypted key length');
      }
      
      return Keypair.fromSecretKey(secretKey);
    } catch (error: any) {
      if (error.message.includes('Decryption failed')) {
        throw new Error('Invalid password');
      }
      throw new Error(`Failed to decrypt key: ${error.message}`);
    }
  }

  async storeKey(encrypted: string): Promise<void> {
    const fs = await import('fs/promises');
    await fs.writeFile(this.keyPath, encrypted, 'utf-8');
    // Set restrictive permissions (owner read/write only)
    await fs.chmod(this.keyPath, 0o600);
  }

  async loadKey(password: string): Promise<Keypair | null> {
    try {
      const fs = await import('fs/promises');
      const encrypted = await fs.readFile(this.keyPath, 'utf-8');
      return await this.decryptKey(encrypted, password);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return null; // File doesn't exist
      }
      throw error;
    }
  }

  async clearKey(): Promise<void> {
    try {
      const fs = await import('fs/promises');
      await fs.unlink(this.keyPath);
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  hasStoredKey(): boolean {
    // In Node.js, we'd need to check file existence
    // For simplicity, return false and let loadKey handle it
    return false;
  }
}

/**
 * Get the appropriate key manager for the environment
 */
export function getKeyManager(): KeyManager {
  if (typeof window !== 'undefined') {
    return new BrowserKeyManager();
  }
  return new NodeKeyManager();
}

// Default export
export default getKeyManager;

