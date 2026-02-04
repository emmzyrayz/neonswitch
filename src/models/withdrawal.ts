// models/Withdrawal.ts

import mongoose, { Schema, models, Model } from "mongoose";

export type WithdrawalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export interface IBankDetails {
  accountNumber: string;
  bankCode: string;
  accountName: string;
  bankName?: string;
}

export interface IWithdrawal {
  userId: mongoose.Types.ObjectId;
  ledgerId: string;
  amount: number; // In kobo
  fee: number; // In kobo
  netAmount: number; // amount - fee
  status: WithdrawalStatus;
  bankDetails: IBankDetails;

  // Approval tracking
  requestedAt: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  completedAt?: Date;
  approvedBy?: mongoose.Types.ObjectId; // Admin user ID
  rejectedBy?: mongoose.Types.ObjectId; // Admin user ID

  // Provider tracking
  provider?: "paystack" | "monnify" | "internal";
  providerReference?: string;
  ledgerReference?: string; // Reference to ledger entry after completion

  // Notes and metadata
  userNote?: string; // User's reason for withdrawal
  adminNote?: string; // Admin's reason for approval/rejection
  failureReason?: string;
  metadata?: Record<string, unknown>;

  createdAt: Date;
  updatedAt: Date;
}

const WithdrawalSchema = new Schema<IWithdrawal>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    ledgerId: {
      type: String,
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Amount must be an integer (kobo)",
      },
    },

    fee: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Fee must be an integer (kobo)",
      },
    },

    netAmount: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "Net amount must be an integer (kobo)",
      },
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "APPROVED",
        "REJECTED",
        "PROCESSING",
        "COMPLETED",
        "FAILED",
      ],
      default: "PENDING",
      index: true,
    },

    bankDetails: {
      accountNumber: { type: String, required: true },
      bankCode: { type: String, required: true },
      accountName: { type: String, required: true },
      bankName: String,
    },

    requestedAt: {
      type: Date,
      default: Date.now,
    },

    approvedAt: Date,
    rejectedAt: Date,
    completedAt: Date,

    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    rejectedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    provider: {
      type: String,
      enum: ["paystack", "monnify", "internal"],
    },

    providerReference: String,
    ledgerReference: String,

    userNote: String,
    adminNote: String,
    failureReason: String,

    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
WithdrawalSchema.index({ userId: 1, status: 1 });
WithdrawalSchema.index({ status: 1, createdAt: -1 });
WithdrawalSchema.index({ ledgerId: 1 });

// Calculate netAmount before saving
WithdrawalSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("amount") || this.isModified("fee")) {
    this.netAmount = this.amount - this.fee;
  }
  next();
});

const Withdrawal =
  (models.Withdrawal as Model<IWithdrawal>) ||
  mongoose.model<IWithdrawal>("Withdrawal", WithdrawalSchema);

export default Withdrawal;