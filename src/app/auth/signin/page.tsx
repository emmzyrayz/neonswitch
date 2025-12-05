"use client";
import AuthInput from "../components/authinput";
import NeonButton from "../components/neonbutton";
import AuthCard from "../components/authcard";
import ParticleBackground from "../components/particlebackground";
import Link from "next/link";
import clsx from "clsx";

export default function Login() {
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
      <div className={clsx('relative', 'z-10')}>
        <AuthCard>
          <h2
            className={clsx(
              "text-3xl",
              "text-neonGreen",
              "font-bold",
              "mb-6",
              "font-mono"
            )}
          >
            Login
          </h2>
          <form className={clsx("flex", "flex-col")}>
            <AuthInput
              label="Email or Phone"
              placeholder="Enter your email or phone"
            />
            <AuthInput
              label="Password"
              type="password"
              placeholder="Enter your password"
            />
            <NeonButton className="mt-4">Login</NeonButton>
          </form>
          <p className={clsx("text-white", "mt-4", "text-sm")}>
            Forgot password?{" "}
            <Link
              href="/auth/forgot-password"
              className={clsx("text-neonCyan", "underline")}
            >
              Click here
            </Link>
          </p>
          <p className={clsx("text-white", "mt-2", "text-sm")}>
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className={clsx("text-neonPink", "underline")}
            >
              Register
            </Link>
          </p>
        </AuthCard>
      </div>
    </div>
  );
}
