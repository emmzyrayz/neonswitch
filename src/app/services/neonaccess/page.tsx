import clsx from "clsx";
import React from "react";
import {
  LuUsers,
  LuShieldCheck,
  LuScan,
  LuActivity,
  LuCircleCheck,
} from "react-icons/lu";

export default function NeonAccess() {
  const features = [
    {
      name: "Verified Accounts",
      description:
        "Access aged and verified social media accounts from trusted sellers.",
      icon: LuUsers,
    },
    {
      name: "Automated Validation",
      description:
        "Profiles are programmatically checked via public metadata and URLs.",
      icon: LuScan,
    },
    {
      name: "Live Monitoring",
      description:
        "Listings are automatically delisted if credentials or access changes.",
      icon: LuActivity,
    },
    {
      name: "Escrow Protection",
      description: "Funds are held securely until account access is confirmed.",
      icon: LuShieldCheck,
    },
  ];

  return (
    <div className={clsx("min-h-screen w-full mt-[25px] px-[20px] bg-white")}>
      {/* Hero */}
      <section className={clsx("border-b-2", "border-muted")}>
        <div className={clsx("max-w-7xl", "mx-auto", "py-20")}>
          <h1
            className={clsx(
              "text-3xl md:text-4xl lg:text-5xl",
              "font-bold",
              "text-muted",
              "mb-6"
            )}
          >
            NeonAccess Marketplace
          </h1>
          <p className={clsx("text-xl", "text-gray-600", "max-w-3xl")}>
            Buy and sell aged, verified, and region-compliant social media
            accounts through a secure, automated marketplace.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className={clsx("max-w-7xl", "mx-auto", "py-20", "text-muted")}>
        <h2 className={clsx("text-4xl", "font-bold", "mb-12")}>How It Works</h2>
        <div className={clsx("grid", "md:grid-cols-2", "gap-6")}>
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className={clsx(
                  "border-2",
                  "border-muted",
                  "rounded-2xl",
                  "p-8",
                  "hover:bg-muted",
                  "hover:text-white",
                  "transition-all",
                  "duration-500",
                  "group"
                )}
              >
                <Icon className={clsx("w-12", "h-12", "mb-4")} />
                <h3 className={clsx("text-2xl", "font-bold", "mb-2")}>
                  {item.name}
                </h3>
                <p
                  className={clsx("text-gray-600", "group-hover:text-gray-300")}
                >
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust Section */}
      <section className={clsx("bg-gray-50", "border-t-2", "border-muted")}>
        <div className={clsx("max-w-7xl", "mx-auto", "py-20", "text-muted")}>
          <h2 className={clsx("text-4xl", "font-bold", "mb-6")}>
            Built for Trust
          </h2>
          <ul className={clsx("space-y-4", "text-lg")}>
            {[
              "Public profile URL validation (no private data required)",
              "Automated integrity and availability checks",
              "Real-time monitoring during active listings",
              "No storage or handling of private login credentials",
            ].map((item) => (
              <li key={item} className={clsx("flex", "gap-3", "items-start")}>
                <LuCircleCheck className={clsx("w-6", "h-6", "mt-1")} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
