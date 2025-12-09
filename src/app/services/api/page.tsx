'use client'
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
  const [copiedEndpoint, setCopiedEndpoint] = React.useState<number | null>(null);

  const features = [
    {
      icon: LuZap,
      title: "Lightning Fast",
      description:
        "Average response time under 200ms with 99.9% uptime guarantee",
    },
    {
      icon: LuShield,
      title: "Secure Authentication",
      description: "API key and OAuth 2.0 support with request signing",
    },
    {
      icon: LuBookOpen,
      title: "Comprehensive Docs",
      description:
        "Detailed documentation with code examples in multiple languages",
    },
    {
      icon: LuTerminal,
      title: "Developer Friendly",
      description: "RESTful design with JSON responses and webhook support",
    },
  ];

  const endpoints = [
    {
      method: "POST",
      path: "/api/v1/vtu/airtime",
      description: "Purchase airtime",
    },
    {
      method: "POST",
      path: "/api/v1/vtu/data",
      description: "Purchase data bundle",
    },
    {
      method: "GET",
      path: "/api/v1/wallet/balance",
      description: "Check wallet balance",
    },
    {
      method: "POST",
      path: "/api/v1/virtual-numbers",
      description: "Generate virtual number",
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
    <div className={clsx("min-h-screen", "bg-white")}>
      {/* Hero */}
      <div className={clsx("border-b-2", "border-black")}>
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
                "border-black",
                "px-4",
                "py-1",
                "mb-6"
              )}
            >
              <span
                className={clsx(
                  "text-sm",
                  "font-bold",
                  "uppercase",
                  "tracking-wide"
                )}
              >
                For Developers
              </span>
            </div>

            <div className={clsx("flex", "items-start", "gap-6", "mb-6")}>
              <div
                className={clsx(
                  "p-4",
                  "border-2",
                  "border-black",
                  "bg-black",
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
                    "mb-4"
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
              Build powerful integrations with our comprehensive REST API.
              Access all platform features programmatically with simple,
              well-documented endpoints.
            </p>

            <div className={clsx("flex", "flex-col", "sm:flex-row", "gap-4")}>
              <button
                className={clsx(
                  "bg-black",
                  "text-white",
                  "px-8",
                  "py-4",
                  "text-lg",
                  "font-semibold",
                  "hover:bg-gray-800",
                  "transition-colors",
                  "border-2",
                  "border-black"
                )}
              >
                Get API Key
              </button>
              <button
                className={clsx(
                  "bg-white",
                  "text-black",
                  "px-8",
                  "py-4",
                  "text-lg",
                  "font-semibold",
                  "hover:bg-gray-100",
                  "transition-colors",
                  "border-2",
                  "border-black"
                )}
              >
                View Documentation
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
          "sm:py-20"
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
                  "border-black",
                  "p-8",
                  "hover:bg-black",
                  "hover:text-white",
                  "transition-colors",
                  "duration-300",
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
      <div className={clsx("border-t-2", "border-black", "bg-gray-50")}>
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
          <p className={clsx("text-lg", "text-gray-600", "mb-8")}>
            Get started in minutes with our simple API. Here&apos;s how to make
            your first request:
          </p>
          <div
            className={clsx(
              "border-2",
              "border-black",
              "bg-black",
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
          "sm:py-20"
        )}
      >
        <h2 className={clsx("text-3xl", "sm:text-4xl", "font-bold", "mb-4")}>
          Popular Endpoints
        </h2>
        <p className={clsx("text-lg", "text-gray-600", "mb-8")}>
          Access all platform services through our RESTful API endpoints
        </p>
        <div className="space-y-4">
          {endpoints.map((endpoint, idx) => (
            <div
              key={idx}
              className={clsx(
                "border-2",
                "border-black",
                "p-6",
                "hover:bg-gray-50",
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
                        "bg-black",
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
                  <p className="text-gray-600">{endpoint.description}</p>
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
                    "border-black",
                    "hover:bg-black",
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
              "border-black",
              "px-8",
              "py-3",
              "font-semibold",
              "hover:bg-black",
              "hover:text-white",
              "transition-colors"
            )}
          >
            View All Endpoints →
          </button>
        </div>
      </div>

      {/* Pricing */}
      <div className={clsx("border-t-2", "border-black", "bg-gray-50")}>
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
              "text-gray-600",
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
                className={`border-2 border-black p-8 ${
                  tier.highlighted
                    ? "bg-black text-white"
                    : "bg-white hover:bg-black hover:text-white"
                } transition-colors duration-300 group`}
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
                        ? "text-gray-300"
                        : "text-gray-600 group-hover:text-gray-300"
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
                            : "text-black group-hover:text-white"
                        }`}
                      />
                      <span
                        className={
                          tier.highlighted
                            ? "text-gray-200"
                            : "text-gray-700 group-hover:text-gray-200"
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 font-semibold border-2 transition-colors ${
                    tier.highlighted
                      ? "bg-white text-black border-white hover:bg-gray-100"
                      : "bg-black text-white border-black group-hover:bg-white group-hover:text-black group-hover:border-white"
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
            "text-center"
          )}
        >
          <div>
            <div className={clsx("text-4xl", "font-bold", "mb-2")}>99.9%</div>
            <div
              className={clsx(
                "text-sm",
                "text-gray-600",
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
                "text-gray-600",
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
                "text-gray-600",
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
                "text-gray-600",
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
        className={clsx("border-t-2", "border-black", "bg-black", "text-white")}
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
                "text-black",
                "px-8",
                "py-4",
                "text-lg",
                "font-semibold",
                "hover:bg-gray-100",
                "transition-colors",
                "border-2",
                "border-white"
              )}
            >
              Get API Key
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
                "hover:text-black",
                "transition-colors",
                "border-2",
                "border-white"
              )}
            >
              Read Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
