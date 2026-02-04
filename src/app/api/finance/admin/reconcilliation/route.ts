// app/api/finance/admin/reconciliation/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ReconciliationService } from "@/lib/finance/reconciliation.service";
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
 * POST /api/finance/admin/reconciliation
 * Trigger manual reconciliation (admin only)
 */
export async function POST(request: NextRequest) {
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

    console.log("🔄 Manual reconciliation triggered by admin:", auth.userId);

    // Run reconciliation
    const result = await ReconciliationService.runReconciliation("MANUAL");

    return NextResponse.json({
      success: result.success,
      data: {
        records: result.records,
        summary: result.summary,
      },
    });
  } catch (error) {
    console.error("Reconciliation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to run reconciliation" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/finance/admin/reconciliation
 * Get reconciliation history (if implemented)
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

    // Return placeholder
    // TODO: Implement ReconciliationLog model to store history
    return NextResponse.json({
      success: true,
      message: "Reconciliation history not yet implemented",
      data: { records: [] },
    });
  } catch (error) {
    console.error("Reconciliation history error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reconciliation history" },
      { status: 500 },
    );
  }
}
