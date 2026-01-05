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
        "min-h-screen w-screen md:mt-0 mt-5",
        "flex",
        "items-center",
        "justify-center",
        "bg-[#0a0a0a]",
        "relative"
      )}
    >
      <ParticleBackground />
      <div className={clsx('relative w-full flex items-center justify-center md:p-4 p-2', 'z-10')}>
        <AuthCard>
          <h2
            className={clsx(
              "md:text-3xl text-2xl",
              "text-soft",
              "font-bold",
              "mb-6",
              "font-sora"
            )}
          >
            SignIn
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
            <NeonButton className="mt-4">SignIn</NeonButton>
          </form>
          <p className={clsx("text-white", "mt-4", "text-sm")}>
            Forgot password?{" "}
            <Link
              href="/auth/forgot-password"
              className={clsx("text-muted", "underline")}
            >
              Click here
            </Link>
          </p>
          <p className={clsx("text-white", "mt-2", "text-sm")}>
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className={clsx("text-muted", "underline")}
            >
              Register
            </Link>
          </p>
        </AuthCard>
      </div>
    </div>
  );
}
