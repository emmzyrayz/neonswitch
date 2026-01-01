import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/password";
import { generateNeonId } from "@/lib/neonId";
import { isValidEmail, isValidPassword } from "@/lib/validator";
import { generateToken, generateVerificationCode } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";

interface MongoError extends Error {
  code?: number;
  keyPattern?: Record<string, number>;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email: rawEmail, password } = body;

    // Sanitize email
    const email = rawEmail?.toLowerCase().trim();

    // 1️⃣ Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      );
    }

    // 2️⃣ Connect DB
    await connectDB();

    // 3️⃣ Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // 4️⃣ Hash password
    const passwordHash = await hashPassword(password);

    // 5️⃣ Generate unique neonId
    let neonId = generateNeonId();
    let attempts = 0;

    while (await User.findOne({ neonId }) && attempts < 5) {
      neonId = generateNeonId();
      attempts++;
    }

    if (attempts >= 5) {
      throw new Error("Failed to generate unique neonId");
    }

    // 6️⃣ Generate verification token (MOVED INSIDE FUNCTION)
     const verifyToken = generateToken(); // Secure token for URL
    const verifyCode = generateVerificationCode(6); // Short code for manual entry
    const verifyTokenExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours


    // 7️⃣ Create user
    const user = await User.create({
      email,
      passwordHash,
      neonId,
      verifyToken,
      verifyCode,
      verifyTokenExpiry,
    });

    // 8️⃣ TODO: Send verification email
    // For now, we'll return the token in response (ONLY FOR TESTING!)
    // In production, send this via email and don't return it
   // 8️⃣ Build verification URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verificationUrl = `${baseUrl}/auth/verify?token=${verifyToken}&email=${email}`;
    
    console.log("📧 Verification URL:", verificationUrl);
    console.log("🔑 Verification Token:", verifyToken);
    console.log("🔢 Verification Code:", verifyCode);

    
    // TODO: Call email service here
    await sendVerificationEmail(email, verificationUrl, verifyCode);

     // 9️⃣ Respond with _dev object for testing
    const response = {
      message: "Registration successful. Please check your email to verify your account.",
      user: {
        neonId: user.neonId,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
      _dev: {
        verificationUrl: verificationUrl,
        verificationToken: verifyToken,
        verificationCode: verifyCode, // User-friendly code
        note: "Remove this _dev object in production!"
      }
    };

    console.log("📤 Sending response with _dev:", JSON.stringify(response, null, 2));


    // 9️⃣ Respond
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    const mongoError = error as MongoError;
    
    if (mongoError.code === 11000) {
      const field = Object.keys(mongoError.keyPattern || {})[0];
      const message = field === 'neonId' 
        ? "Failed to generate unique ID. Please try again."
        : "User already exists";
      
      return NextResponse.json(
        { error: message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}