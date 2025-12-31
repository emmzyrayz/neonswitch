import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { isValidEmail } from "@/lib/validator";
import { generateToken, generateVerificationCode } from "@/lib/token";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email: rawEmail } = body;

    const email = rawEmail?.toLowerCase().trim();

    // Validation
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { message: "If your email is registered, you will receive a verification link." },
        { status: 200 }
      );
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 }
      );
    }

    // Generate new token and code
    const verifyToken = generateToken();
    const verifyCode = generateVerificationCode(6);
    const verifyTokenExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

    // Update user
    user.verifyToken = verifyToken;
    user.verifyCode = verifyCode;
    user.verifyTokenExpiry = verifyTokenExpiry;
    await user.save();

    // TODO: Send verification email
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${verifyToken}&email=${email}`;
    
    // TODO: await sendVerificationEmail(email, verificationUrl, verifyCode);
    
    console.log("📧 New Verification URL:", verificationUrl);
    console.log("🔢 New Verification Code:", verifyCode);

    return NextResponse.json(
      {
        message: "Verification email sent. Please check your inbox.",
        // REMOVE IN PRODUCTION
        _dev: {
          verificationUrl,
          verificationCode: verifyCode,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("RESEND VERIFICATION ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}