// contexts/FinanceContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

// ========== TYPES ==========

interface Balance {
  balance: number; // In kobo
  balanceFormatted: string; // e.g., "₦1,000.00"
  currency: string;
  ledgerId: string;
}

interface Transaction {
  id: string;
  type: "CREDIT" | "DEBIT";
  amount: number;
  fee: number;
  netAmount: number;
  balanceAfter: number;
  category: string;
  status: string;
  reference: string;
  providerReference?: string;
  provider?: string;
  description?: string;
  createdAt: string;
  amountFormatted: string;
  feeFormatted: string;
  netAmountFormatted: string;
}

interface FundingResult {
  reference: string;
  providerReference: string;
  authorizationUrl?: string;
  accessCode?: string;
  amount: number;
  fee: number;
  totalAmount: number;
  provider: string;
}

interface FinanceContextType {
  // State
  balance: Balance | null;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchBalance: () => Promise<void>;
  fetchTransactions: (options?: {
    limit?: number;
    skip?: number;
    status?: string;
    category?: string;
  }) => Promise<void>;
  initiateFunding: (amount: number) => Promise<FundingResult | null>;
  verifyPayment: (reference: string) => Promise<any>;
  clearError: () => void;
}

// ========== CONTEXT ==========

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// ========== PROVIDER ==========

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get auth token from localStorage or your auth context
  const getAuthToken = useCallback(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("authToken");
  }, []);

  // Fetch balance
  const fetchBalance = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch("/api/finance/balance", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch balance");
      }

      setBalance(data.data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch balance";
      setError(message);
      console.error("Balance fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [getAuthToken]);

  // Fetch transactions
  const fetchTransactions = useCallback(
    async (options?: {
      limit?: number;
      skip?: number;
      status?: string;
      category?: string;
    }) => {
      setIsLoading(true);
      setError(null);

      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error("Not authenticated");
        }

        const params = new URLSearchParams();
        if (options?.limit) params.set("limit", options.limit.toString());
        if (options?.skip) params.set("skip", options.skip.toString());
        if (options?.status) params.set("status", options.status);
        if (options?.category) params.set("category", options.category);

        const response = await fetch(
          `/api/finance/transactions?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to fetch transactions");
        }

        setTransactions(data.data.transactions);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch transactions";
        setError(message);
        console.error("Transactions fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [getAuthToken],
  );

  // Initiate funding
  const initiateFunding = useCallback(
    async (amount: number): Promise<FundingResult | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error("Not authenticated");
        }

        const response = await fetch("/api/finance/fund", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to initiate funding");
        }

        return data.data;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to initiate funding";
        setError(message);
        console.error("Funding initiation error:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [getAuthToken],
  );

  // Verify payment
  const verifyPayment = useCallback(
    async (reference: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error("Not authenticated");
        }

        const response = await fetch(
          `/api/finance/verify?reference=${encodeURIComponent(reference)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Verification failed");
        }

        // Refresh balance after successful verification
        if (data.data.status === "success") {
          await fetchBalance();
          await fetchTransactions({ limit: 10 });
        }

        return data.data;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Verification failed";
        setError(message);
        console.error("Payment verification error:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [getAuthToken, fetchBalance, fetchTransactions],
  );

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: FinanceContextType = {
    balance,
    transactions,
    isLoading,
    error,
    fetchBalance,
    fetchTransactions,
    initiateFunding,
    verifyPayment,
    clearError,
  };

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
}

// ========== HOOK ==========

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within FinanceProvider");
  }
  return context;
}

// ========== USAGE EXAMPLE ==========

/*
// 1. Wrap your app with FinanceProvider (in layout.tsx or _app.tsx)
<FinanceProvider>
  <YourApp />
</FinanceProvider>

// 2. Use in any component
function WalletPage() {
  const { balance, fetchBalance, initiateFunding, isLoading } = useFinance();

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const handleFund = async () => {
    const result = await initiateFunding(100000); // ₦1000 in kobo
    if (result?.authorizationUrl) {
      window.location.href = result.authorizationUrl;
    }
  };

  return (
    <div>
      <h1>Balance: {balance?.balanceFormatted}</h1>
      <button onClick={handleFund} disabled={isLoading}>
        Fund Wallet
      </button>
    </div>
  );
}
*/
