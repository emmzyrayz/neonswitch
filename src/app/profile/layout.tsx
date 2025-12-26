"use client";

import clsx from "clsx";
import React from "react";
import { useRouter } from "next/navigation";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className={clsx("min-h-screen", "w-screen", "bg-primary")}>
      {/* Top Bar */}
      <header className={clsx("border-b-2", "border-muted", "sticky", "top-0", "bg-primary", "z-10")}>
        <div
          className={clsx(
            "max-w-5xl",
            "mx-auto",
            "px-4",
            "sm:px-5",
            "py-3",
            "sm:py-4",
            "flex",
            "items-center",
            "gap-3",
            "sm:gap-4"
          )}
        >
          <button
            onClick={() => router.back()}
            className={clsx(
              "text-sm",
              "text-gray-500",
              "hover:text-gray-700",
              "transition-colors",
              "touch-manipulation"
            )}
          >
            ← Back
          </button>
          <h1 className={clsx("text-base", "sm:text-lg", "font-semibold", "text-muted")}>
            Profile
          </h1>
        </div>
      </header>

      <main className={clsx("max-w-5xl justify-center items-center  ", "mx-auto", "px-4", "sm:px-5", "py-6", "sm:py-8", "pb-20", "sm:pb-8")}>
        {children}
      </main>
    </div>
  );
}