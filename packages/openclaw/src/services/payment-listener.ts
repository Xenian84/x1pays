import { Connection, PublicKey } from "@solana/web3.js";
import type { WalletManager } from "@x1pay/sdk";

export function createPaymentListenerService(
  api: any,
  wallet: WalletManager
) {
  let interval: ReturnType<typeof setInterval> | null = null;
  let lastSignature: string | null = null;

  return {
    id: "x1pays-payment-listener",
    start: () => {
      api.logger.info(`X1Pays payment listener started for ${wallet.address}`);

      const connection = wallet.getConnection();
      const pubkey = wallet.keypair.publicKey;

      interval = setInterval(async () => {
        try {
          const sigs = await connection.getSignaturesForAddress(pubkey, {
            limit: 5,
          });

          if (sigs.length === 0) return;

          if (!lastSignature) {
            lastSignature = sigs[0].signature;
            return;
          }

          for (const sig of sigs) {
            if (sig.signature === lastSignature) break;
            api.logger.info(
              `X1Pays: New transaction detected: ${sig.signature}`
            );
          }

          lastSignature = sigs[0].signature;
        } catch {
          // RPC errors are expected occasionally
        }
      }, 15_000);
    },
    stop: () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      api.logger.info("X1Pays payment listener stopped");
    },
  };
}
