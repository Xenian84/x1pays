import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
  ComputeBudgetProgram,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  getAccount,
  createTransferCheckedInstruction,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import bs58 from "bs58";
import { randomBytes } from "crypto";
import { ASSETS, resolveAsset, resolveTokenProgram, defaultRpcUrl } from "./assets.js";
import { PolicyManager } from "./policy.js";
import { buildSignedPayment } from "./payment.js";
import type {
  Network,
  AssetSymbol,
  TokenBalance,
  TxResult,
  PayResult,
  PaymentRequirement,
  PayOptions,
  WalletConfig,
  WalletStats,
  TxRecord,
  SpendingPolicy,
  PolicyCheck,
} from "./types.js";

const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

export class WalletManager {
  readonly keypair: Keypair;
  readonly address: string;
  private connection: Connection;
  private network: Network;
  private facilitatorUrl: string;
  private policyManager: PolicyManager;
  private txHistory: TxRecord[] = [];

  constructor(
    privateKeyOrKeypair: string | Keypair,
    config: WalletConfig = {}
  ) {
    if (!privateKeyOrKeypair) throw new Error("Private key or Keypair is required");
    try {
      this.keypair =
        typeof privateKeyOrKeypair === "string"
          ? Keypair.fromSecretKey(bs58.decode(privateKeyOrKeypair))
          : privateKeyOrKeypair;
    } catch (err: any) {
      throw new Error(`Invalid private key: ${err.message}`);
    }
    this.address = this.keypair.publicKey.toBase58();
    this.network = config.network || "x1-mainnet";
    this.connection = new Connection(
      config.rpcUrl || defaultRpcUrl(this.network),
      "confirmed"
    );
    this.facilitatorUrl =
      config.facilitatorUrl || "https://x1pays.xyz/facilitator-alpha-mainnet";
    this.policyManager = new PolicyManager();
  }

  static generate(config: WalletConfig = {}): WalletManager {
    return new WalletManager(Keypair.generate(), config);
  }

  static fromSecretKey(
    base58Key: string,
    config: WalletConfig = {}
  ): WalletManager {
    if (!base58Key || typeof base58Key !== "string") {
      throw new Error("Base58 secret key must be a non-empty string");
    }
    return new WalletManager(base58Key, config);
  }

  get secretKey(): string {
    return bs58.encode(this.keypair.secretKey);
  }

  getConnection(): Connection {
    return this.connection;
  }

  getNetwork(): Network {
    return this.network;
  }

  getFacilitatorUrl(): string {
    return this.facilitatorUrl;
  }

  // ── Spending Policy ──

  setPolicy(policy: Partial<SpendingPolicy>): void {
    this.policyManager.setPolicy(policy);
  }

  checkPolicy(amount: bigint, asset: string, recipient?: string): PolicyCheck {
    return this.policyManager.check(amount, asset, recipient);
  }

  // ── Balances ──

  async getBalances(): Promise<Record<string, TokenBalance>> {
    const balances: Record<string, TokenBalance> = {};

    const xntBal = await this.connection.getBalance(this.keypair.publicKey);
    balances.XNT = {
      symbol: "XNT",
      name: "XNT",
      mint: "native",
      amount: BigInt(xntBal),
      decimals: 9,
      uiAmount: xntBal / 1e9,
    };

    for (const [symbol, asset] of Object.entries(ASSETS)) {
      if (asset.type === "native") continue;
      try {
        const mint = new PublicKey(asset.mint);
        const tokenProgramId = await resolveTokenProgram(this.connection, mint);
        const ata = await getAssociatedTokenAddress(
          mint, this.keypair.publicKey, false, tokenProgramId
        );
        const account = await getAccount(
          this.connection, ata, "confirmed", tokenProgramId
        );
        balances[symbol] = {
          symbol: asset.symbol,
          name: asset.name,
          mint: asset.mint,
          amount: account.amount,
          decimals: asset.decimals,
          uiAmount: Number(account.amount) / 10 ** asset.decimals,
        };
      } catch {
        balances[symbol] = {
          symbol: asset.symbol,
          name: asset.name,
          mint: asset.mint,
          amount: 0n,
          decimals: asset.decimals,
          uiAmount: 0,
        };
      }
    }

    return balances;
  }

  async getBalance(asset: AssetSymbol): Promise<TokenBalance> {
    const balances = await this.getBalances();
    return balances[asset] || { symbol: asset, name: asset, mint: "", amount: 0n, decimals: 0, uiAmount: 0 };
  }

  // ── Transfers ──

  async send(
    to: string,
    amount: string,
    asset: AssetSymbol
  ): Promise<TxResult> {
    if (!to || typeof to !== "string") throw new Error("Recipient address is required");
    if (!amount || typeof amount !== "string") throw new Error("Amount is required");
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) throw new Error(`Invalid amount: ${amount}. Must be a positive number`);

    let recipient: PublicKey;
    try { recipient = new PublicKey(to); } catch { throw new Error(`Invalid recipient address: ${to}`); }

    const assetInfo = resolveAsset(asset);
    const amountAtomic = BigInt(Math.round(parsed * 10 ** assetInfo.decimals));
    if (amountAtomic <= 0n) throw new Error("Amount too small");

    const check = this.policyManager.check(amountAtomic, asset, to);
    if (!check.allowed) throw new Error(`Policy violation: ${check.reason}`);

    const mint = new PublicKey(assetInfo.mint);
    const tokenProgramId = await resolveTokenProgram(this.connection, mint);

    const buyerAta = await getAssociatedTokenAddress(
      mint, this.keypair.publicKey, false, tokenProgramId
    );
    const recipientAta = await getAssociatedTokenAddress(
      mint, recipient, false, tokenProgramId
    );

