// app/api/finance/fund/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getPaymentProvider, financeConfig } from "@/lib/finance";
import User from "@/models/User";
import { verify, JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

interface AuthPayload extends JwtPayload {
  userId: string;
}

/**
 * POST /api/finance/fund
 * Initiates a wallet funding transaction
 * Returns authorization URL for user to complete payment
 */
export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json();
    const { amount } = body; // Amount in kobo

    // Validate amount
    if (!amount || !Number.isInteger(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Amount must be a positive integer (kobo)" },
        { status: 400 },
      );
    }

    // Check funding limits
    const { minFunding, maxFunding } = financeConfig.limits;
    if (amount < minFunding) {
      return NextResponse.json(
        {
          success: false,
          error: `Minimum funding amount is ₦${minFunding / 100}`,
        },
        { status: 400 },
      );
    }

    if (amount > maxFunding) {
      return NextResponse.json(
        {
          success: false,
          error: `Maximum funding amount is ₦${maxFunding / 100}`,
        },
        { status: 400 },
      );
    }

    // Check if funding is enabled
    if (!financeConfig.features.fundingEnabled) {
      return NextResponse.json(
        { success: false, error: "Funding is currently disabled" },
        { status: 503 },
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

    if (!user.ledgerId) {
      return NextResponse.json(
        { success: false, error: "Ledger not found" },
        { status: 404 },
      );
    }

    // Initialize payment with provider
    const provider = getPaymentProvider();
    const paymentResult = await provider.initializePayment({
      userId: user._id,
      ledgerId: user.ledgerId,
      amount,
      email: user.email,
      metadata: {
        purpose: "wallet_funding",
        initiatedAt: new Date().toISOString(),
      },
    });

    if (!paymentResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: paymentResult.error || "Payment initialization failed",
        },
        { status: 500 },
      );
    }

    // Return authorization URL for user to complete payment
    return NextResponse.json({
      success: true,
      data: {
        reference: paymentResult.reference,
        providerReference: paymentResult.providerReference,
        authorizationUrl: paymentResult.authorizationUrl,
        accessCode: paymentResult.accessCode,
        amount,
        fee: paymentResult.fee,
        totalAmount: amount + paymentResult.fee, // What user will actually pay
        provider: financeConfig.provider,
      },
    });
  } catch (error) {
    console.error("Funding initialization error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to initialize funding" },
      { status: 500 },
    );
  }
}
