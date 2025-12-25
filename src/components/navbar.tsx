"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
    path: "docs",
  },
  {
    name: "Contact",
    path: "contact",
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = ( path: string ) => {
    if (path === ''){
      return pathname === '/' || pathname === '';
    }

    return pathname?.startsWith(`/${path}/`);
  }

  return (
    <nav
      className={clsx(
        "w-[95%]",
        "bg-muted/20",
        "rounded-[12px]",
        "mt-3",
        "lg:mt-2",
        "backdrop-blur-md",
        "border-b",
        "border-primary/10",
        "fixed",
        "top-0",
        "z-50",
        "duration-700",
        "ease-in-out",
        "transition-all"
      )}
    >
      <div
        className={clsx(
          "max-w-6xl",
          "mx-auto",
          "flex",
          "items-center",
          "justify-between",
          "px-4",
          "py-2"
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
            "drop-shadow-[0_0_10px_#E5E7EB]",
          )}
        >
          NeonSwitch
        </Link>

        {/* Desktop Links */}
        <div className={clsx("hidden", "md:flex", "gap-5")}>
          {NavLinks.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                href={`/${item.path}`}
                className={clsx(
                  "text-soft/50",
                  "hover:text-soft",
                  "transition",
                  "font-medium",
                  "cursor-pointer",
                  'hover:bg-black rounded-lg',
                  'flex w-full min-w-[100px] p-2 items-center justify-center duration-700 ease-in-out transition-all',
                     {
                      "text-muted/60": active, // Active page color
                      "hover:text-muted": active,
                      "font-semibold": active, // Make active link bolder
                      "bg-black/80": active, // Subtle background for active
                      "shadow-[inset_0_0_0_1px_#E5E7EB/20]": active, // Optional: subtle border
                    }
                )}
              >
                {item.name}
              </Link>
            )
          })}
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
            "text-soft lg:text-[18px] md:text-[14px]",
            "font-semibold",
            "rounded-lg",
            "shadow-[0_0_15px_#E5E7EB]",
            "hover:bg-primary/30",
            "transition-all ease-in-out duration-500"
          )}
        >
          Start Demo
        </Link>

        {/* Hamburger */}
        <button
          className={clsx("md:hidden", "text-soft", "text-2xl")}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? "✕" : "☰"}
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
            "gap-1"
          )}
        >
          {NavLinks.map((item) => {
            const active = isActive(item.path)
            return(
              <Link
                key={item.name}
                href={`/${item.path}`}
                className={clsx(
                  "text-soft/50",
                  "hover:text-soft",
                  "transition",
                  "font-medium",
                  "cursor-pointer",
                  'hover:bg-black rounded-lg hover:pl-4',
                  'flex w-full p-2 items-center justify-start duration-700 ease-in-out transition-all',
                  {
                    "text-soft": active,
                    "bg-primary/60": active,
                    "pl-4": active,
                    "font-semibold": active,
                    "border-primary": active,
                  }
                )}
                onClick={() => setOpen(false)}
              >
                {item.name}
              </Link>
            )
          })}
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
            onClick={() => setOpen(false)}
          >
            Start Demo
          </Link>
        </div>
      )}
    </nav>
  );
}
