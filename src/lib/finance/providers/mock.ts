// lib/finance/providers/mock.ts

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

/**
 * Mock provider for local development
 * Simulates payment provider behavior without real API calls
 */
export class MockProvider implements PaymentProvider {
  // In-memory storage for mock transactions
  private static transactions: Map<
    string,
    {
      amount: number;
      fee: number;
      status: "success" | "failed" | "pending";
      email: string;
      metadata?: Record<string, unknown>;
      createdAt: Date;
    }
  > = new Map();

  /**
   * Mock payment initialization
   * Always succeeds immediately
   */
  async initializePayment(
    request: PaymentInitRequest
  ): Promise<PaymentInitResponse> {
    const reference = `MOCK_${generateReference()}`;
    const providerReference = `mock_${Date.now()}`;
    const fee = Math.ceil(request.amount * 0.015) + 10000; // Mock 1.5% + ₦100 fee

    // Store mock transaction
    MockProvider.transactions.set(providerReference, {
      amount: request.amount,
      fee,
      status: "success", // Auto-succeed in mock mode
      email: request.email,
      metadata: request.metadata,
      createdAt: new Date(),
    });

    console.log("🎭 [MOCK] Payment initialized:", {
      reference,
      providerReference,
      amount: request.amount,
      fee,
    });

    return {
      success: true,
      reference,
      providerReference,
      authorizationUrl: `http://localhost:3000/mock-payment?ref=${providerReference}`,
      accessCode: `mock_${Date.now()}`,
      fee,
    };
  }

  /**
   * Mock payment verification
   * Always returns success for valid references
   */
  async verifyPayment(reference: string): Promise<PaymentVerificationResponse> {
    const transaction = MockProvider.transactions.get(reference);

    if (!transaction) {
      console.log("🎭 [MOCK] Transaction not found:", reference);
      return {
        success: false,
        status: "failed",
        amount: 0,
        fee: 0,
        providerReference: reference,
        error: "Transaction not found",
      };
    }

    console.log("🎭 [MOCK] Payment verified:", {
      reference,
      amount: transaction.amount,
      status: transaction.status,
    });

    return {
      success: transaction.status === "success",
      status: transaction.status,
      amount: transaction.amount,
      fee: transaction.fee,
      providerReference: reference,
      paidAt: transaction.createdAt,
      channel: "mock_card",
      metadata: transaction.metadata,
    };
  }

  /**
   * Mock webhook verification
   * Always validates successfully
   */
  async verifyWebhook(
    payload: string,
    signature: string
  ): Promise<WebhookVerificationResult> {
    try {
      const data = JSON.parse(payload);

      // Mock signature validation (always passes)
      if (signature !== "mock_signature_valid") {
        console.log("🎭 [MOCK] Invalid webhook signature");
        return {
          isValid: false,
          error: "Invalid mock signature",
        };
      }

      const event: WebhookEvent = {
        event: "charge.success",
        provider: "paystack", // Simulate Paystack format
        providerReference: data.reference || `mock_${Date.now()}`,
        amount: data.amount || 100000,
        fee: data.fee || 11500,
        status: "success",
        customerEmail: data.email,
        paidAt: new Date(),
        metadata: data.metadata,
        rawPayload: data,
      };

      console.log("🎭 [MOCK] Webhook verified:", event);

      return {
        isValid: true,
        event,
      };
    } catch (error) {
      console.error("🎭 [MOCK] Webhook parsing error:", error);
      return {
        isValid: false,
        error: "Invalid webhook payload",
      };
    }
  }

  /**
   * Mock balance retrieval
   * Returns a fixed mock balance
   */
  async getBalance(): Promise<ProviderBalanceResult> {
    const mockBalance = 5000000000; // ₦50,000,000 in kobo

    console.log("🎭 [MOCK] Balance fetched:", mockBalance);

    return {
      success: true,
      balance: mockBalance,
      currency: "NGN",
      provider: "paystack",
    };
  }

  /**
   * Helper: Simulate a webhook event (for testing)
   */
  static simulateWebhook(params: {
    reference: string;
    amount: number;
    email: string;
    metadata?: Record<string, unknown>;
  }): { payload: string; signature: string } {
    const payload = JSON.stringify({
      event: "charge.success",
      reference: params.reference,
      amount: params.amount,
      fee: Math.ceil(params.amount * 0.015) + 10000,
      email: params.email,
      status: "success",
      metadata: params.metadata,
    });

    return {
      payload,
      signature: "mock_signature_valid",
    };
  }

  /**
   * Helper: Clear mock transaction history (for testing)
   */
  static clearTransactions(): void {
    MockProvider.transactions.clear();
    console.log("🎭 [MOCK] Transaction history cleared");
  }
}
