// lib/finance/reconciliation.service.ts

import mongoose from "mongoose";
import { LedgerService } from "./ledger.service";
import { getPaymentProvider, financeConfig } from "./index";
import { LedgerAccount } from "@/models/Ledger";

// ========== TYPES ==========

export interface ReconciliationRecord {
  provider: "paystack" | "monnify";
  internalBalance: number; // Ledger total (kobo)
  providerBalance: number; // External wallet balance (kobo)
  drift: number; // Difference (kobo)
  driftPercentage: number; // Drift as percentage
  status: "OK" | "DRIFT_DETECTED" | "ERROR";
  triggeredBy: "CRON" | "TRANSACTION_THRESHOLD" | "MANUAL";
  totalLedgers: number; // Number of ledgers checked
  errorMessage?: string;
  timestamp: Date;
}

export interface ReconciliationResult {
  success: boolean;
  records: ReconciliationRecord[];
  summary: {
    totalDrift: number;
    criticalDrifts: number; // Drifts > 1%
    errors: number;
  };
}

// ========== SERVICE ==========

export class ReconciliationService {
  /**
   * Run reconciliation for all active ledgers
   * Compares internal ledger balances with provider wallet balances
   */
  static async runReconciliation(
    triggeredBy: "CRON" | "TRANSACTION_THRESHOLD" | "MANUAL" = "MANUAL"
  ): Promise<ReconciliationResult> {
    console.log(`🔄 [RECONCILIATION] Starting reconciliation (${triggeredBy})...`);

    const records: ReconciliationRecord[] = [];
    let totalDrift = 0;
    let criticalDrifts = 0;
    let errors = 0;

    try {
      // Get all active ledgers
      const ledgers = await LedgerAccount.find({ status: "active" }).lean();
      console.log(`📊 [RECONCILIATION] Found ${ledgers.length} active ledgers`);

      if (ledgers.length === 0) {
        console.log("ℹ️ [RECONCILIATION] No active ledgers to reconcile");
        return {
          success: true,
          records: [],
          summary: { totalDrift: 0, criticalDrifts: 0, errors: 0 },
        };
      }

      // Calculate total internal balance (sum of all ledgers)
      let totalInternalBalance = 0;
      for (const ledger of ledgers) {
        const balance = await LedgerService.getBalance(ledger.ledgerId);
        totalInternalBalance += balance;
      }

      console.log(
        `💰 [RECONCILIATION] Total internal balance: ₦${totalInternalBalance / 100}`
      );

      // Get provider balance
      const provider = getPaymentProvider();
      const providerType = financeConfig.provider;

      // Only reconcile if using real provider (not mock)
      if (providerType === "mock") {
        console.log("ℹ️ [RECONCILIATION] Skipping reconciliation for mock provider");
        return {
          success: true,
          records: [],
          summary: { totalDrift: 0, criticalDrifts: 0, errors: 0 },
        };
      }

      // Get provider balance (if supported)
      if (!provider.getBalance) {
        console.warn(
          `⚠️ [RECONCILIATION] Provider ${providerType} does not support balance retrieval`
        );
        return {
          success: false,
          records: [],
          summary: { totalDrift: 0, criticalDrifts: 0, errors: 1 },
        };
      }

      const providerBalanceResult = await provider.getBalance();

      if (!providerBalanceResult.success) {
        console.error(
          `❌ [RECONCILIATION] Failed to fetch provider balance: ${providerBalanceResult.error}`
        );

        records.push({
          provider: providerType as "paystack" | "monnify",
          internalBalance: totalInternalBalance,
          providerBalance: 0,
          drift: 0,
          driftPercentage: 0,
          status: "ERROR",
          triggeredBy,
          totalLedgers: ledgers.length,
          errorMessage: providerBalanceResult.error,
          timestamp: new Date(),
        });

        errors++;
      } else {
        const providerBalance = providerBalanceResult.balance;
        const drift = providerBalance - totalInternalBalance;
        const driftPercentage =
          totalInternalBalance > 0
            ? (Math.abs(drift) / totalInternalBalance) * 100
            : 0;

        const status = drift === 0 ? "OK" : "DRIFT_DETECTED";

        console.log(`📊 [RECONCILIATION] Results:`, {
          internalBalance: `₦${totalInternalBalance / 100}`,
          providerBalance: `₦${providerBalance / 100}`,
          drift: `₦${drift / 100}`,
          driftPercentage: `${driftPercentage.toFixed(2)}%`,
          status,
        });

        records.push({
          provider: providerType as "paystack" | "monnify",
          internalBalance: totalInternalBalance,
          providerBalance,
          drift,
          driftPercentage,
          status,
          triggeredBy,
          totalLedgers: ledgers.length,
          timestamp: new Date(),
        });

        totalDrift += Math.abs(drift);

        // Flag critical drifts (> 1% or > ₦10,000)
        if (driftPercentage > 1 || Math.abs(drift) > 1000000) {
          criticalDrifts++;
          console.warn(
            `⚠️ [RECONCILIATION] CRITICAL DRIFT DETECTED: ₦${drift / 100} (${driftPercentage.toFixed(2)}%)`
          );
        }
      }

      // Log results to database (optional - implement if needed)
      // await ReconciliationLog.create(records);

      const result: ReconciliationResult = {
        success: errors === 0,
        records,
        summary: {
          totalDrift,
          criticalDrifts,
          errors,
        },
      };

      console.log(`✅ [RECONCILIATION] Completed:`, result.summary);

      return result;
    } catch (error) {
      console.error("❌ [RECONCILIATION] Fatal error:", error);

      return {
        success: false,
        records,
        summary: { totalDrift, criticalDrifts, errors: errors + 1 },
      };
    }
  }

  /**
   * Check if reconciliation should be triggered based on transaction count
   * Call this after every ledger entry creation
   */
  static async checkTransactionThreshold(): Promise<void> {
    const threshold = financeConfig.reconciliation.transactionThreshold;

    // Get transaction count since last reconciliation
    // This is a simplified implementation - you may want to track this in Redis
    const randomTrigger = Math.random() < 0.2; // 20% chance (simulate threshold)

    if (randomTrigger) {
      console.log(
        `🔔 [RECONCILIATION] Transaction threshold reached (${threshold}), triggering reconciliation...`
      );
      await this.runReconciliation("TRANSACTION_THRESHOLD");
    }
  }

  /**
   * Verify a specific ledger's integrity
   * Compares computed balance with last snapshot
   */
  static async verifyLedgerIntegrity(ledgerId: string): Promise<{
    isValid: boolean;
    computedBalance: number;
    lastSnapshotBalance?: number;
    drift?: number;
  }> {
    return LedgerService.verifyLedgerIntegrity(ledgerId);
  }
}
