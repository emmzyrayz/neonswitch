// app/components/PricingCard.tsx
"use client";

import clsx from "clsx";
import React from "react";

type Props = {
  title: string;
  price: number;
  currency?: string;
  period: "mo" | "yr";
  features: string[];
  highlighted?: boolean;
  ctaText?: string;
};

export default function PricingCard({
  title,
  price,
  currency = "₦",
  period,
  features,
  highlighted = false,
  ctaText = "Get Started",
}: Props) {
  const borderClass = highlighted ? "border-cyan-400" : "border-white/10";
  const shadowClass = highlighted
    ? "shadow-[0_0_40px_rgba(34,211,238,0.18)]"
    : "shadow-[0_0_20px_rgba(255,255,255,0.03)]";

  return (
    <div
      className={`p-6 rounded-2xl bg-white/3 backdrop-blur-md border ${borderClass} ${shadowClass} flex flex-col justify-between`}
    >
      <div>
        <div className={clsx('flex', 'items-center', 'justify-between')}>
          <h3 className={clsx('text-xl', 'font-semibold', 'text-white')}>{title}</h3>
          {highlighted && (
            <span className={clsx('text-xs', 'px-2', 'py-1', 'rounded-full', 'bg-cyan-400/10', 'text-cyan-300')}>
              Popular
            </span>
          )}
        </div>

        <div className="mt-6">
          <div className={clsx('flex', 'items-baseline', 'gap-3')}>
            <span className={clsx('text-3xl', 'font-bold', 'text-white', 'drop-shadow-[0_0_10px_rgba(34,211,238,0.25)]')}>
              {currency}
              {price}
            </span>
            <span className={clsx('text-sm', 'text-gray-300')}>
              / {period === "mo" ? "month" : "year"}
            </span>
          </div>
          <p className={clsx('mt-3', 'text-sm', 'text-gray-300')}>
            Billed {period === "mo" ? "monthly" : "annually"}.
          </p>
        </div>

        <ul className={clsx('mt-6', 'space-y-3', 'text-sm', 'text-gray-300')}>
          {features.map((f, i) => (
            <li key={i} className={clsx('flex', 'items-start', 'gap-3')}>
              <span className={clsx('min-w-[22px]', 'h-[22px]', 'rounded-full', 'bg-fuchsia-400/20', 'text-fuchsia-300', 'flex', 'items-center', 'justify-center', 'text-xs')}>
                ✓
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <button
          className={`w-full py-3 px-4 font-semibold rounded-lg transition ${
            highlighted
              ? "bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.45)]"
              : "bg-white/5 text-white hover:bg-white/8"
          }`}
        >
          {ctaText}
        </button>
      </div>
    </div>
  );
}
