"use client";

import clsx from "clsx";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  LuLock, 
  LuSmartphone, 
  LuShield,
  LuEye,
  LuEyeOff,
  LuCheck,
  LuCopy,
  LuCircleAlert
} from "react-icons/lu";

// Define settings configuration
const settingsConfig = {
  "change-password": {
    title: "Change Password",
    description: "Update your password to keep your account secure",
    icon: LuLock,
  },
  "two-factor-authentication": {
    title: "Two-Factor Authentication",
    description: "Add an extra layer of security to your account",
    icon: LuSmartphone,
  },
  "pin-management": {
    title: "PIN Management",
    description: "Change or reset your transaction PIN",
    icon: LuShield,
  },
  "privacy-settings": {
    title: "Privacy Settings",
    description: "Control who can see your information",
    icon: LuEye,
  },
};

export default function SettingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const settingId = params.settingsId as string;
  
  const config = settingsConfig[settingId as keyof typeof settingsConfig];

  if (!config) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-sm sm:text-base">Setting not found</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-blue-600 hover:underline text-sm"
        >
          Go back
        </button>
      </div>
    );
  }

  const Icon = config.icon;

  return (
    <div className={clsx("space-y-6", "sm:space-y-8", "text-muted", "max-w-2xl")}>
      {/* Header */}
      <div className="flex items-start gap-3 sm:gap-4">
        <div className={clsx(
          "w-10 h-10",
          "sm:w-12 sm:h-12",
          "rounded-xl",
          "bg-gray-100",
          "flex items-center justify-center",
          "shrink-0"
        )}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className={clsx("text-2xl", "sm:text-3xl", "font-bold", "mb-1", "sm:mb-2")}>{config.title}</h2>
          <p className="text-sm sm:text-base text-gray-600">{config.description}</p>
        </div>
      </div>

      {/* Dynamic Content Based on Setting Type */}
      {settingId === "change-password" && <ChangePasswordForm />}
      {settingId === "two-factor-authentication" && <TwoFactorAuthForm />}
      {settingId === "pin-management" && <PinManagementForm />}
      {settingId === "privacy-settings" && <PrivacySettingsForm />}
    </div>
  );
}

