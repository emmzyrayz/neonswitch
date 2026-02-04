// app/api/finance/admin/ledgers/route.ts

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { LedgerService } from "@/lib/finance/ledger.service";
// import { ReconciliationService } from "@/lib/finance/reconciliation.service";
import { LedgerAccount } from "@/models/Ledger";
import User from "@/models/User";
import { verify, JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

interface AuthPayload extends JwtPayload {
  userId: string;
  role?: string;
}

// Admin authentication helper
async function verifyAdmin(request: NextRequest): Promise<{
  authorized: boolean;
  userId?: string;
  error?: string;
}> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { authorized: false, error: "Unauthorized" };
  }

  const token = authHeader.substring(7);

  try {
    const decoded = verify(token, JWT_SECRET) as AuthPayload;

    const user = await User.findById(decoded.userId);
    if (!user || user.role !== "admin") {
      return { authorized: false, error: "Admin access required" };
    }

    return { authorized: true, userId: decoded.userId };
  } catch {
    return { authorized: false, error: "Invalid token" };
  }
}

/**
 * GET /api/finance/admin/ledgers
 * Get all ledgers with balances (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Verify admin
    const auth = await verifyAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: 403 },
      );
    }

    // Get all ledgers
    const ledgers = await LedgerAccount.find()
      .populate("userId", "email phone profile.firstName profile.lastName")
      .lean();

    // Compute balance for each ledger
    const ledgersWithBalances = await Promise.all(
      ledgers.map(async (ledger) => {
        const balance = await LedgerService.getBalance(ledger.ledgerId);
        return {
          ...ledger,
          balance,
          balanceFormatted: `₦${(balance / 100).toLocaleString("en-NG", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
        };
      }),
    );

    return NextResponse.json({
      success: true,
      data: { ledgers: ledgersWithBalances },
    });
  } catch (error) {
    console.error("Admin ledger fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch ledgers" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/finance/admin/ledgers
 * Freeze, unfreeze, or adjust ledger (admin only)
 */
export async function PATCH(request: NextRequest) {
  let session: mongoose.ClientSession | null = null;

  try {
    await connectDB();

    // Verify admin
    const auth = await verifyAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: 403 },
      );
    }

    // Parse request body
    const body = await request.json();
    const { ledgerId, action, amount, reason } = body;

    if (!ledgerId || !action) {
      return NextResponse.json(
        { success: false, error: "Ledger ID and action are required" },
        { status: 400 },
      );
    }

    // Get ledger
    const ledger = await LedgerAccount.findOne({ ledgerId }).populate("userId");
    if (!ledger) {
      return NextResponse.json(
        { success: false, error: "Ledger not found" },
        { status: 404 },
      );
    }

    // Handle actions
    if (action === "freeze") {
      await LedgerService.freezeLedger(ledgerId);
      console.log("✅ Ledger frozen:", ledgerId);
      return NextResponse.json({
        success: true,
        message: "Ledger frozen successfully",
      });
    }

    if (action === "unfreeze") {
      await LedgerService.unfreezeLedger(ledgerId);
      console.log("✅ Ledger unfrozen:", ledgerId);
      return NextResponse.json({
        success: true,
        message: "Ledger unfrozen successfully",
      });
    }

    if (action === "adjust") {
      // Manual ledger adjustment (DEBIT or CREDIT)
      if (!amount || !Number.isInteger(amount)) {
        return NextResponse.json(
          { success: false, error: "Valid amount required for adjustment" },
          { status: 400 },
        );
      }

      if (!reason) {
        return NextResponse.json(
          { success: false, error: "Reason required for adjustment" },
          { status: 400 },
        );
      }

      session = await mongoose.startSession();
      session.startTransaction();

      try {
        const type = amount > 0 ? "CREDIT" : "DEBIT";
        const absoluteAmount = Math.abs(amount);

        const ledgerEntry = await LedgerService.createEntry(
          {
            ledgerId,
            userId: ledger.userId._id,
            type,
            amount: absoluteAmount,
            category: "ADJUSTMENT",
            provider: "internal",
            description: `Admin adjustment: ${reason}`,
            metadata: {
              adjustedBy: auth.userId,
              reason,
              timestamp: new Date(),
            },
          },
          session,
        );

        await session.commitTransaction();

        console.log("✅ Ledger adjusted:", {
          ledgerId,
          type,
          amount: absoluteAmount,
          reason,
        });

        return NextResponse.json({
          success: true,
          message: "Ledger adjusted successfully",
          data: { ledgerEntry },
        });
      } catch (transactionError) {
        await session.abortTransaction();
        throw transactionError;
      }
    }

    if (action === "verify_integrity") {
      const integrity = await LedgerService.verifyLedgerIntegrity(ledgerId);
      return NextResponse.json({
        success: true,
        data: { integrity },
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Admin ledger action error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to perform ledger action" },
      { status: 500 },
    );
  } finally {
    if (session) {
      await session.endSession();
    }
  }
}
