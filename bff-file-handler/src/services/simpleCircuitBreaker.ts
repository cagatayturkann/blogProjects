import logger from '../utils/logger';
import { SystemError, SystemErrorType } from '../constants/systemErrors';

// Basit Circuit Breaker
class SimpleCircuitBreaker {
  private failures: number = 0;
  private lastFailureTime: number = 0;
  private isOpen: boolean = false;

  constructor(
    private maxFailures: number = 3,        // after how many failures the circuit breaker will be opened
    private resetTimeoutMs: number = 30000  // after how many milliseconds the circuit breaker will be reset
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    // if the circuit breaker is open and 30 seconds have not passed
    if (this.isOpen) {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime;
      if (timeSinceLastFailure < this.resetTimeoutMs) {
        throw new SystemError(SystemErrorType.CIRCUIT_BREAKER_OPEN);
      }
      // if 30 seconds have passed, reset the circuit breaker and try new requests
      this.reset();
    }

    try {
      const result = await operation();
      this.reset(); // if the operation is successful, reset the circuit breaker
      return result;
    } catch (error) {
      this.handleFailure();
      throw error;
    }
  }

  private handleFailure() { // if the operation fails, increment the failure count and set the last failure time
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.maxFailures) {
      this.isOpen = true;
      logger.error('Circuit breaker opened due to too many failures');
    }
  }

  private reset() {
    this.failures = 0;
    this.isOpen = false;
  }
}

// Simple Retry mechanism
export async function simpleRetry<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxAttempts) {
        if (error instanceof SystemError) {
          throw error;
        }
        throw new SystemError(SystemErrorType.RETRY_FAILED);
      }

      // increase the wait time by 2 times
      const waitTime = delayMs * attempt;
      logger.warn(`Attempt ${attempt} failed, retrying in ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  throw new SystemError(SystemErrorType.RETRY_FAILED);
}

export default SimpleCircuitBreaker; 