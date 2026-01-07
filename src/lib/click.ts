// lib/click.ts

export interface DelayedClickOptions {
  minDelayMs?: number;
  maxDelayMs?: number;
}

/**
 * Wraps an async click handler with a random delay
 * Using 'unknown[]' ensures we don't cheat the type system with 'any'
 */
export function withRandomDelay<Args extends unknown[], R>(
  handler: (...args: Args) => Promise<R>,
  options: DelayedClickOptions = {}
): (...args: Args) => Promise<R> {
  const { minDelayMs = 1000, maxDelayMs = 5000 } = options;

  return async (...args: Args): Promise<R> => {
    const delay =
      Math.floor(Math.random() * (maxDelayMs - minDelayMs + 1)) + minDelayMs;

    await new Promise((res) => setTimeout(res, delay));

    // By returning the handler directly, we fulfill Promise<R>
    return handler(...args);
  };
}