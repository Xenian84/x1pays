import type { SwapQuote } from "./types.js";

const FEE_DENOMINATOR = 1_000_000n;

/**
 * Compute spot price from reserves, adjusted for decimals.
 * Returns price of token0 in terms of token1.
 */
export function spotPrice(
  reserve0: bigint,
  reserve1: bigint,
  decimals0: number,
  decimals1: number
): number {
  if (reserve0 === 0n) return 0;
  const scale0 = 10 ** decimals0;
  const scale1 = 10 ** decimals1;
  return (Number(reserve1) / scale1) / (Number(reserve0) / scale0);
}

/**
 * Exact-input swap quote.
 * Given amountIn of the input token, how much output do you receive?
 *
 * Fee is deducted from the input before the swap.
 * tradeFeeRate is in units of 1e-6 (e.g., 2500 = 0.25%)
 */
export function quoteExactIn(
  amountIn: bigint,
  inputReserve: bigint,
  outputReserve: bigint,
  tradeFeeRate: bigint,
  slippageBps: number = 100,
  inputDecimals: number = 6,
  outputDecimals: number = 6
): SwapQuote {
  if (amountIn <= 0n) {
    throw new Error("amountIn must be positive");
  }
  if (inputReserve <= 0n || outputReserve <= 0n) {
    throw new Error("Reserves must be positive");
  }
  if (tradeFeeRate < 0n) throw new Error("tradeFeeRate cannot be negative");
  if (slippageBps < 0 || slippageBps > 10000) throw new Error("slippageBps must be between 0 and 10000");

  const fee = (amountIn * tradeFeeRate) / FEE_DENOMINATOR;
  const inputAfterFee = amountIn - fee;

  // Constant product: amountOut = inputAfterFee * outputReserve / (inputReserve + inputAfterFee)
  const amountOut =
    (inputAfterFee * outputReserve) / (inputReserve + inputAfterFee);

  const priceBefore = spotPrice(inputReserve, outputReserve, inputDecimals, outputDecimals);
  const newInputReserve = inputReserve + inputAfterFee;
  const newOutputReserve = outputReserve - amountOut;
  const priceAfter = spotPrice(newInputReserve, newOutputReserve, inputDecimals, outputDecimals);

  const impact = priceBefore > 0 ? Math.abs(priceAfter - priceBefore) / priceBefore * 100 : 0;

  const slippageMultiplier = 10000n - BigInt(slippageBps);
  const minimumReceived = (amountOut * slippageMultiplier) / 10000n;

  return {
    amountIn,
    amountOut,
    fee,
    priceImpact: Math.round(impact * 100) / 100,
    spotPriceBefore: priceBefore,
    spotPriceAfter: priceAfter,
    minimumReceived,
  };
}

/**
 * Exact-output swap quote.
 * Given a desired amountOut, how much input is needed?
 */
export function quoteExactOut(
  amountOut: bigint,
  inputReserve: bigint,
  outputReserve: bigint,
  tradeFeeRate: bigint,
  slippageBps: number = 100,
  inputDecimals: number = 6,
  outputDecimals: number = 6
): SwapQuote {
  if (amountOut <= 0n) {
    throw new Error("amountOut must be positive");
  }
  if (amountOut >= outputReserve) {
    throw new Error("amountOut must be less than output reserve");
  }
  if (inputReserve <= 0n || outputReserve <= 0n) {
    throw new Error("Reserves must be positive");
  }
  if (tradeFeeRate < 0n) throw new Error("tradeFeeRate cannot be negative");
  if (slippageBps < 0 || slippageBps > 10000) throw new Error("slippageBps must be between 0 and 10000");

  // inputAfterFee = amountOut * inputReserve / (outputReserve - amountOut)
  const inputAfterFee =
    (amountOut * inputReserve) / (outputReserve - amountOut) + 1n;

  // Reverse the fee deduction: amountIn = inputAfterFee * FEE_DENOMINATOR / (FEE_DENOMINATOR - tradeFeeRate)
  const amountIn =
    (inputAfterFee * FEE_DENOMINATOR) / (FEE_DENOMINATOR - tradeFeeRate) + 1n;

  const fee = amountIn - inputAfterFee;

  const priceBefore = spotPrice(inputReserve, outputReserve, inputDecimals, outputDecimals);
  const newInputReserve = inputReserve + inputAfterFee;
  const newOutputReserve = outputReserve - amountOut;
  const priceAfter = spotPrice(newInputReserve, newOutputReserve, inputDecimals, outputDecimals);

  const impact = priceBefore > 0 ? Math.abs(priceAfter - priceBefore) / priceBefore * 100 : 0;

  const slippageMultiplier = 10000n + BigInt(slippageBps);
  const minimumReceived = amountOut;

  return {
    amountIn: (amountIn * slippageMultiplier) / 10000n,
    amountOut,
    fee,
    priceImpact: Math.round(impact * 100) / 100,
    spotPriceBefore: priceBefore,
    spotPriceAfter: priceAfter,
    minimumReceived,
  };
}

/**
 * Calculate price impact as a percentage.
 */
export function priceImpact(
  amountIn: bigint,
  inputReserve: bigint,
  outputReserve: bigint
): number {
  if (inputReserve === 0n || outputReserve === 0n) return 100;
  const idealOut = (amountIn * outputReserve) / inputReserve;
  const actualOut = (amountIn * outputReserve) / (inputReserve + amountIn);
  if (idealOut === 0n) return 0;
  return Number((idealOut - actualOut) * 10000n / idealOut) / 100;
}
