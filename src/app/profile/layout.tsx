import clsx from "clsx";
import React from "react";
import Link from "next/link";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={clsx("min-h-screen w-screen", "bg-primary", "pt-[50px]")}>
      {/* Top Bar */}
      <header className={clsx("border-b-2", "border-muted")}>
        <div
          className={clsx(
            "max-w-5xl",
            "mx-auto",
            "px-5",
            "py-4",
            "flex",
            "items-center",
            "gap-4"
          )}
        >
          <Link
            href="/dashboard"
            className={clsx("text-sm", "text-gray-500")}
          >
            ← Back
          </Link>
          <h1 className={clsx("text-lg", "font-semibold", "text-muted")}>
            Profile
          </h1>
        </div>
      </header>

      <main className={clsx("max-w-5xl", "mx-auto", "px-5", "py-8")}>
        {children}
      </main>
    </div>
  );
}
