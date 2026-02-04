// app/api/finance/withdraw/request/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { financeConfig } from "@/lib/finance";
import { LedgerService } from "@/lib/finance/ledger.service";
import User from "@/models/User";
import Withdrawal from "@/models/withdrawal";
import { verify, JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

interface AuthPayload extends JwtPayload {
  userId: string;
}

/**
 * POST /api/finance/withdraw/request
 * Submit a withdrawal request (manual approval required)
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
    const { amount, accountNumber, bankCode, accountName, bankName, note } =
      body;

    // Validate inputs
    if (!amount || !Number.isInteger(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Amount must be a positive integer (kobo)" },
        { status: 400 },
      );
    }

    if (!accountNumber || !bankCode || !accountName) {
      return NextResponse.json(
        { success: false, error: "Bank details are required" },
        { status: 400 },
      );
    }

    // Check withdrawal limits
    const { minWithdrawal, maxWithdrawal } = financeConfig.limits;
    if (amount < minWithdrawal) {
      return NextResponse.json(
        {
          success: false,
          error: `Minimum withdrawal amount is ₦${minWithdrawal / 100}`,
        },
        { status: 400 },
      );
    }

    if (amount > maxWithdrawal) {
      return NextResponse.json(
        {
          success: false,
          error: `Maximum withdrawal amount is ₦${maxWithdrawal / 100}`,
        },
        { status: 400 },
      );
    }

    // Check if withdrawals are enabled
    if (!financeConfig.features.withdrawalsEnabled) {
      return NextResponse.json(
        { success: false, error: "Withdrawals are currently disabled" },
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

    // Check balance (including estimated fee)
    const currentBalance = await LedgerService.getBalance(user.ledgerId);
    const estimatedFee = Math.ceil(amount * 0.01); // 1% fee estimate
    const totalRequired = amount + estimatedFee;

    if (currentBalance < totalRequired) {
      return NextResponse.json(
        {
          success: false,
          error: `Insufficient balance. Required: ₦${totalRequired / 100}, Available: ₦${currentBalance / 100}`,
        },
        { status: 400 },
      );
    }

    // Check for pending withdrawals
    const pendingWithdrawals = await Withdrawal.countDocuments({
      userId: user._id,
      status: { $in: ["PENDING", "APPROVED", "PROCESSING"] },
    });

    if (pendingWithdrawals > 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You have a pending withdrawal. Please wait for it to complete.",
        },
        { status: 400 },
      );
    }

    // Create withdrawal request
    const withdrawal = await Withdrawal.create({
      userId: user._id,
      ledgerId: user.ledgerId,
      amount,
      fee: estimatedFee,
      status: "PENDING",
      bankDetails: {
        accountNumber,
        bankCode,
        accountName,
        bankName,
      },
      userNote: note,
      requestedAt: new Date(),
    });

    console.log("✅ Withdrawal request created:", {
      withdrawalId: withdrawal._id,
      userId: user._id,
      amount,
      status: "PENDING",
    });

    return NextResponse.json({
      success: true,
      message:
        "Withdrawal request submitted successfully. Awaiting admin approval.",
      data: {
        withdrawalId: withdrawal._id,
        amount,
        fee: estimatedFee,
        netAmount: withdrawal.netAmount,
        status: withdrawal.status,
        requestedAt: withdrawal.requestedAt,
      },
    });
  } catch (error) {
    console.error("Withdrawal request error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit withdrawal request" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/finance/withdraw/request
 * Get user's withdrawal requests
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

    // Get user's withdrawals
    const withdrawals = await Withdrawal.find({ userId: decoded.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({
      success: true,
      data: { withdrawals },
    });
  } catch (error) {
    console.error("Withdrawal fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch withdrawals" },
      { status: 500 },
    );
  }
}
