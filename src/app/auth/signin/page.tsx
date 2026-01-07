"use client";
import AuthInput from "../components/authinput";
import NeonButton from "../components/neonbutton";
import AuthCard from "../components/authcard";
import ParticleBackground from "../components/particlebackground";
import Link from "next/link";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { withRandomDelay } from "@/lib/click";
import { useSearchParams } from "next/navigation";

interface FormData {
  emailOrPhone: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  emailOrPhone?: string;
  password?: string;
}

export default function Login() {
  const { login, isLoading, error: authError, clearError } = useAuth();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState<FormData>({
    emailOrPhone: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check for URL parameters (verified, reset, etc.)
  useEffect(() => {
    const verified = searchParams.get("verified");
    const reset = searchParams.get("reset");

    if (verified === "true") {
      setSuccessMessage("Email verified successfully! You can now log in.");
    } else if (reset === "true") {
      setSuccessMessage(
        "Password reset successfully! You can now log in with your new password."
      );
    }
  }, [searchParams]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;

    // Use 'as' or type checking to access properties specific to Input
    const checked = "checked" in target ? target.checked : false;
    const type = "type" in target ? target.type : "";
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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

    if (!formData.password) {
      newErrors.password = "Password is required";
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
        // The login function expects email, but we'll send emailOrPhone
        // The backend should handle both email and phone
        await login(
          formData.emailOrPhone,
          formData.password,
          formData.rememberMe
        );

        // Success - AuthContext will handle navigation to dashboard
      } catch (error) {
        console.error("Login error:", error);
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
        "min-h-screen w-screen md:mt-0 mt-5",
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
              "md:text-3xl text-2xl",
              "text-soft",
              "font-bold",
              "mb-6",
              "font-sora"
            )}
          >
            SignIn
          </h2>

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

            <AuthInput
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              disabled={isLoading || isSubmitting}
              required
            />

            {/* Remember Me Checkbox */}
            <div className={clsx("flex", "items-center", "mb-4")}>
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                disabled={isLoading || isSubmitting}
                className={clsx(
                  "w-4 h-4",
                  "text-soft",
                  "bg-[#1a1a1a]",
                  "border-soft",
                  "rounded",
                  "focus:ring-2",
                  "focus:ring-soft",
                  "cursor-pointer"
                )}
              />
              <label
                htmlFor="rememberMe"
                className={clsx(
                  "ml-2",
                  "text-sm",
                  "text-muted",
                  "cursor-pointer"
                )}
              >
                Remember me
              </label>
            </div>

            <NeonButton className="mt-4" disabled={isLoading || isSubmitting}>
              {isLoading || isSubmitting ? "Signing In..." : "SignIn"}
            </NeonButton>
          </form>

          <p className={clsx("text-white", "mt-4", "text-sm")}>
            Forgot password?{" "}
            <Link
              href="/auth/forgot-password"
              className={clsx("text-muted", "underline", "hover:text-soft")}
            >
              Click here
            </Link>
          </p>
          <p className={clsx("text-white", "mt-2", "text-sm")}>
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className={clsx("text-muted", "underline", "hover:text-soft")}
            >
              Register
            </Link>
          </p>
        </AuthCard>
      </div>
    </div>
  );
}
