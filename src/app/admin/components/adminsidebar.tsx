// app/admin/components/AdminSidebar.tsx
"use client";

import clsx from "clsx";

const tabs = [
  { label: "Dashboard Overview", href: "/admin" },
  { label: "Users", href: "/admin#users" },
  { label: "VTU Logs", href: "/admin#vtu" },
  { label: "Virtual Numbers", href: "/admin#numbers" },
  { label: "API Usage", href: "/admin#api" },
  { label: "System Settings", href: "/admin#settings" },
];

export default function AdminSidebar() {
  return (
    <aside className={clsx('w-64', 'bg-black/20', 'border-r', 'border-white/10', 'h-screen', 'sticky', 'top-0', 'p-6', 'hidden', 'md:flex', 'flex-col')}>
      <h1 className={clsx('text-2xl', 'font-bold', 'text-cyan-400', 'mb-10', 'drop-shadow-[0_0_10px_rgb(34,211,238,0.5)]')}>
        NeonSwitch Admin
      </h1>

      <nav className={clsx('space-y-3', 'text-sm', 'font-medium')}>
        {tabs.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={clsx('block', 'px-4', 'py-2', 'rounded-md', 'bg-white/5', 'hover:bg-cyan-400/10', 'hover:text-cyan-300', 'transition')}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
