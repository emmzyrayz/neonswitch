// lib/finance/config.ts

export type FinanceProvider = "mock" | "paystack" | "monnify";

export const financeConfig = {
  // Provider selection
  provider: (process.env.FINANCE_PROVIDER || "mock") as FinanceProvider,

  // Paystack configuration
  paystack: {
    secretKey: process.env.PAYSTACK_SECRET_KEY || "",
    publicKey: process.env.PAYSTACK_PUBLIC_KEY || "",
    apiUrl: process.env.PAYSTACK_API_URL || "https://api.paystack.co",
    callbackUrl:
      process.env.PAYSTACK_CALLBACK_URL ||
      `${process.env.NEXT_PUBLIC_APP_URL}/finance/payment-callback`,
  },

  // Monnify configuration
  monnify: {
    apiKey: process.env.MONNIFY_API_KEY || "",
    secretKey: process.env.MONNIFY_SECRET_KEY || "",
    contractCode: process.env.MONNIFY_CONTRACT_CODE || "",
    apiUrl: process.env.MONNIFY_API_URL || "https://sandbox.monnify.com",
  },

  // Financial limits (in kobo)
  limits: {
    minFunding: parseInt(process.env.MIN_FUNDING_AMOUNT || "10000"), // ₦100
    maxFunding: parseInt(process.env.MAX_FUNDING_AMOUNT || "100000000"), // ₦1,000,000
    minWithdrawal: parseInt(process.env.MIN_WITHDRAWAL_AMOUNT || "100000"), // ₦1,000
    maxWithdrawal: parseInt(process.env.MAX_WITHDRAWAL_AMOUNT || "50000000"), // ₦500,000
  },

  // Reconciliation configuration
  reconciliation: {
    transactionThreshold: parseInt(
      process.env.RECONCILIATION_TRANSACTION_THRESHOLD || "5"
    ),
    cronEnabled: process.env.RECONCILIATION_CRON_ENABLED === "true",
  },

  // Rate limiting (requests per hour)
  rateLimit: {
    funding: parseInt(process.env.RATE_LIMIT_FUNDING || "5"),
    withdrawal: parseInt(process.env.RATE_LIMIT_WITHDRAWAL || "3"),
  },

  // Feature flags
  features: {
    withdrawalsEnabled: process.env.WITHDRAWALS_ENABLED === "true",
    fundingEnabled: process.env.FUNDING_ENABLED !== "false", // Default true
  },

  // Webhook security
  webhook: {
    allowedIps: process.env.WEBHOOK_ALLOWED_IPS?.split(",") || [],
  },
} as const;

// Validation helper
export function validateFinanceConfig(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const { provider, paystack, monnify } = financeConfig;

  // Validate provider-specific config
  if (provider === "paystack") {
    if (!paystack.secretKey) errors.push("PAYSTACK_SECRET_KEY is required");
    if (!paystack.publicKey) errors.push("PAYSTACK_PUBLIC_KEY is required");
  }

  if (provider === "monnify") {
    if (!monnify.apiKey) errors.push("MONNIFY_API_KEY is required");
    if (!monnify.secretKey) errors.push("MONNIFY_SECRET_KEY is required");
    if (!monnify.contractCode) errors.push("MONNIFY_CONTRACT_CODE is required");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
