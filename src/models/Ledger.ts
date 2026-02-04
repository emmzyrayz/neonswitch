// models/LedgerAccount.ts

import mongoose, { Schema, models, Model } from "mongoose";

export type LedgerStatus = "active" | "frozen" | "closed";
export type Currency = "NGN"; // Extensible for future currencies


export interface ILedgerAccount {
  ledgerId: string; // System-generated, immutable
  userId: mongoose.Types.ObjectId; // Reference to User
  currency: Currency;
  status: LedgerStatus;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

const LedgerAccountSchema = new Schema<ILedgerAccount>(
  {
    ledgerId: {
      type: String,
      required: true,
      unique: true,
      immutable: true, // Cannot be changed after creation
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One ledger per user
      immutable: true,
    },

    currency: {
      type: String,
      enum: ["NGN"],
      default: "NGN",
      required: true,
      immutable: true,
    },

    status: {
      type: String,
      enum: ["active", "suspended", "closed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast lookups
LedgerAccountSchema.index({ status: 1 });

export const LedgerAccount = 
  (models.LedgerAccount as Model<ILedgerAccount>) || 
  mongoose.model<ILedgerAccount>("LedgerAccount", LedgerAccountSchema);


// models/LedgerEntry.ts
export type LedgerEntryType = "CREDIT" | "DEBIT";
export type LedgerEntryStatus = "PENDING" | "COMPLETED" | "FAILED" | "REVERSED";
export type LedgerEntryCategory = 
  | "FUNDING"           // User adds money
  | "WITHDRAWAL"        // User withdraws money
  | "VTU_PURCHASE"      // Airtime/data purchase
  | "REVERSAL"          // Transaction reversal
  | "FEE"               // Platform fee
  | "REFUND"            // Money returned to user
  | "ADJUSTMENT";       // Manual admin adjustment

  export type Provider = "paystack" | "monnify" | "internal";

export interface ILedgerEntry {
  ledgerId: string; // Reference to LedgerAccount
  userId: mongoose.Types.ObjectId; // Denormalized for fast queries

  // Transaction details
  type: LedgerEntryType; // CREDIT or DEBIT
  amount: number; // Integer (kobo)
  fee: number; // Integer (kobo) - transaction fee
  netAmount: number;
  balanceAfter: number; // Integer (kobo) - snapshot for auditing

  // Classification
  category: LedgerEntryCategory;
  status: LedgerEntryStatus;

  // Provider tracking
  provider?: Provider; // Which provider processed this
  providerReference?: string; // External transaction ID (Paystack/Monnify)
  reference: string;

  // Metadata
  description?: string; // Human-readable description
  metadata?: Record<string, unknown>; // Provider response, additional data

  // Audit trail
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransaction extends ILedgerEntry {
  _id: string | mongoose.Types.ObjectId;
}

const LedgerEntrySchema = new Schema<ILedgerEntry>(
  {
    ledgerId: {
      type: String,
      required: true,
      immutable: true,
      unique: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },

    type: {
      type: String,
      enum: ["CREDIT", "DEBIT"],
      required: true,
      immutable: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Amount must be an integer (kobo)",
      },
      immutable: true,
    },

    fee: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Fee must be an integer (kobo)",
      },
      immutable: true,
    },

    netAmount: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "Net amount must be an integer (kobo)",
      },
      immutable: true,
    },

    balanceAfter: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "Balance must be an integer (kobo)",
      },
      immutable: true,
    },

    category: {
      type: String,
      enum: [
        "FUNDING",
        "WITHDRAWAL",
        "VTU_PURCHASE",
        "REVERSAL",
        "FEE",
        "REFUND",
        "ADJUSTMENT",
      ],
      required: true,
      immutable: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
      default: "PENDING",
    },

    provider: {
      type: String,
      enum: ["paystack", "monnify", "internal"],
      immutable: true,
    },

    providerReference: {
      type: String,
      sparse: true, // Allow null, but enforce uniqueness when present
      immutable: true,
    },

    reference: {
      type: String,
      required: true,
      unique: true, // Ensures idempotency
      immutable: true,
    },

    description: {
      type: String,
      trim: true,
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast queries
// LedgerEntrySchema.index({ ledgerId: 1, createdAt: -1 }); // Get user transactions 
// LedgerEntrySchema.index({ userId: 1, status: 1 });        // User balance calculation
LedgerEntrySchema.index({ status: 1, createdAt: -1 });

// Prevent modifications after creation
LedgerEntrySchema.pre("save", function () {
  if (!this.isNew) {
    throw new Error("Ledger entries are immutable");
  }
});

// Auto-calculate netAmount before saving
LedgerEntrySchema.pre("save", function () {
  if (this.isNew) {
    // netAmount = amount - fee
    this.netAmount = this.amount - this.fee;
    
    // Validate fee doesn't exceed amount
    if (this.fee > this.amount) {
      throw new Error("Fee cannot exceed transaction amount");
    }
  }
});

export const LedgerEntry = 
  (models.LedgerEntry as Model<ILedgerEntry>) || 
  mongoose.model<ILedgerEntry>("LedgerEntry", LedgerEntrySchema);



// models/IdempotencyRecord.ts

export type IdempotencyResourceType = "ledger_entry" | "webhook" | "withdrawal";
export type IdempotencyStatus = "processing" | "completed" | "failed";

export interface IIdempotencyRecord {
  key: string; // Idempotency key (reference or providerReference)
  resourceType: IdempotencyResourceType;
  resourceId?: mongoose.Types.ObjectId; // Reference to created resource
  status: IdempotencyStatus;
  response?: Record<string, unknown>; // Stored response for duplicate requests
  expiresAt: Date; // Auto-cleanup after 48 hours
  createdAt: Date;
}

const IdempotencyRecordSchema = new Schema<IIdempotencyRecord>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    
    resourceType: {
      type: String,
      enum: ["ledger_entry", "webhook", "withdrawal"],
      required: true,
    },
    
    resourceId: {
      type: Schema.Types.ObjectId,
    },
    
    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },
    
    response: {
      type: Schema.Types.Mixed,
    },
    
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index - MongoDB auto-deletes after expiresAt
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast lookups
// IdempotencyRecordSchema.index({ key: 1 });
IdempotencyRecordSchema.index({ resourceType: 1, status: 1 });

export const IdempotencyRecord = 
  (models.IdempotencyRecord as Model<IIdempotencyRecord>) || 
  mongoose.model<IIdempotencyRecord>("IdempotencyRecord", IdempotencyRecordSchema);