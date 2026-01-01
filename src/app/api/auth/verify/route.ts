import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sendWelcomeEmail } from "@/lib/mail";

interface VerifyQuery {
  email: string;
  verifyCode?: string;
  verifyToken?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, token, code } = body;

    // Validation - need email and either token OR code
    if (!email || (!token && !code)) {
      return NextResponse.json(
        { error: "Email and verification token or code are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Build query - search by either token or code
    const query: VerifyQuery = {
      email: email.toLowerCase().trim(),
    };

    if (code) {
      query.verifyCode = code.toUpperCase(); // Code is case-insensitive
    } else if (token) {
      query.verifyToken = token;
    }

    // Find user
    const user = await User.findOne(query);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification token/code" },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (user.verifyTokenExpiry && new Date() > user.verifyTokenExpiry) {
      return NextResponse.json(
        { error: "Verification token has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return NextResponse.json(
        { message: "Email is already verified" },
        { status: 200 }
      );
    }

    // Update user
    user.isEmailVerified = true;
    user.verifyToken = undefined;
    user.verifyCode = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    // After verifying email
    try {
  await sendWelcomeEmail(user.email, user.neonId);
} catch (mailError) {
  console.error("WELCOME EMAIL FAILED:", mailError);
}

    return NextResponse.json(
      {
        message: "Email verified successfully! You can now log in.",
        user: {
          email: user.email,
          neonId: user.neonId,
          isEmailVerified: user.isEmailVerified,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("VERIFY ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Optional: GET method for URL-based verification
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email || !token) {
      return NextResponse.json(
        { error: "Email and token are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      verifyToken: token,
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    if (user.verifyTokenExpiry && new Date() > user.verifyTokenExpiry) {
      return NextResponse.json(
        { error: "Verification token has expired" },
        { status: 400 }
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { message: "Email is already verified" },
        { status: 200 }
      );
    }

    user.isEmailVerified = true;
    user.verifyToken = undefined;
    user.verifyCode = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    // After verifying email
    try {
  await sendWelcomeEmail(user.email, user.neonId);
} catch (mailError) {
  console.error("WELCOME EMAIL FAILED:", mailError);
}

    // Redirect to success page or return JSON
    return NextResponse.json(
      { message: "Email verified successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("VERIFY ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
