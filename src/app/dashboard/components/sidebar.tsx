"use client";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Sidebar = () => {
  const [active, setActive] = useState("dashboard");
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Virtual Number", href: "/dashboard/virtual-number" },
    { name: "VTU", href: "/dashboard/vtu" },
    { name: "Pricing", href: "/dashboard/pricing" },
    { name: "API Docs", href: "/dashboard/api-docs" },
    { name: "Admin", href: "/dashboard/admin" },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className={clsx(
          "fixed",
          "top-14",
          "left-4",
          "z-50",
          "lg:hidden",
          "p-3",
          "bg-secondary/30",
          "hover:bg-secondary/80",
          "border",
          "border-muted/30",
          "rounded-lg",
          "text-muted",
          "transition",
          "shadow-lg"
        )}
        aria-label="Toggle menu"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Overlay for mobile/tablet */}
      {isOpen && (
        <div
          className={clsx(
            "fixed",
            "inset-0",
            "bg-black/70",
            "z-40",
            "lg:hidden"
          )}
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "w-64",
          "bg-[#0f0f0f]",
          "text-white",
          "h-screen",
          "flex",
          "flex-col",
          "p-6",
          "shadow-muted",
          "transition-transform",
          "duration-300",
          "z-40",
          // Mobile/Tablet: Fixed positioned
          "fixed",
          "lg:sticky",
          "lg:top-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        <h1
          className={clsx(
            "text-2xl",
            "font-bold",
            "mb-10",
            "text-soft",
            "drop-shadow-[0_0_10px_#6B7280]"
          )}
        >
          NeonSwitch
        </h1>
        <nav className={clsx("flex", "flex-col", "gap-4")}>
          {menuItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <div
                onClick={() => {
                  setActive(item.name);
                  closeSidebar();
                }}
                className={clsx(
                  "px-4",
                  "py-2",
                  "rounded-md",
                  "font-mono",
                  "hover:bg-soft/30",
                  "transition-all",
                  "duration-200",
                  "cursor-pointer",
                  "transition-all",
                  "duration-500",
                  "ease-in-out",
                  active === item.name && "bg-secondary border-l-4 border-muted"
                )}
              >
                {item.name}
              </div>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
