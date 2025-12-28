import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ message: "MongoDB connected ✅" });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      { error: "DB connection failed ❌" },
      { status: 500 }
    );
  }
}
