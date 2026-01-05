// lib/click.ts

export interface DelayedClickOptions {
  minDelayMs?: number;
  maxDelayMs?: number;
}

/**
 * Wraps an async click handler with a random delay
 * Useful for UX throttling, not security
 */
export function withRandomDelay<T extends (...args: any[]) => Promise<any>>(
  handler: T,
  options: DelayedClickOptions = {}
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  const {
    minDelayMs = 1000,
    maxDelayMs = 5000,
  } = options;

  return async (...args: Parameters<T>) => {
    const delay =
      Math.floor(
        Math.random() * (maxDelayMs - minDelayMs + 1)
      ) + minDelayMs;

    await new Promise((res) => setTimeout(res, delay));
    return handler(...args);
  };
}
