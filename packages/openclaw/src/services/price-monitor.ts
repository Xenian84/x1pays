import type { XDex } from "@x1pay/dex";

interface PriceAlert {
  pair: [string, string];
  targetPrice: number;
  direction: "above" | "below";
  callback: (price: number) => void;
}

export function createPriceMonitorService(
  api: any,
  dex: XDex,
  enabled: boolean
) {
  const alerts: PriceAlert[] = [];
  let interval: ReturnType<typeof setInterval> | null = null;

  return {
    id: "x1pays-price-monitor",
    start: () => {
      if (!enabled) {
        api.logger.info("X1Pays price monitor disabled by config");
        return;
      }
      api.logger.info("X1Pays price monitor started (30s interval)");

      interval = setInterval(async () => {
        for (const alert of alerts) {
          try {
            const price = await dex.getPrice(alert.pair[0], alert.pair[1]);
            const triggered =
              (alert.direction === "above" && price >= alert.targetPrice) ||
              (alert.direction === "below" && price <= alert.targetPrice);

            if (triggered) {
              alert.callback(price);
              const idx = alerts.indexOf(alert);
              if (idx !== -1) alerts.splice(idx, 1);
            }
          } catch {
            // pool may not exist yet
          }
        }
      }, 30_000);
    },
    stop: () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      api.logger.info("X1Pays price monitor stopped");
    },
    addAlert: (alert: PriceAlert) => {
      alerts.push(alert);
    },
    getAlerts: () => [...alerts],
  };
}
