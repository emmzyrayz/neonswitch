"use client";

import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";

interface NavLinkProps {
  name: string;
  path: string;
}

const NavLinks: NavLinkProps[] = [
  {
    name: "Home",
    path: "",
  },
  {
    name: "Services",
    path: "services",
  },
  {
    name: "Pricing",
    path: "pricing",
  },
  {
    name: "Api Docs",
    path: "api",
  },
  {
    name: "Contact",
    path: "contact",
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className={clsx(
        "w-[95%]",
        "bg-muted/20",
        "rounded-[12px]",
        "mt-3",
        "lg:mt-0",
        "backdrop-blur-md",
        "border-b",
        "border-primary/10",
        "fixed",
        "top-0",
        "z-50",
        "duration-700",
        "ease-in-out",
        "transition-height"
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
        <Link
          href="/"
          className={clsx(
            "text-2xl",
            "font-bold",
            "text-white",
            "font-sora",
            "drop-shadow-[0_0_10px_#E5E7EB]"
          )}
        >
          NeonSwitch
        </Link>

        {/* Desktop Links */}
        <div className={clsx("hidden", "md:flex", "gap-8")}>
          {NavLinks.map((item) => (
            <Link
              key={item.name}
              href={`/${item.path}`}
              className={clsx(
                "text-primary/30",
                "hover:text-primary/40",
                "transition",
                "font-medium",
                "cursor-pointer"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/signin"
          className={clsx(
            "hidden",
            "md:block",
            "px-6",
            "py-2",
            "bg-primary/40",
            "text-black",
            "font-semibold",
            "rounded-lg",
            "shadow-[0_0_15px_#E5E7EB]",
            "hover:bg-primary/30",
            "transition"
          )}
        >
          Start Demo
        </Link>

        {/* Hamburger */}
        <button
          className={clsx("md:hidden", "text-muted", "text-2xl")}
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
            "gap-4"
          )}
        >
          {NavLinks.map((item) => (
            <Link
              key={item.name}
              href={`/${item.path}`}
              className={clsx(
                "text-muted",
                "hover:text-soft/40",
                "transition",
                "font-medium",
                "cursor-pointer"
              )}
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/signin"
            className={clsx(
              "px-6",
              "py-2",
              "bg-primary/40",
              "hover:text-soft/40",
              "text-soft",
              "rounded-lg",
              "shadow-[0_0_15px_#E5E7EB]",
              "text-center",
              "font-semibold"
            )}
          >
            Start Demo
          </Link>
        </div>
      )}
    </nav>
  );
}
