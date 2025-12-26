"use client";

import clsx from "clsx";
import React, { useState } from "react";
import Link from "next/link";
import { 
  LuShield, 
  LuLogOut, 
  LuBell,
  LuLock,
  LuSmartphone,
  LuEye,
  LuTrash2,
  LuChevronRight
} from "react-icons/lu";

export default function ProfileSettingsPage() {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    transactionAlerts: true,
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSignOut = () => {
    // Handle sign out logic
    console.log("Signing out...");
  };

  const handleDeleteAccount = () => {
    // Handle account deletion logic
    console.log("Delete account requested...");
  };

  return (
    <div className={clsx("space-y-6", "sm:space-y-8", "text-muted", "max-w-2xl")}>
      <div>
        <h2 className={clsx("text-2xl", "sm:text-3xl", "font-bold", "mb-2")}>Settings</h2>
        <p className="text-sm sm:text-base text-gray-600">Manage your account preferences and security</p>
      </div>

      {/* Security Section */}
      <section className={clsx("space-y-3", "sm:space-y-4")}>
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Security</h3>

        <Link
          href="/profile/settings/change-password"
          className={clsx(
            "flex",
            "items-center",
            "justify-between",
            "border-2",
            "border-muted",
            "rounded-xl",
            "px-4",
            "sm:px-5",
            "py-3",
            "sm:py-4",
            "w-full",
            "text-left",
            "hover:bg-gray-50",
            "active:bg-gray-100",
            "transition-colors",
            "touch-manipulation"
          )}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <LuLock className="w-5 h-5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm sm:text-base">Change Password</p>
              <p className="text-xs sm:text-sm text-gray-600 truncate">Update your password regularly</p>
            </div>
          </div>
          <LuChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
        </Link>

        <Link
          href="/profile/settings/two-factor-authentication"
          className={clsx(
            "flex",
            "items-center",
            "justify-between",
            "border-2",
            "border-muted",
            "rounded-xl",
            "px-4",
            "sm:px-5",
            "py-3",
            "sm:py-4",
            "w-full",
            "text-left",
            "hover:bg-gray-50",
            "active:bg-gray-100",
            "transition-colors",
            "touch-manipulation"
          )}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <LuSmartphone className="w-5 h-5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm sm:text-base">Two-Factor Authentication</p>
              <p className="text-xs sm:text-sm text-gray-600 truncate">Add an extra layer of security</p>
            </div>
          </div>
          <LuChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
        </Link>

        <Link
          href="/profile/settings/pin-management"
          className={clsx(
            "flex",
            "items-center",
            "justify-between",
            "border-2",
            "border-muted",
            "rounded-xl",
            "px-4",
            "sm:px-5",
            "py-3",
            "sm:py-4",
            "w-full",
            "text-left",
            "hover:bg-gray-50",
            "active:bg-gray-100",
            "transition-colors",
            "touch-manipulation"
          )}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <LuShield className="w-5 h-5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm sm:text-base">PIN Management</p>
              <p className="text-xs sm:text-sm text-gray-600 truncate">Change or reset your transaction PIN</p>
            </div>
          </div>
          <LuChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
        </Link>
      </section>

      {/* Notifications Section */}
      <section className={clsx("space-y-3", "sm:space-y-4")}>
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Notifications</h3>

        <div
          className={clsx(
            "border-2",
            "border-muted",
            "rounded-xl",
            "divide-y-2",
            "divide-muted"
          )}
        >
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className={clsx("flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4")}>
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <LuBell className="w-5 h-5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm sm:text-base truncate">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleToggle(key as keyof typeof notifications)}
                className={clsx(
                  "relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ml-3",
                  "touch-manipulation",
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
      </section>

      {/* Privacy Section */}
      <section className={clsx("space-y-3", "sm:space-y-4")}>
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Privacy</h3>

        <Link
          href="/profile/settings/privacy-settings"
          className={clsx(
            "flex",
            "items-center",
            "justify-between",
            "border-2",
            "border-muted",
            "rounded-xl",
            "px-4",
            "sm:px-5",
            "py-3",
            "sm:py-4",
            "w-full",
            "text-left",
            "hover:bg-gray-50",
            "active:bg-gray-100",
            "transition-colors",
            "touch-manipulation"
          )}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <LuEye className="w-5 h-5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm sm:text-base">Privacy Settings</p>
              <p className="text-xs sm:text-sm text-gray-600 truncate">Control who can see your information</p>
            </div>
          </div>
          <LuChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
        </Link>
      </section>

      {/* Account Actions Section */}
      <section className={clsx("space-y-3", "sm:space-y-4")}>
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Account</h3>

        <button
          onClick={handleSignOut}
          className={clsx(
            "flex",
            "items-center",
            "justify-between",
            "border-2",
            "border-muted",
            "rounded-xl",
            "px-4",
            "sm:px-5",
            "py-3",
            "sm:py-4",
            "w-full",
            "text-left",
            "hover:bg-gray-50",
            "active:bg-gray-100",
            "transition-colors",
            "touch-manipulation"
          )}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <LuLogOut className="w-5 h-5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm sm:text-base">Sign Out</p>
              <p className="text-xs sm:text-sm text-gray-600 truncate">Sign out from all devices</p>
            </div>
          </div>
          <LuChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
        </button>

        <button
          onClick={handleDeleteAccount}
          className={clsx(
            "flex",
            "items-center",
            "justify-between",
            "border-2",
            "border-red-300",
            "text-red-600",
            "rounded-xl",
            "px-4",
            "sm:px-5",
            "py-3",
            "sm:py-4",
            "w-full",
            "text-left",
            "hover:bg-red-50",
            "active:bg-red-100",
            "transition-colors",
            "touch-manipulation"
          )}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <LuTrash2 className="w-5 h-5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm sm:text-base">Delete Account</p>
              <p className="text-xs sm:text-sm text-red-500 truncate">Permanently delete your account</p>
            </div>
          </div>
          <LuChevronRight className="w-5 h-5 text-red-400 flex-shrink-0 ml-2" />
        </button>
      </section>

      {/* Footer Info */}
      <div className="text-center pt-4 pb-8">
        <p className="text-xs sm:text-sm text-gray-500">App Version 1.0.0</p>
        <p className="text-xs text-gray-400 mt-1">© 2024 Your Company. All rights reserved.</p>
      </div>
    </div>
  );
}