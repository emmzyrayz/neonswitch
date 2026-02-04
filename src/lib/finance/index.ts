// lib/finance/index.ts

import { financeConfig, validateFinanceConfig } from "./config";
import { PaymentProvider } from "./types";
import { PaystackProvider } from "./providers/paystack";
import { MonnifyProvider } from "./providers/monnify";
import { MockProvider } from "./providers/mock";

/**
 * Get the active payment provider based on environment configuration
 * This is the ONLY way routes should access payment providers
 */
export function getPaymentProvider(): PaymentProvider {
  const { provider } = financeConfig;

  switch (provider) {
    case "paystack":
      return new PaystackProvider();

    case "monnify":
      return new MonnifyProvider();

    case "mock":
      return new MockProvider();

    default:
      console.warn(
        `Unknown provider: ${provider}. Falling back to mock provider.`
      );
      return new MockProvider();
  }
}

/**
 * Validate finance configuration on app startup
 * Call this in a server initialization file
 */
export function validateConfiguration(): void {
  const validation = validateFinanceConfig();

  if (!validation.valid) {
    console.error("❌ Finance configuration errors:");
    validation.errors.forEach((error) => console.error(`  - ${error}`));

    if (process.env.NODE_ENV === "production") {
      throw new Error("Invalid finance configuration in production");
    } else {
      console.warn("⚠️  Running in development mode with invalid config");
    }
  } else {
    console.log(
      `✅ Finance provider configured: ${financeConfig.provider.toUpperCase()}`
    );
  }
}

// Export config and types for use in routes
export { financeConfig } from "./config";
export * from "./types";
export { LedgerService } from "./ledger.service";
