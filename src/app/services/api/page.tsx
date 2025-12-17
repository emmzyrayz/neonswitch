"use client";
import clsx from "clsx";
import React from "react";
import {
  LuCode,
  LuZap,
  LuShield,
  LuBookOpen,
  LuTerminal,
  LuCircleCheck,
  LuCopy,
} from "react-icons/lu";

export default function APIServicePage() {
  const [copiedEndpoint, setCopiedEndpoint] = React.useState<number | null>(
    null
  );

 const features = [
  {
    icon: LuZap,
    title: "Low-Latency Infrastructure",
    description:
      "Optimized API architecture with sub-200ms average response times and high availability.",
  },
  {
    icon: LuShield,
    title: "Secure by Default",
    description:
      "API key authentication with scoped permissions, OAuth 2.0 support, and request signing.",
  },
  {
    icon: LuBookOpen,
    title: "Production-Ready Documentation",
    description:
      "Clear documentation with real-world examples, error references, and versioned endpoints.",
  },
  {
    icon: LuTerminal,
    title: "Developer-First Design",
    description:
      "RESTful endpoints, predictable JSON responses, webhooks, and idempotent requests.",
  },
];


  const endpoints = [
    {
      method: "POST",
      path: "/api/v1/vtu/airtime",
      description: "Purchase airtime via VTU service",
    },
    {
      method: "POST",
      path: "/api/v1/vtu/data",
      description: "Purchase data bundles via VTU service",
    },
    {
      method: "GET",
      path: "/api/v1/neonpay/wallet/balance",
      description: "Retrieve NeonPay wallet balance",
    },
    {
      method: "POST",
      path: "/api/v1/neonpay/transfer",
      description: "Transfer funds between NeonPay wallets",
    },
    {
      method: "POST",
      path: "/api/v1/virtual-numbers",
      description: "Generate a virtual phone number",
    },
    {
      method: "POST",
      path: "/api/v1/neonaccess/orders",
      description: "Create an order on NeonAccess marketplace",
    },
  ];
  

  const codeExample = `const axios = require('axios');

const response = await axios.post(
  'https://api.yourplatform.com/v1/vtu/airtime',
  {
    network: 'MTN',
    phone: '08012345678',
    amount: 1000
  },
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    }
  }
);

console.log(response.data);`;

  const pricingTiers = [
    {
      name: "Starter",
      price: "Free",
      requests: "1,000",
      features: [
        "1,000 requests/month",
        "Basic endpoints access",
        "Community support",
        "Rate limit: 10 req/min",
      ],
    },
    {
      name: "Professional",
      price: "₦25,000",
      requests: "50,000",
      features: [
        "50,000 requests/month",
        "All endpoints access",
        "Priority email support",
        "Rate limit: 60 req/min",
        "Webhook support",
        "Custom rate limits",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      requests: "Unlimited",
      features: [
        "Unlimited requests",
        "Dedicated support",
        "Custom SLA",
        "No rate limits",
        "Advanced webhooks",
        "White-label options",
      ],
    },
  ];

  const copyToClipboard = (text: string, endpoint: number) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <div
      className={clsx(
        "min-h-screen mt-[20px]",
        "bg-white",
        "flex flex-col items-center justify-center px-[20px]"
      )}
    >
      {/* Hero */}
      <div className={clsx("border-b-2", "border-muted")}>
        <div
          className={clsx(
            "max-w-7xl",
            "mx-auto",
            "px-4",
            "sm:px-6",
            "lg:px-8",
            "py-16",
            "sm:py-24"
          )}
        >
          <div className="max-w-4xl">
            <div
              className={clsx(
                "inline-block",
                "border-2",
                "border-muted rounded-xl",
                "px-4",
                "py-1",
                "mb-6"
              )}
            >
              <span
                className={clsx(
                  "text-sm text-muted",
                  "font-bold",
                  "uppercase",
                  "tracking-wide"
                )}
              >
                For Developers
              </span>
            </div>

            <div
              className={clsx("flex flex-row", "items-center", "gap-6", "mb-6")}
            >
              <div
                className={clsx(
                  "p-4",
                  "border-2",
                  "border-muted rounded-2xl",
                  "bg-muted",
                  "text-white"
                )}
              >
                <LuCode
                  className={clsx("w-10", "h-10", "sm:w-12", "sm:h-12")}
                />
              </div>
              <div className="flex-1">
                <h1
                  className={clsx(
                    "text-4xl",
                    "sm:text-5xl",
                    "md:text-6xl",
                    "font-bold",
                    "tracking-tight",
                    "text-muted"
                  )}
                >
                  Public API
                </h1>
              </div>
            </div>

            <p
              className={clsx(
                "text-lg",
                "sm:text-xl",
                "text-gray-600",
                "leading-relaxed",
                "mb-8"
              )}
            >
              Build powerful integrations with our unified REST API.
              Programmatically access VTU services, NeonPay wallet operations,
              NeonAccess marketplaces, and platform utilities through secure,
              well-documented endpoints.
            </p>

            <div className={clsx("flex", "flex-col", "sm:flex-row", "gap-4")}>
              <button
                className={clsx(
                  "bg-muted",
                  "text-white",
                  "px-8",
                  "py-4",
                  "text-lg",
                  "font-semibold",
                  "hover:bg-border hover:text-muted",
                  "transition-colors",
                  "border-2",
                  "border-muted rounded-xl"
                )}
              >
                Generate API Key
              </button>
              <button
                className={clsx(
                  "bg-white",
                  "text-muted",
                  "px-8",
                  "py-4",
                  "text-lg",
                  "font-semibold",
                  "hover:bg-muted/20",
                  "transition-colors",
                  "border-2",
                  "border-muted rounded-2xl"
                )}
              >
                Explore API Docs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div
        className={clsx(
          "max-w-7xl",
          "mx-auto",
          "px-4",
          "sm:px-6",
          "lg:px-8",
          "py-16",
          "sm:py-20",
          "text-muted"
        )}
      >
        <h2 className={clsx("text-3xl", "sm:text-4xl", "font-bold", "mb-12")}>
          API Features
        </h2>
        <div className={clsx("grid", "grid-cols-1", "md:grid-cols-2", "gap-6")}>
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={clsx(
                  "border-2",
                  "border-muted rounded-2xl",
                  "p-8",
                  "hover:bg-muted",
                  "hover:text-white",
                  "transition-colors",
                  "duration-700",
                  "group"
                )}
              >
                <Icon className={clsx("w-12", "h-12", "mb-4")} />
                <h3 className={clsx("text-2xl", "font-bold", "mb-3")}>
                  {feature.title}
                </h3>
                <p
                  className={clsx("text-gray-600", "group-hover:text-gray-300")}
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Code Example */}
      <div
        className={clsx("border-t-2", "border-muted text-muted", "bg-gray-50")}
      >
        <div
          className={clsx(
            "max-w-7xl",
            "mx-auto",
            "px-4",
            "sm:px-6",
            "lg:px-8",
            "py-16",
            "sm:py-20"
          )}
        >
          <h2 className={clsx("text-3xl", "sm:text-4xl", "font-bold", "mb-4")}>
            Quick Start Example
          </h2>
          <p className={clsx("text-lg", "text-muted/70", "mb-8")}>
            Get started in minutes with our simple API. Here&apos;s how to make
            your first request:
          </p>
          <div
            className={clsx(
              "border-2",
              "border-muted rounded-2xl",
              "bg-muted",
              "text-white",
              "p-6",
              "font-mono",
              "text-sm",
              "overflow-x-auto"
            )}
          >
            <pre className="whitespace-pre">{codeExample}</pre>
          </div>
        </div>
      </div>

      {/* Endpoints */}
      <div
        className={clsx(
          "max-w-7xl",
          "mx-auto",
          "px-4",
          "sm:px-6",
          "lg:px-8",
          "py-16",
          "sm:py-20",
          "text-muted"
        )}
      >
        <h2 className={clsx("text-3xl", "sm:text-4xl", "font-bold", "mb-4")}>
          Popular Endpoints
        </h2>
        <p className={clsx("text-lg", "text-muted/70", "mb-8")}>
          Access all platform services through our RESTful API endpoints
        </p>
        <div className="space-y-4">
          {endpoints.map((endpoint, idx) => (
            <div
              key={idx}
              className={clsx(
                "border-2",
                "border-muted rounded-2xl",
                "p-6",
                "hover:bg-muted/10",
                "transition-colors",
                "group"
              )}
            >
              <div
                className={clsx(
                  "flex",
                  "flex-col",
                  "sm:flex-row",
                  "sm:items-center",
                  "justify-between",
                  "gap-4"
                )}
              >
                <div className="flex-1">
                  <div
                    className={clsx("flex", "items-center", "gap-3", "mb-2")}
                  >
                    <span
                      className={clsx(
                        "inline-block",
                        "px-3",
                        "py-1",
                        "bg-muted rounded-[6px]",
                        "text-white",
                        "text-xs",
                        "font-bold"
                      )}
                    >
                      {endpoint.method}
                    </span>
                    <code className={clsx("text-sm", "font-mono")}>
                      {endpoint.path}
                    </code>
                  </div>
                  <p className="text-muted/70">{endpoint.description}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(endpoint.path, idx)}
                  className={clsx(
                    "flex",
                    "items-center",
                    "gap-2",
                    "px-4",
                    "py-2",
                    "border-2",
                    "border-muted rounded-xl",
                    "hover:bg-muted",
                    "hover:text-white",
                    "transition-colors",
                    "text-sm",
                    "font-semibold"
                  )}
                >
                  {copiedEndpoint === idx ? (
                    <>
                      <LuCircleCheck className={clsx("w-4", "h-4")} />
                      Copied
                    </>
                  ) : (
                    <>
                      <LuCopy className={clsx("w-4", "h-4")} />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className={clsx("mt-8", "text-center")}>
          <button
            className={clsx(
              "border-2",
              "border-muted rounded-xl",
              "px-8",
              "py-3",
              "font-semibold",
              "hover:bg-muted",
              "hover:text-white",
              "transition-colors"
            )}
          >
            View All Endpoints →
          </button>
        </div>
      </div>

      {/* Pricing */}
      <div className={clsx("border-t-2", "border-muted", "bg-gray-50")}>
        <div
          className={clsx(
            "max-w-7xl",
            "mx-auto",
            "px-4",
            "sm:px-6",
            "lg:px-8",
            "py-16",
            "sm:py-20",
            "text-muted"
          )}
        >
          <h2
            className={clsx(
              "text-3xl",
              "sm:text-4xl",
              "font-bold",
              "mb-4",
              "text-center"
            )}
          >
            API Pricing
          </h2>
          <p
            className={clsx(
              "text-lg",
              "text-muted/70",
              "mb-12",
              "text-center",
              "max-w-2xl",
              "mx-auto"
            )}
          >
            Choose the plan that fits your needs. Start free and scale as you
            grow.
          </p>

          <div
            className={clsx("grid", "grid-cols-1", "md:grid-cols-3", "gap-6")}
          >
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`border-2 border-muted rounded-2xl p-8 ${
                  tier.highlighted
                    ? "bg-muted text-white"
                    : "bg-white hover:bg-muted hover:text-white"
                } transition-colors duration-500 group cursor-pointer`}
              >
                <h3 className={clsx("text-2xl", "font-bold", "mb-2")}>
                  {tier.name}
                </h3>
                <div className="mb-6">
                  <div className={clsx("text-4xl", "font-bold", "mb-1")}>
                    {tier.price}
                  </div>
                  <div
                    className={`text-sm ${
                      tier.highlighted
                        ? "text-muted/30"
                        : "text-muted/60 group-hover:text-muted/30"
                    }`}
                  >
                    {tier.requests} requests/month
                  </div>
                </div>

                <ul className={clsx("space-y-3", "mb-8")}>
                  {tier.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className={clsx(
                        "flex",
                        "items-start",
                        "gap-2",
                        "text-sm"
                      )}
                    >
                      <LuCircleCheck
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          tier.highlighted
                            ? "text-white"
                            : "text-muted group-hover:text-white"
                        }`}
                      />
                      <span
                        className={
                          tier.highlighted
                            ? "text-soft"
                            : "text-muted group-hover:text-soft"
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 font-semibold border-2 transition-colors rounded-2xl ${
                    tier.highlighted
                      ? "bg-white text-muted border-white hover:bg-soft"
                      : "bg-muted text-white border-muted group-hover:bg-white group-hover:text-muted group-hover:border-white hover:scale-x-105"
                  }`}
                >
                  {tier.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div
        className={clsx(
          "max-w-7xl",
          "mx-auto",
          "px-4",
          "sm:px-6",
          "lg:px-8",
          "py-16",
          "sm:py-20"
        )}
      >
        <div
          className={clsx(
            "grid",
            "grid-cols-2",
            "md:grid-cols-4",
            "gap-8",
            "text-center text-muted"
          )}
        >
          <div>
            <div className={clsx("text-4xl", "font-bold", "mb-2")}>99.9%</div>
            <div
              className={clsx(
                "text-sm",
                "text-muted/70",
                "uppercase",
                "tracking-wide"
              )}
            >
              Uptime
            </div>
          </div>
          <div>
            <div className={clsx("text-4xl", "font-bold", "mb-2")}>
              &lt;200ms
            </div>
            <div
              className={clsx(
                "text-sm",
                "text-muted/70",
                "uppercase",
                "tracking-wide"
              )}
            >
              Response Time
            </div>
          </div>
          <div>
            <div className={clsx("text-4xl", "font-bold", "mb-2")}>50M+</div>
            <div
              className={clsx(
                "text-sm",
                "text-muted/70",
                "uppercase",
                "tracking-wide"
              )}
            >
              API Calls/Month
            </div>
          </div>
          <div>
            <div className={clsx("text-4xl", "font-bold", "mb-2")}>5,000+</div>
            <div
              className={clsx(
                "text-sm",
                "text-muted/70",
                "uppercase",
                "tracking-wide"
              )}
            >
              Developers
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div
        className={clsx(
          "border-t-2",
          "border-muted rounded-2xl",
          "bg-muted",
          "text-white"
        )}
      >
        <div
          className={clsx(
            "max-w-4xl",
            "mx-auto",
            "px-4",
            "sm:px-6",
            "lg:px-8",
            "py-16",
            "sm:py-20",
            "text-center"
          )}
        >
          <h2 className={clsx("text-3xl", "sm:text-4xl", "font-bold", "mb-4")}>
            Start Building Today
          </h2>
          <p className={clsx("text-gray-300", "text-lg", "mb-8")}>
            Join thousands of developers using our API to power their
            applications
          </p>
          <div
            className={clsx(
              "flex",
              "flex-col",
              "sm:flex-row",
              "gap-4",
              "justify-center"
            )}
          >
            <button
              className={clsx(
                "bg-white",
                "text-muted",
                "px-8",
                "py-4",
                "text-lg",
                "font-semibold",
                "hover:bg-muted/20 hover:text-soft rounded-xl",
                "transition-colors duration-500",
                "border-2",
                "border-white"
              )}
            >
              Generate API Key
            </button>
            <button
              className={clsx(
                "bg-transparent",
                "text-white",
                "px-8",
                "py-4",
                "text-lg",
                "font-semibold",
                "hover:bg-white",
                "hover:text-muted",
                "transition-colors duration-500",
                "border-2 rounded-xl",
                "border-white"
              )}
            >
              Explore API Docs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
