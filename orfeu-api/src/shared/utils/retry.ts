import { Logger } from '@nestjs/common';

export interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  context?: string;
}

const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_BASE_DELAY_MS = 1000;

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T | null> {
  const maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
  const baseDelayMs = options.baseDelayMs ?? DEFAULT_BASE_DELAY_MS;
  const logger = new Logger('Retry');

  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      logger.error(
        `${options.context ? `[${options.context}] ` : ''}Attempt ${attempt}/${maxRetries} failed: ${error.message}`,
      );
      if (attempt >= maxRetries) {
        logger.error(
          `${options.context ? `[${options.context}] ` : ''}All ${maxRetries} attempts failed.`,
        );
        return null;
      }
      await new Promise((resolve) =>
        setTimeout(resolve, baseDelayMs * attempt),
      );
    }
  }

  return null;
}
