// lib/finance/types.ts

import mongoose from "mongoose";

/**
 * Payment initialization request
 */
export interface PaymentInitRequest {
  userId: mongoose.Types.ObjectId;
  ledgerId: string;
  amount: number; // In kobo
  email: string;
  metadata?: Record<string, unknown>;
}

/**
 * Payment initialization response
 */
export interface PaymentInitResponse {
  success: boolean;
  reference: string; // Internal reference
  providerReference: string; // Provider's transaction reference
  authorizationUrl?: string; // URL to redirect user for payment
  accessCode?: string; // Provider access code (if applicable)
  fee: number; // Transaction fee in kobo
  error?: string;
}

/**
 * Payment verification response
 */
export interface PaymentVerificationResponse {
  success: boolean;
  status: "success" | "failed" | "pending" | "abandoned";
  amount: number; // In kobo
  fee: number; // In kobo
  providerReference: string;
  paidAt?: Date;
  channel?: string; // e.g., "card", "bank_transfer"
  metadata?: Record<string, unknown>;
  error?: string;
}

/**
 * Webhook event payload (normalized)
 */
export interface WebhookEvent {
  event: string; // e.g., "charge.success", "transfer.success"
  provider: "paystack" | "monnify";
  providerReference: string;
  amount: number; // In kobo
  fee: number; // In kobo
  status: "success" | "failed" | "pending";
  customerEmail?: string;
  paidAt?: Date;
  metadata?: Record<string, unknown>;
  rawPayload: Record<string, unknown>; // Original provider payload
}

/**
 * Webhook verification result
 */
export interface WebhookVerificationResult {
  isValid: boolean;
  event?: WebhookEvent;
  error?: string;
}

/**
 * Transfer/withdrawal request
 */
export interface TransferRequest {
  userId: mongoose.Types.ObjectId;
  ledgerId: string;
  amount: number; // In kobo
  recipientCode: string; // Bank account code
  reason?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Transfer response
 */
export interface TransferResponse {
  success: boolean;
  reference: string;
  providerReference?: string;
  status: "success" | "failed" | "pending";
  fee: number; // In kobo
  error?: string;
}

/**
 * Bank account details
 */
export interface BankAccount {
  accountNumber: string;
  bankCode: string;
  accountName: string;
}

/**
 * Account verification result
 */
export interface AccountVerificationResult {
  success: boolean;
  accountName?: string;
  accountNumber?: string;
  bankCode?: string;
  error?: string;
}

/**
 * Provider balance query result
 */
export interface ProviderBalanceResult {
  success: boolean;
  balance: number; // In kobo
  currency: string;
  provider: "paystack" | "monnify";
  error?: string;
}

/**
 * Base payment provider interface
 * All providers must implement these methods
 */
export interface PaymentProvider {
  /**
   * Initialize a payment (funding)
   */
  initializePayment(request: PaymentInitRequest): Promise<PaymentInitResponse>;

  /**
   * Verify a payment status
   */
  verifyPayment(reference: string): Promise<PaymentVerificationResponse>;

  /**
   * Verify webhook signature and parse event
   */
  verifyWebhook(
    payload: string,
    signature: string
  ): Promise<WebhookVerificationResult>;

  /**
   * Initiate a transfer (withdrawal) - Optional for now
   */
  initiateTransfer?(request: TransferRequest): Promise<TransferResponse>;

  /**
   * Verify bank account details - Optional
   */
  verifyBankAccount?(
    accountNumber: string,
    bankCode: string
  ): Promise<AccountVerificationResult>;

  /**
   * Get provider wallet balance (for reconciliation)
   */
  getBalance?(): Promise<ProviderBalanceResult>;
}
