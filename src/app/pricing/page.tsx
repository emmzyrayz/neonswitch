// app/pricing/page.tsx
"use client";

import React, { useState } from "react";
import PricingCard from "@/components/pricingcard";
import clsx from "clsx";

export default function PricingPage() {
  const [billing, setBilling] = useState<"mo" | "yr">("mo");

  const tiers = [
    {
      title: "Starter",
      priceMo: 500,
      priceYr: 5000,
      features: [
        "10 VTU transactions / mo",
        "1 Virtual Number",
        "Email support",
      ],
    },
    {
      title: "Pro",
      priceMo: 2500,
      priceYr: 25000,
      features: [
        "100 VTU transactions / mo",
        "5 Virtual Numbers",
        "Priority email support",
        "API access (limited)",
      ],
      highlighted: true,
    },
    {
      title: "Business",
      priceMo: 7500,
      priceYr: 75000,
      features: [
        "500 VTU transactions / mo",
        "20 Virtual Numbers",
        "Dedicated API key",
        "Live chat support",
      ],
    },
    {
      title: "Reseller",
      priceMo: 20000,
      priceYr: 200000,
      features: [
        "Unlimited VTU",
        "Unlimited Virtual Numbers",
        "Reseller dashboard",
        "SLA & premium support",
      ],
    },
  ];

  return (
    <main className={clsx('min-h-screen', 'bg-[#050507]', 'text-white', 'pt-28', 'pb-24')}>
      <div className={clsx('max-w-6xl', 'mx-auto', 'px-6')}>
        {/* Header */}
        <header className={clsx('text-center', 'mb-12')}>
          <h1 className={clsx('text-4xl', 'md:text-5xl', 'font-bold', 'mb-4', 'drop-shadow-[0_0_20px_rgba(168,85,247,0.08)]')}>
            Simple pricing. No surprises.
          </h1>
          <p className={clsx('text-gray-300', 'max-w-2xl', 'mx-auto')}>
            Choose a plan that fits your workflow — from testing integrations to
            scaling production. Switch billing cycle to see savings.
          </p>

          {/* Billing toggle */}
          <div className={clsx('mt-6', 'inline-flex', 'items-center', 'bg-white/4', 'rounded-full', 'p-1')}>
            <button
              onClick={() => setBilling("mo")}
              className={`px-4 py-2 rounded-full transition text-sm font-medium ${
                billing === "mo"
                  ? "bg-white/6 text-white shadow-[0_0_12px_rgba(255,255,255,0.04)]"
                  : "text-gray-300"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yr")}
              className={`px-4 py-2 rounded-full transition text-sm font-medium ${
                billing === "yr"
                  ? "bg-white/6 text-white shadow-[0_0_12px_rgba(255,255,255,0.04)]"
                  : "text-gray-300"
              }`}
            >
              Yearly
            </button>
            <div className={clsx('ml-4', 'text-xs', 'text-gray-400', 'p-2')}>
              <span className="font-semibold">Save 2 months</span> with yearly
              billing
            </div>
          </div>
        </header>

        {/* Cards */}
        <section className={clsx('grid', 'gap-6', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4')}>
          {tiers.map((t) => (
            <PricingCard
              key={t.title}
              title={t.title}
              price={billing === "mo" ? t.priceMo : t.priceYr}
              period={billing}
              features={t.features}
              highlighted={t.highlighted}
              ctaText={t.highlighted ? "Start Pro" : "Choose"}
            />
          ))}
        </section>

        {/* CTA block */}
        <section className={clsx('mt-12', 'rounded-2xl', 'bg-linear-to-r', 'from-white/2', 'to-white/3', 'border', 'border-white/6', 'p-6', 'flex', 'flex-col', 'md:flex-row', 'items-center', 'justify-between', 'gap-4')}>
          <div>
            <h3 className={clsx('text-xl', 'font-bold')}>Need a custom plan?</h3>
            <p className="text-gray-300">
              Enterprise & reseller needs covered — SLAs, higher rate limits,
              and dedicated integration support.
            </p>
          </div>
          <div className={clsx('flex', 'gap-3')}>
            <button className={clsx('px-5', 'py-3', 'bg-cyan-400', 'text-black', 'font-semibold', 'rounded-lg', 'shadow-[0_0_20px_rgba(34,211,238,0.35)]')}>
              Contact Sales
            </button>
            <button className={clsx('px-5', 'py-3', 'border', 'border-white/10', 'rounded-lg', 'text-white')}>
              Download Pricing PDF
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
