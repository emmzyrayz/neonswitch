// app/api/finance/webhooks/paystack/route.ts

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { getPaymentProvider } from "@/lib/finance";
import { LedgerService } from "@/lib/finance/ledger.service";
import User from "@/models/User";

/**
 * POST /api/finance/webhooks/paystack
 * Handles Paystack webhook events
 * This is the ONLY route that credits wallets for Paystack payments
 *
 * CRITICAL SECURITY:
 * - Signature verification is MANDATORY
 * - Idempotency prevents duplicate credits
 * - All operations are atomic (MongoDB transactions)
 */

interface PaystackRawPayload {
  data?: {
    channel?: string;
  };
}

export async function POST(request: NextRequest) {
  let session: mongoose.ClientSession | null = null;

  try {
    await connectDB();

    // Get raw body for signature verification
    const rawBody = await request.text();

    // Get Paystack signature from headers
    const signature = request.headers.get("x-paystack-signature");

    if (!signature) {
      console.error("❌ [PAYSTACK WEBHOOK] Missing signature");
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    // Verify webhook signature
    const provider = getPaymentProvider();
    const verification = await provider.verifyWebhook(rawBody, signature);

    if (!verification.isValid) {
      console.error("❌ [PAYSTACK WEBHOOK] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // If no event (e.g., irrelevant event type), acknowledge and exit
    if (!verification.event) {
      console.log("ℹ️ [PAYSTACK WEBHOOK] Event ignored (not charge.success)");
      return NextResponse.json({ status: "ignored" });
    }

    const event = verification.event;

    console.log("✅ [PAYSTACK WEBHOOK] Valid event received:", {
      event: event.event,
      reference: event.providerReference,
      amount: event.amount,
      status: event.status,
    });

    // Only process successful payments
    if (event.status !== "success") {
      console.log("ℹ️ [PAYSTACK WEBHOOK] Payment not successful, skipping");
      return NextResponse.json({ status: "acknowledged" });
    }

    // Extract metadata
    const metadata = event.metadata || {};
    const ledgerId = metadata.ledgerId as string;
    const userIdStr = metadata.userId as string;

    if (!ledgerId || !userIdStr) {
      console.error(
        "❌ [PAYSTACK WEBHOOK] Missing ledgerId or userId in metadata",
      );
      return NextResponse.json({ error: "Invalid metadata" }, { status: 400 });
    }

    // Get user
    const user = await User.findById(userIdStr);
    if (!user) {
      console.error("❌ [PAYSTACK WEBHOOK] User not found:", userIdStr);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify ledger matches
    if (user.ledgerId !== ledgerId) {
      console.error("❌ [PAYSTACK WEBHOOK] Ledger mismatch");
      return NextResponse.json({ error: "Ledger mismatch" }, { status: 400 });
    }

    // Start atomic transaction
    session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Credit user's ledger (idempotency handled inside)
      const ledgerEntry = await LedgerService.createEntry(
        {
          ledgerId,
          userId: user._id,
          type: "CREDIT",
          amount: event.amount,
          fee: event.fee,
          category: "FUNDING",
          reference: `WEBHOOK_${event.providerReference}`,
          providerReference: event.providerReference,
          provider: "paystack",
          description: "Wallet funding via Paystack",
          metadata: {
            webhookEvent: event.event,
            paidAt: event.paidAt,
            channel: (event.rawPayload as PaystackRawPayload).data?.channel,
            customerEmail: event.customerEmail,
          },
        },
        session,
      );

      // Commit transaction
      await session.commitTransaction();

      console.log("✅ [PAYSTACK WEBHOOK] Wallet credited:", {
        userId: user._id,
        ledgerId,
        amount: event.amount,
        fee: event.fee,
        netAmount: ledgerEntry.netAmount,
        reference: event.providerReference,
      });

      return NextResponse.json({
        status: "success",
        message: "Wallet credited",
        data: {
          reference: event.providerReference,
          amount: event.amount,
          fee: event.fee,
          netAmount: ledgerEntry.netAmount,
        },
      });
    } catch (transactionError) {
      // Rollback on error
      await session.abortTransaction();

      // Check if error is due to idempotency (duplicate webhook)
      if (
        transactionError instanceof Error &&
        transactionError.message.includes("Transaction is being processed")
      ) {
        console.log(
          "ℹ️ [PAYSTACK WEBHOOK] Duplicate webhook ignored (idempotent)",
        );
        return NextResponse.json({
          status: "duplicate",
          message: "Already processed",
        });
      }

      throw transactionError;
    }
  } catch (error) {
    console.error("❌ [PAYSTACK WEBHOOK] Processing error:", error);

    // Return 200 to prevent Paystack retries on our errors
    // Log error for manual investigation
    return NextResponse.json(
      {
        status: "error",
        message: "Webhook processing failed",
      },
      { status: 200 }, // Return 200 to stop retries
    );
  } finally {
    // Always end session
    if (session) {
      await session.endSession();
    }
  }
}

/**
 * GET /api/finance/webhooks/paystack
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: "active",
    webhook: "paystack",
    message: "Webhook endpoint is ready",
  });
}
