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
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  code?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function ResetPassword() {
  const { resetPassword, isLoading, error: authError, clearError } = useAuth();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Pre-fill email and token from URL if available
  useEffect(() => {
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (email) {
      setFormData((prev) => ({ ...prev, email: decodeURIComponent(email) }));
    }
    if (token) {
      setFormData((prev) => ({ ...prev, code: token }));
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

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Reset code is required";
    } else if (formData.code.length < 6) {
      newErrors.code = "Code must be at least 6 characters";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword =
        "Password must contain uppercase, lowercase, and number";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
        await resetPassword(
          formData.email,
          formData.newPassword,
          undefined, // token (if using URL token)
          formData.code // code (if using manual code entry)
        );

        setSuccessMessage(
          "Password reset successfully! Redirecting to login..."
        );
        // AuthContext will handle navigation to /auth/signin?reset=true
      } catch (error) {
        console.error("Reset password error:", error);
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
            Reset Password
          </h2>
          <p className={clsx("text-soft font-medium", "mb-4", "text-sm")}>
            Enter the code from your email and create a new password
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
              label="Reset Code"
              name="code"
              placeholder="Enter code from email"
              value={formData.code}
              onChange={handleInputChange}
              error={errors.code}
              disabled={isLoading || isSubmitting}
              required
            />

            <AuthInput
              label="New Password"
              name="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleInputChange}
              error={errors.newPassword}
              disabled={isLoading || isSubmitting}
              required
            />

            <AuthInput
              label="Confirm New Password"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword}
              disabled={isLoading || isSubmitting}
              required
            />

            {/* Show/Hide Password Toggle */}
            <div className={clsx("flex", "items-center", "mb-4")}>
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
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
                htmlFor="showPassword"
                className={clsx(
                  "ml-2",
                  "text-sm",
                  "text-muted",
                  "cursor-pointer"
                )}
              >
                Show password
              </label>
            </div>

            {/* Password Requirements */}
            <div
              className={clsx(
                "mb-4",
                "p-3",
                "rounded-md",
                "bg-[#1a1a1a]",
                "border",
                "border-soft/30"
              )}
            >
              <p
                className={clsx(
                  "text-xs",
                  "text-muted",
                  "mb-2",
                  "font-semibold"
                )}
              >
                Password requirements:
              </p>
              <ul
                className={clsx(
                  "text-xs",
                  "text-gray-400",
                  "space-y-1",
                  "list-disc",
                  "list-inside"
                )}
              >
                <li>At least 8 characters long</li>
                <li>Contains uppercase letter (A-Z)</li>
                <li>Contains lowercase letter (a-z)</li>
                <li>Contains number (0-9)</li>
              </ul>
            </div>

            <NeonButton type="submit" className="mt-4" disabled={isLoading || isSubmitting}>
              {isLoading || isSubmitting
                ? "Resetting Password..."
                : "Reset Password"}
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

          <p className={clsx("text-white", "mt-2", "text-sm", "text-center")}>
            Didn&apos;t receive a code?{" "}
            <Link
              href="/auth/forgot-password"
              className={clsx("text-muted", "underline", "hover:text-soft")}
            >
              Request New Code
            </Link>
          </p>
        </AuthCard>
      </div>
    </div>
  );
}
