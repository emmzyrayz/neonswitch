// lib/finance/ledger.service.ts

import mongoose, { HydratedDocument } from "mongoose";
import { LedgerAccount, IdempotencyRecord, LedgerEntry, ILedgerEntry } from "@/models/Ledger";
import User from "@/models/User";
import { customAlphabet } from "nanoid";

// Generate unique ledger IDs (alphanumeric, 16 chars)
const generateLedgerId = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  16
);

// Generate unique transaction references
const generateReference = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  20
);

export class LedgerService {
  /**
   * Create a ledger account for a user
   * Called once during user registration or first financial action
   */
  static async createLedgerAccount(
    userId: mongoose.Types.ObjectId,
    session?: mongoose.ClientSession | null
  ): Promise<string> {
    // Check if user already has a ledger
    const user = await User.findById(userId).session(session || null);
    if (!user) throw new Error("User not found");
    if (user.ledgerId) return user.ledgerId;

    // Generate unique ledger ID
    const ledgerId = `LGR_${generateLedgerId()}`;

    // Create ledger account (with session if provided)
    if (session) {
      await LedgerAccount.create(
        [
          {
            ledgerId,
            userId,
            currency: "NGN",
            status: "active",
          },
        ],
        { session }
      );
    } else {
      await LedgerAccount.create({
        ledgerId,
        userId,
        currency: "NGN",
        status: "active",
      });
    }

    // Update user with ledger reference
    if (session) {
      await User.findByIdAndUpdate(userId, { ledgerId }, { session });
    } else {
      await User.findByIdAndUpdate(userId, { ledgerId });
    }

    return ledgerId;
  }

  /**
   * Get current balance (derived from ledger)
   * Never stored directly - always computed
   */
  static async getBalance(ledgerId: string): Promise<number> {
    const result = await LedgerEntry.aggregate([
      {
        $match: {
          ledgerId,
          status: "COMPLETED",
        },
      },
      {
        $group: {
          _id: null,
          balance: {
            $sum: {
              $cond: [
                { $eq: ["$type", "CREDIT"] },
                "$netAmount",
                { $multiply: ["$netAmount", -1] },
              ],
            },
          },
        },
      },
    ]);

    const balance = result[0]?.balance || 0;

    // Ensure balance is integer and non-negative
    if (!Number.isInteger(balance) || balance < 0) {
      throw new Error("Invalid balance calculation detected");
    }

    return balance;
  }

  /**
   * Create a ledger entry (immutable transaction)
   * This is the ONLY way to modify balances
   */
  static async createEntry(
    params: {
      ledgerId: string;
      userId: mongoose.Types.ObjectId;
      type: "CREDIT" | "DEBIT";
      amount: number;
      fee?: number;
      category: string;
      reference?: string;
      providerReference?: string;
      provider?: "paystack" | "monnify" | "internal";
      description?: string;
      metadata?: Record<string, unknown>;
    },
    session?: mongoose.ClientSession
  ): Promise<HydratedDocument<ILedgerEntry>> {
    const {
      ledgerId,
      userId,
      type,
      amount,
      fee = 0,
      category,
      reference = `TXN_${generateReference()}`,
      providerReference,
      provider,
      description,
      metadata,
    } = params;

    // Validate amount is integer
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new Error("Amount must be a positive integer (kobo)");
    }

    if (!Number.isInteger(fee) || fee < 0) {
      throw new Error("Fee must be a non-negative integer (kobo)");
    }

    if (fee > amount) {
      throw new Error("Fee cannot exceed transaction amount");
    }

    // Check ledger exists and is active
    const ledger = await LedgerAccount.findOne({ ledgerId }).session(
      session || null
    );
    if (!ledger) throw new Error("Ledger account not found");
    if (ledger.status !== "active") {
      throw new Error(
        `Ledger is ${ledger.status} and cannot accept transactions`
      );
    }

    // Check idempotency (prevent duplicate transactions)
    const existing = await IdempotencyRecord.findOne({
      key: reference,
    }).session(session || null);

    if (existing) {
      if (existing.status === "completed" && existing.resourceId) {
        // Return existing entry
        const existingEntry = await LedgerEntry.findById(
          existing.resourceId
        ).session(session || null);
        if (existingEntry) return existingEntry;
      }

      if (existing.status === "processing") {
        throw new Error("Transaction is being processed");
      }
    }

    // Create idempotency record
    await IdempotencyRecord.create({
      key: reference,
      resourceType: "ledger_entry",
      status: "processing",
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
    });

    try {
      // Get current balance
      const currentBalance = await this.getBalance(ledgerId);

      const netAmount = amount - fee;
      const balanceAfter =
        type === "CREDIT"
          ? currentBalance + netAmount
          : currentBalance - netAmount;

      // Enforce minimum balance rule (no negative balances)
      if (balanceAfter < 0) {
        throw new Error("Insufficient balance");
      }

      // Create ledger entry
      const [entry] = await LedgerEntry.create(
        [
          {
            ledgerId,
            userId,
            type,
            amount,
            fee,
            netAmount,
            balanceAfter,
            category,
            status: "COMPLETED",
            reference,
            providerReference,
            provider,
            description,
            metadata,
          },
        ],
        { session }
      );

      // Mark idempotency record as completed
      await IdempotencyRecord.findOneAndUpdate(
        { key: reference },
        {
          status: "completed",
          resourceId: entry._id,
          response: { success: true, entryId: entry._id },
        },
        { session }
      );

      return entry;
    } catch (error) {
      // Mark idempotency record as failed
      await IdempotencyRecord.findOneAndUpdate(
        { key: reference },
        {
          status: "failed",
          response: { success: false, error: (error as Error).message },
        },
        { session }
      );

      throw error;
    }
  }

  /**
   * Get transaction history
   */
  static async getTransactions(
    ledgerId: string,
    options: {
      limit?: number;
      skip?: number;
      status?: ILedgerEntry["status"];
      category?: ILedgerEntry["category"];
    } = {}
  ) {
    const { limit = 50, skip = 0, status, category } = options;

    const query: Partial<Pick<ILedgerEntry, "ledgerId" | "status" | "category">> = {
      ledgerId,
    };

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    return LedgerEntry.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();
  }

  /**
   * Verify ledger integrity (for reconciliation)
   * Compares last balanceAfter with computed balance
   */
  static async verifyLedgerIntegrity(ledgerId: string): Promise<{
    isValid: boolean;
    computedBalance: number;
    lastSnapshotBalance?: number;
    drift?: number;
  }> {
    // Get computed balance
    const computedBalance = await this.getBalance(ledgerId);

    // Get last ledger entry's snapshot
    const lastEntry = await LedgerEntry.findOne({
      ledgerId,
      status: "COMPLETED",
    })
      .sort({ createdAt: -1 })
      .lean();

    if (!lastEntry) {
      return {
        isValid: true,
        computedBalance: 0,
      };
    }

    const drift = computedBalance - lastEntry.balanceAfter;

    return {
      isValid: drift === 0,
      computedBalance,
      lastSnapshotBalance: lastEntry.balanceAfter,
      drift,
    };
  }

  /**
   * Freeze a ledger account (admin action)
   */
  static async freezeLedger(ledgerId: string): Promise<void> {
    await LedgerAccount.findOneAndUpdate(
      { ledgerId },
      { status: "frozen" }
    );
  }

  /**
   * Unfreeze a ledger account (admin action)
   */
  static async unfreezeLedger(ledgerId: string): Promise<void> {
    await LedgerAccount.findOneAndUpdate(
      { ledgerId },
      { status: "active" }
    );
  }
}

export { generateReference };



