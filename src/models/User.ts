// models/User.ts - TypeScript Fixed Version
import mongoose, { Schema, models, Model,  UpdateResult } from "mongoose";

export type KycTier = 0 | 1 | 2;
export type KycStatus = "pending" | "approved" | "rejected";

// ========== INTERFACES ==========

// Main User interface
export interface IUser {
  // ===== Auth =====
  email: string;
  phone: string;
  passwordHash: string;
  role: "user" | "admin";

  // ===== Verification =====
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  kycTier: KycTier;
  kycStatus: KycStatus;

  // ===== Identity (Tier 1) =====
  profile: {
    firstName?: string;
    lastName?: string;
    dateOfBirth: Date;
    nationality: string;
    gender: "male" | "female" | "other";
  };

  // ===== Address (Tier 1) =====
  address?: {
    country?: string;
    state?: string;
    city?: string;
    street?: string;
    postalCode?: string;
  };

  // ===== KYC (Tier 2) =====
  kyc?: {
    idType?: "nin" | "passport" | "drivers_license";
    idNumber?: string;
    idVerified?: boolean;
    submittedAt?: Date;
    verifiedAt?: Date;
  };

  // ===== Verification Tokens =====
  // Email verification
  verifyToken?: string;
  verifyTokenExpiry?: Date;
  verifyCode?: string;

  // Phone verification
  phoneVerifyCode?: string;
  phoneVerifyCodeExpiry?: Date;

  // Password reset tokens
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
  resetPasswordCode?: string;

  // Security & tracking
  lastVerificationSentAt?: Date;
  lastPhoneVerificationSentAt?: Date;
  
  // ===== Meta =====
  neonId: string;
  tokenVersion?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Add static methods interface
interface IUserModel extends Model<IUser> {
  cleanupExpiredTokens(): Promise<UpdateResult>;
}

// ========== SCHEMA ==========

const UserSchema = new Schema<IUser, IUserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

     isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    kycTier: {
      type: Number,
      default: 0,
      enum: [0, 1, 2],
    },

    kycStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    profile: {
      firstName: { type: String, trim: true },
      lastName: { type: String, trim: true },
      dateOfBirth: Date,
      nationality: { type: String, trim: true },
      gender: {
        type: String,
        enum: ["male", "female", "other"],
      },
    },

     address: {
      country: { type: String, trim: true },
      state: { type: String, trim: true },
      city: { type: String, trim: true },
      street: { type: String, trim: true },
      postalCode: { type: String, trim: true },
    },

    kyc: {
      idType: {
        type: String,
        enum: ["nin", "passport", "drivers_license"],
      },
      idNumber: { type: String, trim: true },
      idVerified: { type: Boolean, default: false },
      submittedAt: Date,
      verifiedAt: Date,
    },

    neonId: {
      type: String,
      unique: true,
      sparse: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Email Verification
    verifyToken: {
      type: String,
      select: false,
    },
    verifyTokenExpiry: {
      type: Date,
    },
    verifyCode: {
      type: String,
      select: false,
    },

    // ===== Phone Verification =====
    phoneVerifyCode: {
      type: String,
      select: false,
    },
    phoneVerifyCodeExpiry: {
      type: Date,
    },

    // Password Reset
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpiry: {
      type: Date,
    },
    resetPasswordCode: {
      type: String,
      select: false,
    },

    // Rate Limiting & Tracking
    lastVerificationSentAt: {
      type: Date,
    },
    lastPhoneVerificationSentAt: {
      type: Date,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ========== INDEXES ==========
UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });
UserSchema.index({ verifyToken: 1 });
UserSchema.index({ resetPasswordToken: 1 });
UserSchema.index({ neonId: 1 });



UserSchema.statics.cleanupExpiredTokens = async function(): Promise<UpdateResult> {
  const now = new Date();
  
  return this.updateMany(
    {
      $or: [
        { verifyTokenExpiry: { $lt: now } },
        { phoneVerifyCodeExpiry: { $lt: now } },
        { resetPasswordExpiry: { $lt: now } },
      ]
    },
    {
      $unset: {
        verifyToken: "",
        verifyTokenExpiry: "",
        verifyCode: "",
        phoneVerifyCode: "",
        phoneVerifyCodeExpiry: "",
        resetPasswordToken: "",
        resetPasswordExpiry: "",
        resetPasswordCode: "",
      }
    }
  );
};



// ========== EXPORT ==========
const User = (models.User as IUserModel) || mongoose.model<IUser, IUserModel>("User", UserSchema);

export default User;