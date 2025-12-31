import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    neonId: {
      type: String,
      unique: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    verifyToken: String,
  verifyTokenExpiry: Date,
  verifyCode: String,

  resetPasswordToken: String,
  resetPasswordExpiry: Date,
  resetPasswordCode: String,
  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", UserSchema);