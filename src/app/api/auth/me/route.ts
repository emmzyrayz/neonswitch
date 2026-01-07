// app/api/auth/me/route.ts - IMPROVED VERSION
import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/AuthM";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    // ========== 1. AUTHENTICATE USER ==========
    const { error, user: authUser } = await authenticateRequest(req);
    
    if (error || !authUser) {
      return error || NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // ========== 2. CONNECT TO DATABASE ==========
    await connectDB();

    // ========== 3. FETCH FULL USER DATA ==========
    const user = await User.findById(authUser.userId).select(
      "-passwordHash -verifyToken -verifyCode -resetPasswordToken -resetPasswordCode -phoneVerifyCode"
    );

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // ========== 4. RETURN COMPREHENSIVE USER DATA ==========
    return NextResponse.json(
      {
        user: {
          // Basic Info
          id: user._id.toString(),
          email: user.email,
          phone: user.phone,
          neonId: user.neonId,
          role: user.role,

          // Verification Status
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,

          // KYC Status
          kycTier: user.kycTier,
          kycStatus: user.kycStatus,

          // Profile Information
          profile: {
            firstName: user.profile?.firstName,
            lastName: user.profile?.lastName,
            dateOfBirth: user.profile?.dateOfBirth,
            nationality: user.profile?.nationality,
            gender: user.profile?.gender,
          },

          // Address (if available)
          address: user.address ? {
            country: user.address.country,
            state: user.address.state,
            city: user.address.city,
            street: user.address.street,
            postalCode: user.address.postalCode,
          } : undefined,

          // KYC Info (limited for security)
          kyc: user.kyc ? {
            idType: user.kyc.idType,
            idVerified: user.kyc.idVerified,
            submittedAt: user.kyc.submittedAt,
            verifiedAt: user.kyc.verifiedAt,
            // Omit sensitive idNumber
          } : undefined,

          // Metadata
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("GET USER ERROR:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching user data. Please try again." },
      { status: 500 }
    );
  }
}