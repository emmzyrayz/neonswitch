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
  const [isClosing, setIsClosing] = useState(false);
  const pathname = usePathname();

  const isActive = ( path: string ) => {
    if (path === ''){
      return pathname === '/' || pathname === '';
    }

    return pathname?.startsWith(`/${path}/`);
  }

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
    }, 700); // Match your animation duration
  }

  const handleToggle = () => {
    if (open) {
      handleClose();
    } else {
      setOpen(true);
    }
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
        "transition-all",
        "overflow-hidden"
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
                  "hover:bg-black",
                  "rounded-lg",
                  "flex",
                  "w-full",
                  "min-w-[90px]",
                  "p-2",
                  "items-center",
                  "justify-center",
                  "duration-700",
                  "ease-in-out",
                  "transition-all",
                     {
                      "text-muted/60": active,
                      "hover:text-muted": active,
                      "font-semibold": active,
                      "bg-black/80": active,
                      "shadow-[inset_0_0_0_1px_#E5E7EB/20]": active,
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
          href="/auth/signin"
          className={clsx(
             "hidden",
            "md:block",
            "px-3",
            "md:px-6",
            "py-2",
            "bg-primary/40",
            "text-soft",
            "lg:text-[18px]",
            "md:text-[14px]",
            "sm:text-[12px]",
            "font-semibold",
            "rounded-lg",
            "shadow-[0_0_5px_#E5E7EB]",
            "hover:bg-primary/30",
            "transition-all",
            "ease-in-out",
            "duration-500"
          )}
        >
          Start Demo
        </Link>

        {/* Hamburger */}
        <button
          className={clsx(
            "md:hidden",
            "text-soft",
            "text-2xl",
            "transition-transform",
            "duration-300",
            {
              "rotate-90": open || isClosing, // Rotate icon when open
            }
          )}
          onClick={handleToggle}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open || isClosing ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {(open || isClosing) && (
        <div
          className={clsx(
          "md:hidden",
          "px-6",
          "pb-4",
          "flex",
          "flex-col",
          "gap-1",
          "transition-all",
          "duration-500",
          "ease-in-out",
          "origin-top",
          // {
          //   "max-h-0 opacity-0 -translate-y-4 scale-y-0": !open,
          //   "max-h-[500px] opacity-100 translate-y-0 scale-y-100": open,
          // }
        )}
        >
          {NavLinks.map((item, index) => {
            const active = isActive(item.path)
            return(
              <Link
                key={item.name}
                href={`/${item.path}`}
                className={clsx(
                "text-soft/50",
                "hover:text-soft",
                "transition-all",
                "font-medium",
                "cursor-pointer",
                "hover:bg-black",
                "rounded-lg",
                "hover:pl-4",
                "flex",
                "w-full",
                "p-2",
                "items-center",
                "justify-start",
                "duration-500",
                "ease-in-out",
                {
                  "text-soft": active,
                  "bg-primary/60": active,
                  "pl-4": active,
                  "font-semibold": active,
                  "border-primary": active,
                },
                isClosing ? "animate-slideOut" : "animate-slideIn"
              )}
              style={{
                  animationDelay: isClosing 
                    ? `${index * 30}ms` 
                    : `${index * 50}ms`,
                }}
                onClick={handleClose}
              >
                {item.name}
              </Link>
            )
          })}
          <Link
            href="/auth/signin"
            className={clsx(
            "px-6",
            "py-2",
            "bg-primary/40",
            "hover:text-soft/40",
            "text-soft",
            "rounded-lg",
            "shadow-[0_0_5px_#E5E7EB]",
            "text-center",
            "font-semibold",
            "transition-all",
            "duration-300",
            isClosing ? "animate-slideOut" : "animate-slideIn"
          )}
          style={{
              animationDelay: isClosing 
                ? `${NavLinks.length * 30}ms` 
                : `${NavLinks.length * 50}ms`,
            }}
            onClick={handleClose}
          >
            Start Demo
          </Link>
        </div>
      )}
    </nav>
  );
}
