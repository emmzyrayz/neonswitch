// app/api/finance/transactions/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { LedgerService } from "@/lib/finance/ledger.service";
import User from "@/models/User";
import { verify, JwtPayload } from "jsonwebtoken";
import { ITransaction } from "@/models/Ledger";

const JWT_SECRET = process.env.JWT_SECRET!;

interface AuthPayload extends JwtPayload {
  userId: string;
}

/**
 * GET /api/finance/transactions
 * Returns user's transaction history
 * Supports pagination and filtering
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

    if (!user.ledgerId) {
      return NextResponse.json(
        { success: false, error: "Ledger not found" },
        { status: 404 },
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = parseInt(searchParams.get("skip") || "0");
    const status = searchParams.get("status");
    const category = searchParams.get("category");

    // Validate pagination
    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { success: false, error: "Limit must be between 1 and 100" },
        { status: 400 },
      );
    }

    if (skip < 0) {
      return NextResponse.json(
        { success: false, error: "Skip must be non-negative" },
        { status: 400 },
      );
    }

    // Fetch transactions
    const queryOptions: Record<string, unknown> = { limit, skip };
    if (status) queryOptions.status = status;
    if (category) queryOptions.category = category;

    // 3. Fetch transactions
    // Note: Ensure LedgerService returns a Promise that resolves to ITransaction[]
    const transactions = await LedgerService.getTransactions(
      user.ledgerId,
      queryOptions,
    );

    // Format transactions for client
    const formattedTransactions = transactions.map((txn: ITransaction) => ({
      id: txn._id.toString(),
      type: txn.type,
      amount: txn.amount,
      fee: txn.fee,
      netAmount: txn.netAmount,
      balanceAfter: txn.balanceAfter,
      category: txn.category,
      status: txn.status,
      reference: txn.reference,
      providerReference: txn.providerReference,
      provider: txn.provider,
      description: txn.description,
      createdAt: txn.createdAt,

      // Formatted amounts for display
      amountFormatted: `₦${(txn.amount / 100).toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      feeFormatted: `₦${(txn.fee / 100).toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      netAmountFormatted: `₦${(txn.netAmount / 100).toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    }));

    return NextResponse.json({
      success: true,
      data: {
        transactions: formattedTransactions,
        pagination: {
          limit,
          skip,
          count: transactions.length,
          hasMore: transactions.length === limit,
        },
      },
    });
  } catch (error) {
    console.error("Transaction fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch transactions" },
      { status: 500 },
    );
  }
}
