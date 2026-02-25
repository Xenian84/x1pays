import type { SpendingPolicy, PolicyCheck, AssetSymbol } from "./types.js";

export class PolicyManager {
  private policy: SpendingPolicy;
  private spent: bigint = 0n;
  private dailySpent: bigint = 0n;
  private dailyResetAt: number = 0;

  constructor(policy?: Partial<SpendingPolicy>) {
    this.policy = {
      maxPerTransaction: policy?.maxPerTransaction ?? 10_000_000n,
      sessionBudget: policy?.sessionBudget ?? 100_000_000n,
      dailyBudget: policy?.dailyBudget,
      allowedAssets: policy?.allowedAssets,
      allowedRecipients: policy?.allowedRecipients,
      requireConfirmation: policy?.requireConfirmation,
    };
    this.resetDailyIfNeeded();
  }

  check(amount: bigint, asset: string, recipient?: string): PolicyCheck {
    if (amount < 0n) return { allowed: false, reason: "Amount cannot be negative" };
    if (!asset) return { allowed: false, reason: "Asset is required" };
    if (amount > this.policy.maxPerTransaction) {
      return {
        allowed: false,
        reason: `Amount ${amount} exceeds per-transaction limit ${this.policy.maxPerTransaction}`,
      };
    }

    if (this.spent + amount > this.policy.sessionBudget) {
      return {
        allowed: false,
        reason: `Would exceed session budget. Spent: ${this.spent}, Budget: ${this.policy.sessionBudget}`,
      };
    }

    if (this.policy.dailyBudget) {
      this.resetDailyIfNeeded();
      if (this.dailySpent + amount > this.policy.dailyBudget) {
        return {
          allowed: false,
          reason: `Would exceed daily budget. Today: ${this.dailySpent}, Limit: ${this.policy.dailyBudget}`,
        };
      }
    }

    if (this.policy.allowedAssets && this.policy.allowedAssets.length > 0) {
      if (!this.policy.allowedAssets.includes(asset as AssetSymbol)) {
        return {
          allowed: false,
          reason: `Asset ${asset} not in allowed list: ${this.policy.allowedAssets.join(", ")}`,
        };
      }
    }

    if (
      recipient &&
      this.policy.allowedRecipients &&
      this.policy.allowedRecipients.length > 0
    ) {
      if (!this.policy.allowedRecipients.includes(recipient)) {
        return { allowed: false, reason: `Recipient ${recipient} not in whitelist` };
      }
    }

    return { allowed: true };
  }

  recordSpend(amount: bigint): void {
    if (amount < 0n) throw new Error("Spend amount cannot be negative");
    this.spent += amount;
    this.dailySpent += amount;
  }

  get totalSpent(): bigint {
    return this.spent;
  }

  get remaining(): bigint {
    return this.policy.sessionBudget - this.spent;
  }

  get currentPolicy(): SpendingPolicy {
    return { ...this.policy };
  }

  setPolicy(policy: Partial<SpendingPolicy>): void {
    Object.assign(this.policy, policy);
  }

  private resetDailyIfNeeded(): void {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    if (now - this.dailyResetAt > dayMs) {
      this.dailySpent = 0n;
      this.dailyResetAt = now;
    }
  }
}