// Change Password Component
function ChangePasswordForm() {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Change password:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      <div className={clsx("border-2", "border-muted", "rounded-xl", "sm:rounded-2xl", "p-4", "sm:p-6", "space-y-4", "sm:space-y-5")}>
        <div>
          <label className={clsx('block', 'text-xs', 'sm:text-sm', 'font-medium', 'mb-2')}>
            Current Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPasswords.current ? "text" : "password"}
              value={formData.currentPassword}
              onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
              required
              className={clsx(
                "w-full",
                "border-2",
                "border-muted",
                "rounded-xl",
                "px-3",
                "sm:px-4",
                "py-2",
                "sm:py-2.5",
                "pr-11",
                "sm:pr-12",
                "text-sm",
                "sm:text-base",
                "focus:outline-none",
                "focus:border-blue-500"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 touch-manipulation"
            >
              {showPasswords.current ? <LuEyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" /> : <LuEye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />}
            </button>
          </div>
        </div>

        <div>
          <label className={clsx('block', 'text-xs', 'sm:text-sm', 'font-medium', 'mb-2')}>
            New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? "text" : "password"}
              value={formData.newPassword}
              onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
              required
              className={clsx(
                "w-full",
                "border-2",
                "border-muted",
                "rounded-xl",
                "px-3",
                "sm:px-4",
                "py-2",
                "sm:py-2.5",
                "pr-11",
                "sm:pr-12",
                "text-sm",
                "sm:text-base",
                "focus:outline-none",
                "focus:border-blue-500"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 touch-manipulation"
            >
              {showPasswords.new ? <LuEyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" /> : <LuEye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />}
            </button>
          </div>
        </div>

        <div>
          <label className={clsx('block', 'text-xs', 'sm:text-sm', 'font-medium', 'mb-2')}>
            Confirm New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required
              className={clsx(
                "w-full",
                "border-2",
                "border-muted",
                "rounded-xl",
                "px-3",
                "sm:px-4",
                "py-2",
                "sm:py-2.5",
                "pr-11",
                "sm:pr-12",
                "text-sm",
                "sm:text-base",
                "focus:outline-none",
                "focus:border-blue-500"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 touch-manipulation"
            >
              {showPasswords.confirm ? <LuEyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" /> : <LuEye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />}
            </button>
          </div>
        </div>

        <div className={clsx("flex items-start gap-2 bg-blue-50 p-3 sm:p-4 rounded-xl")}>
          <LuCircleAlert className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-blue-800">
            <p className="font-medium mb-1">Password Requirements:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>At least 8 characters long</li>
              <li>Contains uppercase and lowercase letters</li>
              <li>Contains at least one number</li>
              <li>Contains at least one special character</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          type="submit"
          className={clsx(
            "bg-gray-800",
            "text-white",
            "rounded-xl",
            "px-5 sm:px-6",
            "py-2.5 sm:py-3",
            "text-sm",
            "font-medium",
            "hover:bg-gray-700",
            "active:bg-gray-900",
            "transition-colors",
            "touch-manipulation"
          )}
        >
          Update Password
        </button>
      </div>
    </form>
  );
}

// Two-Factor Authentication Component
function TwoFactorAuthForm() {
  const [step, setStep] = useState<"setup" | "verify">("setup");
  const [qrCode] = useState("JBSWY3DPEHPK3PXP");
  const [verificationCode, setVerificationCode] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(qrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Verify 2FA:", verificationCode);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {step === "setup" && (
        <>
          <div className={clsx("border-2", "border-muted", "rounded-xl", "sm:rounded-2xl", "p-4", "sm:p-6", "space-y-4", "sm:space-y-5")}>
            <div>
              <h3 className="font-semibold text-sm sm:text-base mb-2">Step 1: Install Authenticator App</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Download Google Authenticator or Authy on your mobile device
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-sm sm:text-base mb-2">Step 2: Scan QR Code</h3>
              <div className={clsx("bg-white p-4 sm:p-6 rounded-xl border-2 border-muted inline-block")}>
                <div className="w-40 h-40 sm:w-48 sm:h-48 bg-gray-200 flex items-center justify-center">
                  <p className="text-xs text-gray-500 text-center">QR Code<br/>Placeholder</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm sm:text-base mb-2">Step 3: Or Enter Code Manually</h3>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-gray-100 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-mono text-xs sm:text-sm break-all">
                  {qrCode}
                </code>
                <button
                  type="button"
                  onClick={handleCopy}
                  className={clsx(
                    "border-2 border-muted rounded-xl px-3 sm:px-4 py-2.5 sm:py-3",
                    "hover:bg-gray-50 active:bg-gray-100 transition-colors shrink-0 touch-manipulation"
                  )}
                >
                  {copied ? <LuCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" /> : <LuCopy className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep("verify")}
            className={clsx(
              "w-full sm:w-auto",
              "bg-gray-800",
              "text-white",
              "rounded-xl",
              "px-5 sm:px-6",
              "py-2.5 sm:py-3",
              "text-sm",
              "font-medium",
              "hover:bg-gray-700",
              "active:bg-gray-900",
              "transition-colors",
              "touch-manipulation"
            )}
          >
            Continue to Verification
          </button>
        </>
      )}

      {step === "verify" && (
        <form onSubmit={handleVerify} className="space-y-5 sm:space-y-6">
          <div className={clsx("border-2", "border-muted", "rounded-xl", "sm:rounded-2xl", "p-4", "sm:p-6", "space-y-4", "sm:space-y-5")}>
            <div>
              <h3 className="font-semibold text-sm sm:text-base mb-2">Verify Setup</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                Enter the 6-digit code from your authenticator app
              </p>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className={clsx(
                  "w-full",
                  "border-2",
                  "border-muted",
                  "rounded-xl",
                  "px-3",
                  "sm:px-4",
                  "py-2.5",
                  "sm:py-3",
                  "text-center",
                  "text-xl",
                  "sm:text-2xl",
                  "font-mono",
                  "tracking-widest",
                  "focus:outline-none",
                  "focus:border-blue-500"
                )}
              />
            </div>

            <div className={clsx("flex items-start gap-2 bg-green-50 p-3 sm:p-4 rounded-xl")}>
              <LuCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-green-800">
                Once verified, you&apos;ll need to enter a code from your authenticator app each time you sign in.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="submit"
              className={clsx(
                "bg-gray-800",
                "text-white",
                "rounded-xl",
                "px-5 sm:px-6",
                "py-2.5 sm:py-3",
                "text-sm",
                "font-medium",
                "hover:bg-gray-700",
                "active:bg-gray-900",
                "transition-colors",
                "touch-manipulation"
              )}
            >
              Enable 2FA
            </button>
            <button
              type="button"
              onClick={() => setStep("setup")}
              className={clsx(
                "border-2",
                "border-muted",
                "rounded-xl",
                "px-5 sm:px-6",
                "py-2.5 sm:py-3",
                "text-sm",
                "font-medium",
                "hover:bg-gray-50",
                "active:bg-gray-100",
                "transition-colors",
                "touch-manipulation"
              )}
            >
              Back
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// PIN Management Component
function PinManagementForm() {
  const [formData, setFormData] = useState({
    currentPin: "",
    newPin: "",
    confirmPin: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Change PIN:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      <div className={clsx("border-2", "border-muted", "rounded-xl", "sm:rounded-2xl", "p-4", "sm:p-6", "space-y-4", "sm:space-y-5")}>
        <div>
          <label className={clsx('block', 'text-xs', 'sm:text-sm', 'font-medium', 'mb-2')}>
            Current PIN <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={formData.currentPin}
            onChange={(e) => setFormData({...formData, currentPin: e.target.value.replace(/\D/g, '').slice(0, 4)})}
            maxLength={4}
            placeholder="••••"
            required
            className={clsx(
              "w-full",
              "border-2",
              "border-muted",
              "rounded-xl",
              "px-3",
              "sm:px-4",
              "py-2.5",
              "sm:py-3",
              "text-center",
              "text-xl",
              "sm:text-2xl",
              "tracking-widest",
              "focus:outline-none",
              "focus:border-blue-500"
            )}
          />
        </div>

        <div>
          <label className={clsx('block', 'text-xs', 'sm:text-sm', 'font-medium', 'mb-2')}>
            New PIN <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={formData.newPin}
            onChange={(e) => setFormData({...formData, newPin: e.target.value.replace(/\D/g, '').slice(0, 4)})}
            maxLength={4}
            placeholder="••••"
            required
            className={clsx(
              "w-full",
              "border-2",
              "border-muted",
              "rounded-xl",
              "px-3",
              "sm:px-4",
              "py-2.5",
              "sm:py-3",
              "text-center",
              "text-xl",
              "sm:text-2xl",
              "tracking-widest",
              "focus:outline-none",
              "focus:border-blue-500"
            )}
          />
        </div>

        <div>
          <label className={clsx('block', 'text-xs', 'sm:text-sm', 'font-medium', 'mb-2')}>
            Confirm New PIN <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={formData.confirmPin}
            onChange={(e) => setFormData({...formData, confirmPin: e.target.value.replace(/\D/g, '').slice(0, 4)})}
            maxLength={4}
            placeholder="••••"
            required
            className={clsx(
              "w-full",
              "border-2",
              "border-muted",
              "rounded-xl",
              "px-3",
              "sm:px-4",
              "py-2.5",
              "sm:py-3",
              "text-center",
              "text-xl",
              "sm:text-2xl",
              "tracking-widest",
              "focus:outline-none",
              "focus:border-blue-500"
            )}
          />
        </div>

        <div className={clsx("flex items-start gap-2 bg-blue-50 p-3 sm:p-4 rounded-xl")}>
          <LuCircleAlert className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-blue-800">
            Your PIN must be 4 digits. Avoid using obvious numbers like 1234 or your birth year.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          type="submit"
          className={clsx(
            "bg-gray-800",
            "text-white",
            "rounded-xl",
            "px-5 sm:px-6",
            "py-2.5 sm:py-3",
            "text-sm",
            "font-medium",
            "hover:bg-gray-700",
            "active:bg-gray-900",
            "transition-colors",
            "touch-manipulation"
          )}
        >
          Update PIN
        </button>
      </div>
    </form>
  );
}

// Privacy Settings Component
function PrivacySettingsForm() {
  const [settings, setSettings] = useState({
    showEmail: false,
    showPhone: false,
    showTransactions: true,
    allowMessaging: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({...prev, [key]: !prev[key]}));
  };

  const handleSave = () => {
    console.log("Save privacy settings:", settings);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className={clsx("border-2", "border-muted", "rounded-xl", "sm:rounded-2xl", "divide-y-2", "divide-muted")}>
        {Object.entries(settings).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5">
            <div className="min-w-0 flex-1 pr-3">
              <p className="font-medium text-sm sm:text-base">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                {key === 'showEmail' && 'Allow others to see your email address'}
                {key === 'showPhone' && 'Allow others to see your phone number'}
                {key === 'showTransactions' && 'Show your transaction history on your profile'}
                {key === 'allowMessaging' && 'Allow other users to message you'}
              </p>
            </div>
            <button
              onClick={() => handleToggle(key as keyof typeof settings)}
              className={clsx(
                "relative w-12 h-6 rounded-full transition-colors shrink-0 touch-manipulation",
                value ? "bg-blue-600" : "bg-gray-300"
              )}
            >
              <span
                className={clsx(
                  "absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform",
                  value ? "left-6" : "left-0.5"
                )}
              />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className={clsx(
          "w-full sm:w-auto",
          "bg-gray-800",
          "text-white",
          "rounded-xl",
          "px-5 sm:px-6",
          "py-2.5 sm:py-3",
          "text-sm",
          "font-medium",
          "hover:bg-gray-700",
          "active:bg-gray-900",
          "transition-colors",
          "touch-manipulation"
        )}
      >
        Save Privacy Settings
      </button>
    </div>
  );
}