// lib/finance/providers/monnify.ts

import crypto from "crypto";
import { financeConfig } from "../config";
import {
  PaymentProvider,
  PaymentInitRequest,
  PaymentInitResponse,
  PaymentVerificationResponse,
  WebhookVerificationResult,
  WebhookEvent,
  ProviderBalanceResult,
} from "../types";
import { generateReference } from "../ledger.service";

const MONNIFY_API_URL = financeConfig.monnify.apiUrl;
const MONNIFY_API_KEY = financeConfig.monnify.apiKey;
const MONNIFY_SECRET_KEY = financeConfig.monnify.secretKey;
const MONNIFY_CONTRACT_CODE = financeConfig.monnify.contractCode;

/**
 * Calculate Monnify transaction fee
 * Monnify typically charges a flat fee or percentage
 * This is a placeholder - verify actual fee structure
 */
function calculateMonnifyFee(amount: number): number {
  // Example: 1% fee (verify with Monnify docs)
  return Math.ceil(amount * 0.01);
}

/**
 * Get Monnify access token (OAuth2)
 * Tokens are cached for 1 hour
 */
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getMonnifyAccessToken(): Promise<string> {
  // Return cached token if valid
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken; 
  }

  try {
    const auth = Buffer.from(
      `${MONNIFY_API_KEY}:${MONNIFY_SECRET_KEY}`
    ).toString("base64");

    const response = await fetch(`${MONNIFY_API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok || !data.requestSuccessful) {
      throw new Error(data.responseMessage || "Authentication failed");
    }

    const newToken = data.responseBody.accessToken;
    cachedToken = newToken;
    tokenExpiry = Date.now() + 55 * 60 * 1000; // 55 minutes

    return newToken; // Return the local variable, not cachedToken
  } catch (error) {
    console.error("Monnify authentication error:", error);
    throw new Error("Failed to authenticate with Monnify");
  }
}

export class MonnifyProvider implements PaymentProvider {
  /**
   * Initialize a payment with Monnify
   */
  async initializePayment(
    request: PaymentInitRequest
  ): Promise<PaymentInitResponse> {
    try {
      const token = await getMonnifyAccessToken();
      const reference = `MON_${generateReference()}`;
      const fee = calculateMonnifyFee(request.amount);

      const response = await fetch(
        `${MONNIFY_API_URL}/api/v1/merchant/transactions/init-transaction`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: request.amount / 100, // Monnify expects naira, not kobo
            customerName: request.email.split("@")[0],
            customerEmail: request.email,
            paymentReference: reference,
            paymentDescription: "Wallet Funding",
            currencyCode: "NGN",
            contractCode: MONNIFY_CONTRACT_CODE,
            redirectUrl: financeConfig.paystack.callbackUrl, // Reuse callback URL
            paymentMethods: ["CARD", "ACCOUNT_TRANSFER"],
            metadata: {
              ledgerId: request.ledgerId,
              userId: request.userId.toString(),
              ...request.metadata,
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.requestSuccessful) {
        return {
          success: false,
          reference,
          providerReference: "",
          fee: 0,
          error: data.responseMessage || "Payment initialization failed",
        };
      }

      return {
        success: true,
        reference,
        providerReference: data.responseBody.transactionReference,
        authorizationUrl: data.responseBody.checkoutUrl,
        fee,
      };
    } catch (error) {
      console.error("Monnify initialization error:", error);
      return {
        success: false,
        reference: "",
        providerReference: "",
        fee: 0,
        error: "Failed to initialize payment",
      };
    }
  }

  /**
   * Verify a payment with Monnify
   */
  async verifyPayment(reference: string): Promise<PaymentVerificationResponse> {
    try {
      const token = await getMonnifyAccessToken();

      const response = await fetch(
        `${MONNIFY_API_URL}/api/v2/transactions/${encodeURIComponent(
          reference
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.requestSuccessful) {
        return {
          success: false,
          status: "failed",
          amount: 0,
          fee: 0,
          providerReference: reference,
          error: data.responseMessage || "Verification failed",
        };
      }

      const txn = data.responseBody;
      const amount = Math.round(txn.amountPaid * 100); // Convert naira to kobo
      const fee = calculateMonnifyFee(amount);

      const statusMap: Record<string, "success" | "failed" | "pending"> = {
        PAID: "success",
        FAILED: "failed",
        PENDING: "pending",
        EXPIRED: "failed",
      };

      return {
        success: txn.paymentStatus === "PAID",
        status: statusMap[txn.paymentStatus] || "failed",
        amount,
        fee,
        providerReference: txn.transactionReference,
        paidAt: txn.paidOn ? new Date(txn.paidOn) : undefined,
        channel: txn.paymentMethod,
        metadata: txn.metaData,
      };
    } catch (error) {
      console.error("Monnify verification error:", error);
      return {
        success: false,
        status: "failed",
        amount: 0,
        fee: 0,
        providerReference: reference,
        error: "Verification failed",
      };
    }
  }

  /**
   * Verify Monnify webhook signature
   */
  async verifyWebhook(
    payload: string,
    signature: string
  ): Promise<WebhookVerificationResult> {
    try {
      // Monnify webhook verification (check docs for exact algorithm)
      // This is a placeholder - verify with actual Monnify documentation
      const hash = crypto
        .createHmac("sha512", MONNIFY_SECRET_KEY)
        .update(payload)
        .digest("hex");

      if (hash !== signature) {
        return {
          isValid: false,
          error: "Invalid webhook signature",
        };
      }

      const data = JSON.parse(payload);
      const eventData = data.eventData;

      // Only process successful transactions
      if (eventData.paymentStatus !== "PAID") {
        return {
          isValid: true,
          event: undefined,
        };
      }

      const amount = Math.round(eventData.amountPaid * 100); // Convert to kobo
      const fee = calculateMonnifyFee(amount);

      const event: WebhookEvent = {
        event: "transaction.success",
        provider: "monnify",
        providerReference: eventData.transactionReference,
        amount,
        fee,
        status: "success",
        customerEmail: eventData.customer?.email,
        paidAt: eventData.paidOn ? new Date(eventData.paidOn) : undefined,
        metadata: eventData.metaData,
        rawPayload: data,
      };

      return {
        isValid: true,
        event,
      };
    } catch (error) {
      console.error("Monnify webhook verification error:", error);
      return {
        isValid: false,
        error: "Webhook processing failed",
      };
    }
  }

  /**
   * Get Monnify wallet balance (for reconciliation)
   */
  async getBalance(): Promise<ProviderBalanceResult> {
    try {
      const token = await getMonnifyAccessToken();

      const response = await fetch(
        `${MONNIFY_API_URL}/api/v1/disbursements/wallet-balance?accountNumber=${MONNIFY_CONTRACT_CODE}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.requestSuccessful) {
        return {
          success: false,
          balance: 0,
          currency: "NGN",
          provider: "monnify",
          error: data.responseMessage || "Failed to fetch balance",
        };
      }

      const balance = Math.round(data.responseBody.availableBalance * 100); // Convert to kobo

      return {
        success: true,
        balance,
        currency: "NGN",
        provider: "monnify",
      };
    } catch (error) {
      console.error("Monnify balance fetch error:", error);
      return {
        success: false,
        balance: 0,
        currency: "NGN",
        provider: "monnify",
        error: "Failed to fetch balance",
      };
    }
  }
}
