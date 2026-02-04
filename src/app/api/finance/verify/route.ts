// app/api/finance/verify/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getPaymentProvider } from "@/lib/finance";
import User from "@/models/User";
import { verify, JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

interface AuthPayload extends JwtPayload {
  userId: string;
}

/**
 * GET /api/finance/verify?reference=xxx
 * Verifies a payment status (for client-side polling)
 * NOTE: This does NOT credit the wallet - only webhooks do that
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Extract JWT
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const token = authHeader.substring(7);

    // Verify JWT
    let decoded: AuthPayload;
    try {
      decoded = verify(token, JWT_SECRET) as AuthPayload;
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 },
      );
    }

    // Get user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // Get reference from query params
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { success: false, error: "Reference is required" },
        { status: 400 },
      );
    }

    // Verify payment with provider
    const provider = getPaymentProvider();
    const verificationResult = await provider.verifyPayment(reference);

    if (!verificationResult.success) {
      return NextResponse.json({
        success: false,
        data: {
          status: verificationResult.status,
          reference,
          error: verificationResult.error,
        },
      });
    }

    // Return verification result (READ-ONLY)
    // Wallet credit happens via webhook, not here
    return NextResponse.json({
      success: true,
      data: {
        status: verificationResult.status,
        amount: verificationResult.amount,
        fee: verificationResult.fee,
        reference: verificationResult.providerReference,
        paidAt: verificationResult.paidAt,
        channel: verificationResult.channel,

        // Important notice for client
        notice:
          verificationResult.status === "success"
            ? "Payment verified. Your wallet will be credited shortly via webhook."
            : "Payment not yet completed.",
      },
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify payment" },
      { status: 500 },
    );
  }
}
