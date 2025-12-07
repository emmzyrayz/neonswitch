"use client";
import AuthInput from "../components/authinput";
import NeonButton from "../components/neonbutton";
import AuthCard from "../components/authcard";
import ParticleBackground from "../components/particlebackground";
import clsx from "clsx";

export default function ForgotPassword() {
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
              "text-muted",
              "font-bold",
              "mb-6",
              "font-mono"
            )}
          >
            Forgot Password
          </h2>
          <p className={clsx("text-white", "mb-4", "text-sm")}>
            Enter your email or phone to reset your password
          </p>
          <form className={clsx("flex", "flex-col")}>
            <AuthInput
              label="Email or Phone"
              placeholder="Enter your email or phone"
            />
            <NeonButton className="mt-4">Send Reset Link</NeonButton>
          </form>
        </AuthCard>
      </div>
    </div>
  );
}
