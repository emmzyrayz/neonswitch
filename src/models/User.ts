// models/User.ts - TypeScript Fixed Version
import mongoose, { Schema, models,  UpdateResult } from "mongoose";

// ========== INTERFACES ==========

// Main User interface
export interface IUser {
  email: string;
  passwordHash: string;
  isEmailVerified: boolean;
  neonId?: string;
  role: "user" | "admin";
  
  // Verification tokens
  verifyToken?: string;
  verifyTokenExpiry?: Date;
  verifyCode?: string;
  
  // Password reset tokens
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
  resetPasswordCode?: string;
  
  // Security & tracking
  lastVerificationSentAt?: Date;
  tokenVersion?: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ========== SCHEMA ==========

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      // index: true,
      lowercase: true,
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
UserSchema.index({ verifyToken: 1 });
UserSchema.index({ resetPasswordToken: 1 });



UserSchema.statics.cleanupExpiredTokens = async function(): Promise<UpdateResult> {
  const now = new Date();
  
  return this.updateMany(
    {
      $or: [
        { verifyTokenExpiry: { $lt: now } },
        { resetPasswordExpiry: { $lt: now } }
      ]
    },
    {
      $unset: {
        verifyToken: "",
        verifyTokenExpiry: "",
        verifyCode: "",
        resetPasswordToken: "",
        resetPasswordExpiry: "",
        resetPasswordCode: ""
      }
    }
  );
};



// ========== EXPORT ==========
const User =
  models.User || mongoose.model<IUser>("User", UserSchema);

export default User;