    const tx = new Transaction();
    tx.add(ComputeBudgetProgram.setComputeUnitLimit({ units: 200_000 }));
    tx.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1_000 }));

    const recipientAtaInfo = await this.connection.getAccountInfo(recipientAta);
    if (!recipientAtaInfo) {
      tx.add(
        createAssociatedTokenAccountInstruction(
          this.keypair.publicKey, recipientAta, recipient, mint, tokenProgramId
        )
      );
    }

    tx.add(
      createTransferCheckedInstruction(
        buyerAta, mint, recipientAta, this.keypair.publicKey,
        amountAtomic, assetInfo.decimals, [], tokenProgramId
      )
    );

    const { blockhash } = await this.connection.getLatestBlockhash("confirmed");
    tx.recentBlockhash = blockhash;
    tx.feePayer = this.keypair.publicKey;
    tx.sign(this.keypair);

    const txHash = await this.connection.sendRawTransaction(tx.serialize(), {
      skipPreflight: false,
    });

    this.policyManager.recordSpend(amountAtomic);
    const record: TxResult = {
      txHash,
      amount: amount,
      asset,
      to,
      timestamp: Date.now(),
    };
    this.txHistory.push(record);
    return record;
  }

  // ── x402 Payments ──

  async probeResource(url: string): Promise<PaymentRequirement | null> {
    if (!url || typeof url !== "string") throw new Error("URL is required");
    try {
      const res = await fetch(url);
      if (res.status !== 402) return null;
      const header = res.headers.get("X-Payment-Required");
      if (!header) return null;
      try {
        return JSON.parse(header) as PaymentRequirement;
      } catch {
        throw new Error("Invalid X-Payment-Required header: not valid JSON");
      }
    } catch (err: any) {
      if (err.message?.includes("X-Payment-Required")) throw err;
      throw new Error(`Failed to probe resource ${url}: ${err.message}`);
    }
  }

  async payForResource(
    url: string,
    options: PayOptions = {}
  ): Promise<PayResult> {
    if (!url || typeof url !== "string") throw new Error("URL is required");
    const probeRes = await fetch(url);

    if (probeRes.status !== 402) {
      return {
        data: await probeRes.json().catch(() => probeRes.text()),
        txHash: "",
        amount: "0",
      };
    }

    const paymentReqHeader = probeRes.headers.get("X-Payment-Required");
    if (!paymentReqHeader)
      throw new Error("402 response but no X-Payment-Required header");

    let requirement: any;
    try {
      requirement = JSON.parse(paymentReqHeader);
    } catch {
      throw new Error("Invalid X-Payment-Required header: not valid JSON");
    }
    const accepts = requirement.accepts || [];
    if (accepts.length === 0)
      throw new Error("No payment options in 402 response");

    const preferredMint = options.preferredAsset
      ? ASSETS[options.preferredAsset]?.mint
      : undefined;
    const accept =
      (preferredMint &&
        accepts.find((a: any) => a.asset === preferredMint)) ||
      accepts[0];
    const feePayer = accept.extra?.feePayer;
    const facUrl = accept.facilitatorUrl || this.facilitatorUrl;

    if (!feePayer) throw new Error("No feePayer in payment requirement");

    const paymentAmount = BigInt(accept.maxAmountRequired || "0");

    const check = this.policyManager.check(paymentAmount, accept.asset);
    if (!check.allowed) throw new Error(`Policy violation: ${check.reason}`);

    const signedPayment = await buildSignedPayment({
      keypair: this.keypair,
      connection: this.connection,
      network: this.network,
      accept,
      paymentAmount,
      feePayer,
    });

    const verifyRes = await fetch(`${facUrl}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signedPayment),
    });
    const verifyData = await verifyRes.json().catch(() => {
      throw new Error(`Facilitator /verify returned non-JSON response (status ${verifyRes.status})`);
    }) as any;
    if (!verifyData.valid)
      throw new Error(`Verification failed: ${verifyData.message}`);

    const settleRes = await fetch(`${facUrl}/settle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signedPayment),
    });
    if (!settleRes.ok) {
      const errBody = await settleRes.text().catch(() => "unknown error");
      throw new Error(`Settlement failed (${settleRes.status}): ${errBody}`);
    }
    const settlement = await settleRes.json().catch(() => {
      throw new Error(`Facilitator /settle returned non-JSON response (status ${settleRes.status})`);
    }) as any;
    if (!settlement.txHash)
      throw new Error(`Settlement failed: ${JSON.stringify(settlement)}`);

    this.policyManager.recordSpend(paymentAmount);
    this.txHistory.push({
      txHash: settlement.txHash,
      amount: paymentAmount.toString(),
      asset: accept.asset,
      to: accept.payTo,
      timestamp: Date.now(),
    });

    const resourceRes = await fetch(url, {
      headers: {
        "X-Payment": JSON.stringify({
          ...signedPayment,
          txHash: settlement.txHash,
        }),
      },
    });
    const data = await resourceRes.json().catch(() => resourceRes.text());

    return {
      data,
      txHash: settlement.txHash,
      amount: paymentAmount.toString(),
    };
  }

  // ── Stats & History ──

  get stats(): WalletStats {
    return {
      address: this.address,
      network: this.network,
      totalSpent: Number(this.policyManager.totalSpent),
      sessionBudget: Number(this.policyManager.currentPolicy.sessionBudget),
      budgetRemaining: Number(this.policyManager.remaining),
      transactionCount: this.txHistory.length,
      transactions: [...this.txHistory],
    };
  }

  get history(): TxRecord[] {
    return [...this.txHistory];
  }
}
