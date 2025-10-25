import { RateLimiterMemory } from "rate-limiter-flexible";
import type { Request, Response, NextFunction } from "express";

const limiter = new RateLimiterMemory({ points: 30, duration: 60 });

export function x420() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await limiter.consume(req.ip || "anon");
      return next();
    } catch {
      return res.status(420).json({
        code: 420,
        message: "Enhance Your Calm",
        hint: "You are rate-limited. Pay via x402 to bypass waiting."
      });
    }
  };
}
