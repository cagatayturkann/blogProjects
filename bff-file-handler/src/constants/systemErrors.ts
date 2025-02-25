export enum SystemErrorType {
  CIRCUIT_BREAKER_OPEN = 'CIRCUIT_BREAKER_OPEN',
  RETRY_FAILED = 'RETRY_FAILED',
  AUTH_INVALID_SCHEME = 'AUTH_INVALID_SCHEME',
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  AUTH_REQUIRED = 'AUTH_REQUIRED',
}

export const SystemErrorMessages = {
  [SystemErrorType.CIRCUIT_BREAKER_OPEN]: 'Circuit is open - Service unavailable',
  [SystemErrorType.RETRY_FAILED]: 'All retry attempts failed',
  [SystemErrorType.AUTH_INVALID_SCHEME]: 'Invalid authorization scheme',
  [SystemErrorType.AUTH_INVALID_CREDENTIALS]: 'Invalid credentials',
  [SystemErrorType.AUTH_REQUIRED]: 'Authentication required',
} as const;

export const SystemErrorStatusCodes = {
  [SystemErrorType.CIRCUIT_BREAKER_OPEN]: 503,
  [SystemErrorType.RETRY_FAILED]: 503,
  [SystemErrorType.AUTH_INVALID_SCHEME]: 401,
  [SystemErrorType.AUTH_INVALID_CREDENTIALS]: 401,
  [SystemErrorType.AUTH_REQUIRED]: 401,
} as const;

export class SystemError extends Error {
  constructor(
    public type: SystemErrorType,
    message?: string
  ) {
    super(message || SystemErrorMessages[type]);
    this.name = 'SystemError';
  }
} 