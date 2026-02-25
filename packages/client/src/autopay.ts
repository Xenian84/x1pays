import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { KeypairPermitSigner } from "./permitSigner.js";
import { fetchX402, fetchX402JSON, type X402FetchConfig } from "./fetch.js";
import type { X402Response } from "./types.js";

export interface AutoPayClientConfig {
  privateKey: string;
  rpcUrl?: string;
  maxPaymentPerRequest?: string;
  paymentTimeout?: number;
}

export class AutoPayClient {
  private keypair: Keypair;
  private signer: KeypairPermitSigner;
  private rpcUrl?: string;
  private maxPayment?: string;
  private timeout: number;
  private spent = 0n;
  private requestCount = 0;

  constructor(config: AutoPayClientConfig) {
    this.keypair = Keypair.fromSecretKey(bs58.decode(config.privateKey));
    this.signer = new KeypairPermitSigner(this.keypair);
    this.rpcUrl = config.rpcUrl;
    this.maxPayment = config.maxPaymentPerRequest;
    this.timeout = config.paymentTimeout || 15000;
  }

  get address(): string {
    return this.keypair.publicKey.toBase58();
  }

  async fetch(url: string | URL, init?: RequestInit): Promise<Response & { x402Payment?: any }> {
    this.requestCount++;
    return fetchX402(url, {
      ...init,
      permitSigner: this.signer,
      rpcUrl: this.rpcUrl,
      maxPaymentAmount: this.maxPayment,
      paymentTimeout: this.timeout,
    });
  }

  async fetchJSON<T = any>(url: string | URL, init?: RequestInit): Promise<X402Response<T>> {
    this.requestCount++;
    return fetchX402JSON<T>(url, {
      ...init,
      permitSigner: this.signer,
      rpcUrl: this.rpcUrl,
      maxPaymentAmount: this.maxPayment,
      paymentTimeout: this.timeout,
    });
  }

  get stats() {
    return {
      address: this.address,
      requestCount: this.requestCount,
    };
  }
}

export function createAutoPayClient(config: AutoPayClientConfig): AutoPayClient {
  return new AutoPayClient(config);
}
