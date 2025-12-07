'use client'
import AuthInput from "../components/authinput";
import NeonButton from "../components/neonbutton";
import AuthCard from "../components/authcard";
import ParticleBackground from "../components/particlebackground";
import Link from "next/link";
import clsx from "clsx";

export default function Register() {
  return (
    <div
      className={clsx(
        "min-h-screen",
        "flex",
        "items-center",
        "justify-center",
        "bg-[#0a0a0a]",
        "relative"
      )}
    >
      <ParticleBackground />
      <div className={clsx("relative", "z-10")}>
        <AuthCard>
          <h2
            className={clsx(
              "text-3xl",
              "text-neonPink",
              "font-bold",
              "mb-6",
              "font-mono"
            )}
          >
            Create Account
          </h2>
          <form className={clsx("flex", "flex-col")}>
            <AuthInput label="Full Name" placeholder="John Doe" />
            <AuthInput label="Email" placeholder="example@mail.com" />
            <AuthInput label="Phone" placeholder="+234..." />
            <AuthInput
              label="Password"
              type="password"
              placeholder="Enter password"
            />
            <AuthInput
              label="Confirm Password"
              type="password"
              placeholder="Confirm password"
            />
            <NeonButton className="mt-4">Register</NeonButton>
          </form>
          <p className={clsx("text-white", "mt-4", "text-sm")}>
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className={clsx("text-muted", "underline")}
            >
              Login
            </Link>
          </p>
        </AuthCard>
      </div>
    </div>
  );
}
