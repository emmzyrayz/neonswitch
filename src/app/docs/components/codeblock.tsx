// app/docs/components/CodeBlock.tsx
"use client";

import clsx from "clsx";
import { useState } from "react";

export default function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={clsx('relative', 'bg-black/40', 'border', 'border-white/10', 'rounded-lg', 'p-4', 'mt-4', 'overflow-auto')}>
      <button
        onClick={handleCopy}
        className={clsx('absolute', 'top-3', 'right-3', 'text-xs', 'bg-white/10', 'hover:bg-white/20', 'px-3', 'py-1', 'rounded')}
      >
        {copied ? "Copied" : "Copy"}
      </button>

      <pre className={clsx('text-sm', 'text-cyan-300', 'whitespace-pre-wrap')}>{code}</pre>
    </div>
  );
}
