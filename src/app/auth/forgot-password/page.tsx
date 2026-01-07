"use client";
import AuthInput from "../components/authinput";
import NeonButton from "../components/neonbutton";
import AuthCard from "../components/authcard";
import ParticleBackground from "../components/particlebackground";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { withRandomDelay } from "@/lib/click";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface FormData {
  emailOrPhone: string;
}

interface FormErrors {
  emailOrPhone?: string;
}

export default function ForgotPassword() {
  const { forgotPassword, isLoading, error: authError, clearError } = useAuth();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState<FormData>({
    emailOrPhone: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Pre-fill email from URL if available
  useEffect(() => {
    const email = searchParams.get("email");
    if (email) {
      setFormData({ emailOrPhone: decodeURIComponent(email) });
    }
  }, [searchParams]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    clearError();
    setSuccessMessage(null);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = "Email or phone is required";
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
        // The forgotPassword function expects email
        // Your backend should handle both email and phone
        await forgotPassword(formData.emailOrPhone);

        // Success message after redirect is prevented by AuthContext navigation
        // So we show it here before navigation
        setSuccessMessage(
          "Password reset instructions have been sent to your email!"
        );

        // AuthContext will handle navigation to /auth/forgot-password with email param
      } catch (error) {
        console.error("Forgot password error:", error);
        // Error is already handled by AuthContext
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
            Forgot Password
          </h2>
          <p className={clsx("text-soft font-medium", "mb-4", "text-sm")}>
            Enter your email or phone to reset your password
          </p>

          {/* Display success message */}
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

          {/* Display auth error if exists */}
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
              label="Email or Phone"
              name="emailOrPhone"
              placeholder="Enter your email or phone"
              value={formData.emailOrPhone}
              onChange={handleInputChange}
              error={errors.emailOrPhone}
              disabled={isLoading || isSubmitting}
              required
            />

            <NeonButton className="mt-4" disabled={isLoading || isSubmitting}>
              {isLoading || isSubmitting ? "Sending..." : "Send Reset Link"}
            </NeonButton>
          </form>

          <p className={clsx("text-white", "mt-4", "text-sm", "text-center")}>
            Remember your password?{" "}
            <Link
              href="/auth/signin"
              className={clsx("text-muted", "underline", "hover:text-soft")}
            >
              Sign In
            </Link>
          </p>
        </AuthCard>
      </div>
    </div>
  );
}
