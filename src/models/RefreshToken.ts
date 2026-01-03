// models/RefreshToken.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IRefreshToken extends Document {
  token: string;
  userId: mongoose.Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
  createdByIp: string;
  userAgent?: string;
  revokedAt?: Date;
  revokedByIp?: string;
  replacedByToken?: string;
  isExpired: boolean;
  isActive: boolean;
}

const RefreshTokenSchema = new Schema<IRefreshToken>({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  createdByIp: {
    type: String,
    required: true
  },
  userAgent: {
    type: String
  },
  revokedAt: {
    type: Date
  },
  revokedByIp: {
    type: String
  },
  replacedByToken: {
    type: String
  }
}, {
  timestamps: true
});

// Virtual properties
RefreshTokenSchema.virtual('isExpired').get(function() {
  return Date.now() >= this.expiresAt.getTime();
});

RefreshTokenSchema.virtual('isActive').get(function() {
  return !this.revokedAt && !this.isExpired;
});

// Index for automatic cleanup
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Methods
RefreshTokenSchema.methods.revoke = function(ip: string, replacedByToken?: string) {
  this.revokedAt = new Date();
  this.revokedByIp = ip;
  if (replacedByToken) {
    this.replacedByToken = replacedByToken;
  }
  return this.save();
};

const RefreshToken = mongoose.models.RefreshToken || mongoose.model<IRefreshToken>("RefreshToken", RefreshTokenSchema);

export default RefreshToken;