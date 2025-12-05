"use client";

import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className={clsx(
        "w-full",
        "bg-[#0A0A0C]/80",
        "backdrop-blur-md",
        "border-b",
        "border-white/10",
        "fixed",
        "top-0",
        "z-50"
      )}
    >
      <div
        className={clsx(
          "max-w-6xl",
          "mx-auto",
          "flex",
          "items-center",
          "justify-between",
          "px-6",
          "py-4"
        )}
      >
        {/* LOGO */}
        <h1
          className={clsx(
            "text-2xl",
            "font-bold",
            "text-cyan-400",
            "drop-shadow-[0_0_10px_rgba(34,211,238,0.45)]"
          )}
        >
          NeonSwitch
        </h1>

        {/* Desktop Links */}
        <div className={clsx("hidden", "md:flex", "gap-8")}>
          {["Home", "Services", "Pricing", "API Docs", "Contact"].map(
            (item) => (
              <a
                key={item}
                className={clsx(
                  "text-gray-300",
                  "hover:text-cyan-400",
                  "transition",
                  "font-medium"
                )}
              >
                {item}
              </a>
            )
          )}
        </div>

        {/* CTA */}
        <button
          className={clsx(
            "hidden",
            "md:block",
            "px-6",
            "py-2",
            "bg-cyan-400",
            "text-black",
            "font-semibold",
            "rounded-lg",
            "shadow-[0_0_15px_rgba(34,211,238,0.6)]",
            "hover:bg-cyan-300",
            "transition"
          )}
        >
          Start Demo
        </button>

        {/* Hamburger */}
        <button
          className={clsx("md:hidden", "text-white", "text-2xl")}
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          className={clsx(
            "md:hidden",
            "px-6",
            "pb-4",
            "flex",
            "flex-col",
            "gap-4",
            "text-gray-300"
          )}
        >
          <Link href="/">Home </Link>
          <Link href="/">Services </Link>
          <Link href="/pricing">Pricing </Link>
          <Link href="/">API Docs </Link>
          <Link href="/">Contact </Link>
          <button
            className={clsx(
              "px-6",
              "py-2",
              "bg-cyan-400",
              "text-black",
              "rounded-lg",
              "shadow-[0_0_15px_rgba(34,211,238,0.5)]"
            )}
          >
            Start Demo
          </button>
        </div>
      )}
    </nav>
  );
}
