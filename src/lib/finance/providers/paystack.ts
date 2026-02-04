// lib/finance/providers/paystack.ts

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

const PAYSTACK_API_URL = financeConfig.paystack.apiUrl;
const PAYSTACK_SECRET_KEY = financeConfig.paystack.secretKey;

/**
 * Calculate Paystack transaction fee
 * Formula: 1.5% + ₦100 (capped at ₦2000)
 */
function calculatePaystackFee(amount: number): number {
  const percentageFee = Math.ceil(amount * 0.015); // 1.5%
  const flatFee = 10000; // ₦100 in kobo
  const totalFee = percentageFee + flatFee;
  const cappedFee = Math.min(totalFee, 200000); // Cap at ₦2000
  return cappedFee;
}

export class PaystackProvider implements PaymentProvider {
  /**
   * Initialize a payment with Paystack
   */
  async initializePayment(
    request: PaymentInitRequest
  ): Promise<PaymentInitResponse> {
    try {
      const reference = `PAY_${generateReference()}`;
      const fee = calculatePaystackFee(request.amount);

      const response = await fetch(
        `${PAYSTACK_API_URL}/transaction/initialize`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: request.email,
            amount: request.amount, // Paystack expects kobo
            reference,
            callback_url: financeConfig.paystack.callbackUrl,
            metadata: {
              ledgerId: request.ledgerId,
              userId: request.userId.toString(),
              ...request.metadata,
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.status) {
        return {
          success: false,
          reference,
          providerReference: "",
          fee: 0,
          error: data.message || "Payment initialization failed",
        };
      }

      return {
        success: true,
        reference,
        providerReference: data.data.reference,
        authorizationUrl: data.data.authorization_url,
        accessCode: data.data.access_code,
        fee,
      };
    } catch (error) {
      console.error("Paystack initialization error:", error);
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
   * Verify a payment with Paystack
   */
  async verifyPayment(reference: string): Promise<PaymentVerificationResponse> {
    try {
      const response = await fetch(
        `${PAYSTACK_API_URL}/transaction/verify/${reference}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.status) {
        return {
          success: false,
          status: "failed",
          amount: 0,
          fee: 0,
          providerReference: reference,
          error: data.message || "Verification failed",
        };
      }

      const txn = data.data;
      const amount = txn.amount; // Already in kobo
      const fee = calculatePaystackFee(amount);

      return {
        success: txn.status === "success",
        status: txn.status,
        amount,
        fee,
        providerReference: txn.reference,
        paidAt: txn.paid_at ? new Date(txn.paid_at) : undefined,
        channel: txn.channel,
        metadata: txn.metadata,
      };
    } catch (error) {
      console.error("Paystack verification error:", error);
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
   * Verify Paystack webhook signature
   */
  async verifyWebhook(
    payload: string,
    signature: string
  ): Promise<WebhookVerificationResult> {
    try {
      // Verify signature using secret key
      const hash = crypto
        .createHmac("sha512", PAYSTACK_SECRET_KEY)
        .update(payload)
        .digest("hex");

      if (hash !== signature) {
        return {
          isValid: false,
          error: "Invalid webhook signature",
        };
      }

      // Parse payload
      const data = JSON.parse(payload);
      const eventType = data.event;
      const eventData = data.data;

      // Only process charge.success events for now
      if (eventType !== "charge.success") {
        return {
          isValid: true,
          event: undefined, // Valid signature but irrelevant event
        };
      }

      const amount = eventData.amount; // In kobo
      const fee = calculatePaystackFee(amount);

      const event: WebhookEvent = {
        event: eventType,
        provider: "paystack",
        providerReference: eventData.reference,
        amount,
        fee,
        status: eventData.status === "success" ? "success" : "failed",
        customerEmail: eventData.customer?.email,
        paidAt: eventData.paid_at ? new Date(eventData.paid_at) : undefined,
        metadata: eventData.metadata,
        rawPayload: data,
      };

      return {
        isValid: true,
        event,
      };
    } catch (error) {
      console.error("Webhook verification error:", error);
      return {
        isValid: false,
        error: "Webhook processing failed",
      };
    }
  }

  /**
   * Get Paystack wallet balance (for reconciliation)
   */
  async getBalance(): Promise<ProviderBalanceResult> {
    try {
      const response = await fetch(`${PAYSTACK_API_URL}/balance`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.status) {
        return {
          success: false,
          balance: 0,
          currency: "NGN",
          provider: "paystack",
          error: data.message || "Failed to fetch balance",
        };
      }

      // Paystack returns balance in kobo
      const balance = data.data[0]?.balance || 0;

      return {
        success: true,
        balance,
        currency: data.data[0]?.currency || "NGN",
        provider: "paystack",
      };
    } catch (error) {
      console.error("Paystack balance fetch error:", error);
      return {
        success: false,
        balance: 0,
        currency: "NGN",
        provider: "paystack",
        error: "Failed to fetch balance",
      };
    }
  }
}
