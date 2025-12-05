'use client'
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";

const Sidebar = () => {
  const [active, setActive] = useState("dashboard");

  const menuItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Virtual Number", href: "/dashboard/virtual-number" },
    { name: "VTU", href: "/dashboard/vtu" },
    { name: "Pricing", href: "/dashboard/pricing" },
    { name: "API Docs", href: "/dashboard/api-docs" },
    { name: "Admin", href: "/dashboard/admin" },
  ];

  return (
    <aside className={clsx('w-64', 'bg-[#0f0f0f]', 'text-white', 'h-screen', 'flex', 'flex-col', 'p-6', 'shadow-neonGreen')}>
      <h1 className={clsx('text-2xl', 'font-bold', 'mb-10', 'text-neonPink')}>NeonSwitch</h1>
      <nav className={clsx('flex', 'flex-col', 'gap-4')}>
        {menuItems.map((item) => (
          <Link key={item.name} href={item.href}>
            <div
              onClick={() => setActive(item.name)}
              className={`px-4 py-2 rounded-md font-mono hover:bg-[#111111] transition-all duration-200 ${
                active === item.name
                  ? "bg-[#111111] border-l-4 border-neonGreen"
                  : ""
              }`}
            >
              {item.name}
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
