// app/api/finance/webhooks/monnify/route.ts

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { getPaymentProvider } from "@/lib/finance";
import { LedgerService } from "@/lib/finance/ledger.service";
import User from "@/models/User";

/**
 * POST /api/finance/webhooks/monnify
 * Handles Monnify webhook events
 * This is the ONLY route that credits wallets for Monnify payments
 *
 * CRITICAL SECURITY:
 * - Signature verification is MANDATORY
 * - Idempotency prevents duplicate credits
 * - All operations are atomic (MongoDB transactions)
 */

interface MonnifyRawPayload {
  eventData?: {
    paymentMethod?: string;
  };
}

export async function POST(request: NextRequest) {
  let session: mongoose.ClientSession | null = null;

  try {
    await connectDB();

    // Get raw body for signature verification
    const rawBody = await request.text();

    // Get Monnify signature from headers
    // Note: Verify actual header name with Monnify docs
    const signature =
      request.headers.get("monnify-signature") ||
      request.headers.get("x-monnify-signature");

    if (!signature) {
      console.error("❌ [MONNIFY WEBHOOK] Missing signature");
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    // Verify webhook signature
    const provider = getPaymentProvider();
    const verification = await provider.verifyWebhook(rawBody, signature);

    if (!verification.isValid) {
      console.error("❌ [MONNIFY WEBHOOK] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // If no event (e.g., payment not successful), acknowledge and exit
    if (!verification.event) {
      console.log("ℹ️ [MONNIFY WEBHOOK] Event ignored (not PAID status)");
      return NextResponse.json({ status: "ignored" });
    }

    const event = verification.event;

    console.log("✅ [MONNIFY WEBHOOK] Valid event received:", {
      event: event.event,
      reference: event.providerReference,
      amount: event.amount,
      status: event.status,
    });

    // Only process successful payments
    if (event.status !== "success") {
      console.log("ℹ️ [MONNIFY WEBHOOK] Payment not successful, skipping");
      return NextResponse.json({ status: "acknowledged" });
    }

    // Extract metadata
    const metadata = event.metadata || {};
    const ledgerId = metadata.ledgerId as string;
    const userIdStr = metadata.userId as string;

    if (!ledgerId || !userIdStr) {
      console.error(
        "❌ [MONNIFY WEBHOOK] Missing ledgerId or userId in metadata",
      );
      return NextResponse.json({ error: "Invalid metadata" }, { status: 400 });
    }

    // Get user
    const user = await User.findById(userIdStr);
    if (!user) {
      console.error("❌ [MONNIFY WEBHOOK] User not found:", userIdStr);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify ledger matches
    if (user.ledgerId !== ledgerId) {
      console.error("❌ [MONNIFY WEBHOOK] Ledger mismatch");
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
          provider: "monnify",
          description: "Wallet funding via Monnify",
          metadata: {
            webhookEvent: event.event,
            paidAt: event.paidAt,
            channel: (event.rawPayload as MonnifyRawPayload).eventData?.paymentMethod,
            customerEmail: event.customerEmail,
          },
        },
        session,
      );

      // Commit transaction
      await session.commitTransaction();

      console.log("✅ [MONNIFY WEBHOOK] Wallet credited:", {
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
          "ℹ️ [MONNIFY WEBHOOK] Duplicate webhook ignored (idempotent)",
        );
        return NextResponse.json({
          status: "duplicate",
          message: "Already processed",
        });
      }

      throw transactionError;
    }
  } catch (error) {
    console.error("❌ [MONNIFY WEBHOOK] Processing error:", error);

    // Return 200 to prevent Monnify retries on our errors
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
 * GET /api/finance/webhooks/monnify
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: "active",
    webhook: "monnify",
    message: "Webhook endpoint is ready",
  });
}
