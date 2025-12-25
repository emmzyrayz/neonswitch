import clsx from "clsx";
import React from "react";
import Link from "next/link";
import { LuUser, LuSettings } from "react-icons/lu";

export default function ProfilePage() {
  return (
    <div className={clsx("space-y-8", "text-muted")}>
      {/* User Card */}
      <section
        className={clsx(
          "border-2",
          "border-muted",
          "rounded-2xl",
          "p-6"
        )}
      >
        <h2 className={clsx("text-2xl", "font-bold", "mb-2")}>
          Nnamdi Emmanuel
        </h2>
        <p className="text-gray-600">Verified user</p>

        <div className={clsx("mt-4", "flex", "gap-4")}>
          <Link
            href="/profile/edit"
            className={clsx(
              "border-2",
              "border-muted",
              "rounded-xl",
              "px-4",
              "py-2",
              "text-sm"
            )}
          >
            Edit Profile
          </Link>

          <Link
            href="/profile/settings"
            className={clsx(
              "border-2",
              "border-muted",
              "rounded-xl",
              "px-4",
              "py-2",
              "text-sm"
            )}
          >
            Settings
          </Link>
        </div>
      </section>

      {/* Account Info */}
      <section className={clsx("space-y-4")}>
        <div className={clsx("flex", "gap-3", "items-center")}>
          <LuUser className={clsx('w-5', 'h-5')} />
          <span>Account Type: User</span>
        </div>

        <div className={clsx("flex", "gap-3", "items-center")}>
          <LuSettings className={clsx('w-5', 'h-5')} />
          <span>Status: Active</span>
        </div>
      </section>
    </div>
  );
}
