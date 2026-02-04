// app/api/finance/balance/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { LedgerService } from "@/lib/finance/ledger.service";
import User from "@/models/User";
import { verify, JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

interface AuthPayload extends JwtPayload {
  userId: string;
}

/**
 * GET /api/finance/balance
 * Returns the user's current wallet balance
 * Balance is derived from ledger, never stored directly
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Extract JWT from Authorization header
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

    // Get user and ledger
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

    // Get balance from ledger (computed, not stored)
    const balanceKobo = await LedgerService.getBalance(user.ledgerId);

    // Convert to naira for display
    const balanceNaira = balanceKobo / 100;

    return NextResponse.json({
      success: true,
      data: {
        balance: balanceKobo, // In kobo (integer)
        balanceFormatted: `₦${balanceNaira.toLocaleString("en-NG", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        currency: "NGN",
        ledgerId: user.ledgerId,
      },
    });
  } catch (error) {
    console.error("Balance fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch balance" },
      { status: 500 },
    );
  }
}
