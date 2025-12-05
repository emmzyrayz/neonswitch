// app/docs/components/DocsSidebar.tsx
"use client";

import clsx from "clsx";

const links = [
  { id: "intro", label: "Introduction" },
  { id: "auth", label: "Authentication" },
  { id: "vtu", label: "VTU API" },
  { id: "virtual-number", label: "Virtual Number API" },
  { id: "errors", label: "Error Codes" },
];

export default function DocsSidebar() {
  return (
    <nav className={clsx('space-y-4', 'text-sm')}>
      {links.map((link) => (
        <a
          key={link.id}
          href={`#${link.id}`}
          className={clsx('block', 'px-3', 'py-2', 'rounded-md', 'text-gray-300', 'hover:text-cyan-300', 'hover:bg-white/5', 'transition', 'font-medium')}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
