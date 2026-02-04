// app/api/finance/admin/withdrawals/route.ts

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { LedgerService } from "@/lib/finance/ledger.service";
import User from "@/models/User";
import Withdrawal from "@/models/withdrawal";
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

    // Check if user is admin
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
 * GET /api/finance/admin/withdrawals
 * Get all withdrawal requests (admin only)
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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");

    // Build query
    const query: {status?: string} = {};
    if (status) {
      query.status = status;
    }

    // Get withdrawals
    const withdrawals = await Withdrawal.find(query)
      .populate("userId", "email phone profile.firstName profile.lastName")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: { withdrawals },
    });
  } catch (error) {
    console.error("Admin withdrawal fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch withdrawals" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/finance/admin/withdrawals
 * Approve or reject a withdrawal (admin only)
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
    const { withdrawalId, action, adminNote } = body;

    if (!withdrawalId || !action) {
      return NextResponse.json(
        { success: false, error: "Withdrawal ID and action are required" },
        { status: 400 },
      );
    }

    if (!["approve", "reject", "complete"].includes(action)) {
      return NextResponse.json(
        { success: false, error: "Invalid action" },
        { status: 400 },
      );
    }

    // Get withdrawal
    const withdrawal =
      await Withdrawal.findById(withdrawalId).populate("userId");
    if (!withdrawal) {
      return NextResponse.json(
        { success: false, error: "Withdrawal not found" },
        { status: 404 },
      );
    }

    // Handle action
    if (action === "approve") {
      if (withdrawal.status !== "PENDING") {
        return NextResponse.json(
          { success: false, error: "Only pending withdrawals can be approved" },
          { status: 400 },
        );
      }

      if (!auth.userId) {
        throw new Error("Admin user ID not found");
      }

      withdrawal.status = "APPROVED";
      withdrawal.approvedAt = new Date();
      withdrawal.approvedBy = new mongoose.Types.ObjectId(auth.userId);
      withdrawal.adminNote = adminNote;
      await withdrawal.save();

      console.log("✅ Withdrawal approved:", withdrawalId);

      return NextResponse.json({
        success: true,
        message: "Withdrawal approved",
        data: { withdrawal },
      });
    }

    if (action === "reject") {
      if (withdrawal.status !== "PENDING") {
        return NextResponse.json(
          { success: false, error: "Only pending withdrawals can be rejected" },
          { status: 400 },
        );
      }

      if (!auth.userId) {
        throw new Error("Admin user ID not found");
      }

      withdrawal.status = "REJECTED";
      withdrawal.rejectedAt = new Date();
      withdrawal.rejectedBy = new mongoose.Types.ObjectId(auth.userId);
      withdrawal.adminNote = adminNote;
      await withdrawal.save();

      console.log("✅ Withdrawal rejected:", withdrawalId);

      return NextResponse.json({
        success: true,
        message: "Withdrawal rejected",
        data: { withdrawal },
      });
    }

    if (action === "complete") {
      if (withdrawal.status !== "APPROVED") {
        return NextResponse.json(
          {
            success: false,
            error: "Only approved withdrawals can be completed",
          },
          { status: 400 },
        );
      }

      // Start transaction
      session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Debit user's ledger
        const ledgerEntry = await LedgerService.createEntry(
          {
            ledgerId: withdrawal.ledgerId,
            userId: withdrawal.userId._id,
            type: "DEBIT",
            amount: withdrawal.amount,
            fee: withdrawal.fee,
            category: "WITHDRAWAL",
            reference: `WITHDRAWAL_${withdrawal._id}`,
            provider: "internal",
            description: "Withdrawal to bank account",
            metadata: {
              withdrawalId: withdrawal._id,
              bankDetails: withdrawal.bankDetails,
            },
          },
          session,
        );

        // Update withdrawal status
        withdrawal.status = "COMPLETED";
        withdrawal.completedAt = new Date();
        withdrawal.ledgerReference = ledgerEntry.reference;
        await withdrawal.save({ session });

        await session.commitTransaction();

        console.log("✅ Withdrawal completed:", {
          withdrawalId: withdrawal._id,
          ledgerReference: ledgerEntry.reference,
        });

        return NextResponse.json({
          success: true,
          message: "Withdrawal completed and ledger debited",
          data: { withdrawal, ledgerEntry },
        });
      } catch (transactionError) {
        await session.abortTransaction();
        throw transactionError;
      }
    }

    return NextResponse.json(
      { success: false, error: "Unknown action" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Admin withdrawal action error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process withdrawal action" },
      { status: 500 },
    );
  } finally {
    if (session) {
      await session.endSession();
    }
  }
}
