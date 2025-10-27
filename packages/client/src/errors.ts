/**
 * Specific error types for x402 payment protocol
 * Provides detailed error handling for different failure scenarios
 */

export class X402Error extends Error {
  constructor(
    message: string,
    public statusCode: number = 402,
    public details?: any
  ) {
    super(message);
    this.name = 'X402Error';
  }
}

export class InvalidSignatureError extends X402Error {
  constructor(message: string = 'Payment signature is invalid', details?: any) {
    super(message, 400, details);
    this.name = 'InvalidSignatureError';
  }
}

export class InsufficientFundsError extends X402Error {
  constructor(message: string = 'Wallet has insufficient funds for payment', details?: any) {
    super(message, 402, details);
    this.name = 'InsufficientFundsError';
  }
}

export class NetworkError extends X402Error {
  constructor(message: string = 'Network request failed', details?: any) {
    super(message, 503, details);
    this.name = 'NetworkError';
  }
}

export class PaymentTimeoutError extends X402Error {
  constructor(message: string = 'Payment settlement timed out', details?: any) {
    super(message, 504, details);
    this.name = 'PaymentTimeoutError';
  }
}

export class InvalidAmountError extends X402Error {
  constructor(message: string = 'Payment amount is invalid', details?: any) {
    super(message, 400, details);
    this.name = 'InvalidAmountError';
  }
}

export class InvalidNetworkError extends X402Error {
  constructor(message: string = 'Network is not supported', details?: any) {
    super(message, 400, details);
    this.name = 'InvalidNetworkError';
  }
}

export class PaymentVerificationError extends X402Error {
  constructor(message: string = 'Payment verification failed', details?: any) {
    super(message, 402, details);
    this.name = 'PaymentVerificationError';
  }
}

export class InvalidConfigError extends X402Error {
  constructor(message: string = 'Invalid configuration', details?: any) {
    super(message, 500, details);
    this.name = 'InvalidConfigError';
  }
}
