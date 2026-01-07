"use client";
import AuthInput from "../components/authinput";
import NeonButton from "../components/neonbutton";
import AuthCard from "../components/authcard";
import ParticleBackground from "../components/particlebackground";
import clsx from "clsx";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { withRandomDelay } from "@/lib/click";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface FormData {
  code: string;
  email: string;
}

interface FormErrors {
  code?: string;
  email?: string;
}

export default function Verify() {
  const {
    verifyEmail,
    resendVerification,
    isLoading,
    error: authError,
    clearError,
  } = useAuth();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState<FormData>({
    code: "",
    email: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  // Auto-verify if token is in URL (wrapped in useCallback)
  const handleAutoVerify = useCallback(
    async (email: string, token: string) => {
      setIsSubmitting(true);
      try {
        await verifyEmail(email, token);
        setSuccessMessage(
          "Email verified successfully! Redirecting to login..."
        );
      } catch (error) {
        console.error("Auto-verification error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [verifyEmail]
  );

  // Pre-fill email from URL if available
  useEffect(() => {
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (email) {
      setFormData((prev) => ({ ...prev, email: decodeURIComponent(email) }));
    }

    // If token is in URL, auto-verify
    if (token && email) {
      handleAutoVerify(decodeURIComponent(email), token);
    }
  }, [searchParams, handleAutoVerify]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    clearError();
    setSuccessMessage(null);
    setResendMessage(null);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Verification code is required";
    } else if (formData.code.length < 6) {
      newErrors.code = "Code must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission with delay
  const handleSubmitWithDelay = withRandomDelay(
    async () => {
      if (!validateForm()) return;

      setIsSubmitting(true);

      try {
        await verifyEmail(formData.email, undefined, formData.code);
        setSuccessMessage(
          "Email verified successfully! Redirecting to login..."
        );
      } catch (error) {
        console.error("Verification error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    { minDelayMs: 500, maxDelayMs: 1500 }
  );

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmitWithDelay();
  };

  // Handle resend verification
  const handleResend = async () => {
    if (!formData.email.trim()) {
      setErrors({ email: "Email is required to resend verification" });
      return;
    }

    setIsResending(true);
    setResendMessage(null);
    clearError();

    try {
      await resendVerification(formData.email, "email");
      setResendMessage(
        "Verification code resent successfully! Check your email."
      );
    } catch (error) {
      console.error("Resend error:", error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      className={clsx(
        "min-h-screen w-screen",
        "flex",
        "items-center",
        "justify-center",
        "bg-[#0a0a0a]",
        "relative"
      )}
    >
      <ParticleBackground />
      <div
        className={clsx(
          "relative w-full flex items-center justify-center md:p-4 p-2",
          "z-10"
        )}
      >
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
            Verify Account
          </h2>
          <p className={clsx("text-white", "mb-4", "text-sm")}>
            Enter the code sent to your email
          </p>

          {successMessage && (
            <div
              className={clsx(
                "mb-4 p-3 rounded-md",
                "bg-green-500/10 border border-green-500",
                "text-green-500 text-sm"
              )}
            >
              {successMessage}
            </div>
          )}

          {resendMessage && (
            <div
              className={clsx(
                "mb-4 p-3 rounded-md",
                "bg-blue-500/10 border border-blue-500",
                "text-blue-500 text-sm"
              )}
            >
              {resendMessage}
            </div>
          )}

          {authError && (
            <div
              className={clsx(
                "mb-4 p-3 rounded-md",
                "bg-red-500/10 border border-red-500",
                "text-red-500 text-sm"
              )}
            >
              {authError}
            </div>
          )}

          <form className={clsx("flex", "flex-col")} onSubmit={handleSubmit}>
            <AuthInput
              label="Email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              disabled={isLoading || isSubmitting}
              required
            />

            <AuthInput
              label="Verification Code"
              name="code"
              placeholder="XXXXXX"
              value={formData.code}
              onChange={handleInputChange}
              error={errors.code}
              disabled={isLoading || isSubmitting}
              required
            />

            <NeonButton className="mt-4" disabled={isLoading || isSubmitting}>
              {isLoading || isSubmitting ? "Verifying..." : "Verify"}
            </NeonButton>
          </form>

          <div className={clsx("mt-4", "text-center")}>
            <p className={clsx("text-white", "text-sm")}>
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending || isLoading || isSubmitting}
                className={clsx(
                  "text-muted",
                  "underline",
                  "hover:text-soft",
                  "disabled:opacity-50",
                  "disabled:cursor-not-allowed"
                )}
              >
                {isResending ? "Resending..." : "Resend Code"}
              </button>
            </p>
          </div>

          <p className={clsx("text-white", "mt-4", "text-sm", "text-center")}>
            <Link
              href="/auth/signin"
              className={clsx("text-muted", "underline", "hover:text-soft")}
            >
              Back to Sign In
            </Link>
          </p>
        </AuthCard>
      </div>
    </div>
  );
}
