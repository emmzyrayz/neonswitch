"use client";

import clsx from "clsx";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const tabs = [
  { label: "Dashboard Overview", href: "/admin" },
  { label: "Users", href: "/admin#users" },
  { label: "VTU Logs", href: "/admin#vtu" },
  { label: "Virtual Numbers", href: "/admin#numbers" },
  { label: "API Usage", href: "/admin#api" },
  { label: "System Settings", href: "/admin#settings" },
];

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className={clsx(
          "fixed",
          "top-4",
          "left-4",
          "z-50",
          "md:hidden",
          "p-3",
          "bg-muted/20",
          "hover:bg-muted/30",
          "border",
          "border-muted/30",
          "rounded-lg",
          "text-muted",
          "transition"
        )}
        aria-label="Toggle menu"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className={clsx(
            "fixed",
            "inset-0",
            "bg-black/60",
            "z-40",
            "md:hidden"
          )}
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "w-64",
          "bg-black/40",
          "backdrop-blur-sm",
          "border-r",
          "border-white/10",
          "h-screen",
          "p-6",
          "flex",
          "flex-col",
          "transition-transform",
          "duration-300",
          "z-40",
          // Mobile: Fixed positioned, slide from left, no space taken
          "fixed",
          "md:sticky",
          "md:top-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >
        <h1
          className={clsx(
            "text-2xl",
            "font-bold",
            "text-muted",
            "mb-10",
            "drop-shadow-[0_0_10px_#F9FAFB]"
          )}
        >
          NeonSwitch Admin
        </h1>

        <nav className={clsx("space-y-3", "text-sm", "font-medium")}>
          {tabs.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={closeSidebar}
              className={clsx(
                "block",
                "px-4",
                "py-2",
                "rounded-md",
                "bg-white/5",
                "hover:bg-cyan-400/10",
                "hover:text-muted",
                "transition"
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}
