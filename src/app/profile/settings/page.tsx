import clsx from "clsx";
import React from "react";
import { LuShield, LuLogOut } from "react-icons/lu";

export default function ProfileSettingsPage() {
  return (
    <div className={clsx("space-y-10", "text-muted")}>
      <h2 className={clsx("text-2xl", "font-bold")}>Settings</h2>

      {/* Security */}
      <section className={clsx("space-y-4")}>
        <h3 className="text-lg font-semibold">Security</h3>

        <button
          className={clsx(
            "flex",
            "items-center",
            "gap-3",
            "border-2",
            "border-muted",
            "rounded-xl",
            "px-4",
            "py-3",
            "w-full",
            "text-left"
          )}
        >
          <LuShield className="w-5 h-5" />
          Change Password
        </button>
      </section>

      {/* Account */}
      <section className={clsx("space-y-4")}>
        <h3 className="text-lg font-semibold">Account</h3>

        <button
          className={clsx(
            "flex",
            "items-center",
            "gap-3",
            "border-2",
            "border-red-400",
            "text-red-600",
            "rounded-xl",
            "px-4",
            "py-3",
            "w-full",
            "text-left"
          )}
        >
          <LuLogOut className="w-5 h-5" />
          Sign Out
        </button>
      </section>
    </div>
  );
}
