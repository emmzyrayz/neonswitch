"use client";
import AuthInput from "../components/authinput";
import NeonButton from "../components/neonbutton";
import AuthCard from "../components/authcard";
import ParticleBackground from "../components/particlebackground";
import clsx from "clsx";

export default function Verify() {
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
              "text-neonCyan",
              "font-bold",
              "mb-6",
              "font-mono"
            )}
          >
            Verify Account
          </h2>
          <p className={clsx("text-white", "mb-4", "text-sm")}>
            Enter the code sent to your email or phone
          </p>
          <form className={clsx("flex", "flex-col")}>
            <AuthInput label="Verification Code" placeholder="XXXXXX" />
            <NeonButton className="mt-4">Verify</NeonButton>
          </form>
        </AuthCard>
      </div>
    </div>
  );
}
