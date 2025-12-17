import clsx from "clsx";
import React from "react";
import {
  LuPhone,
  LuZap,
  LuShield,
  LuClock,
  LuCreditCard,
  LuCircleCheck,
} from "react-icons/lu";

export default function VTUServicePage() {
  const services = [
    {
      name: "Airtime Top-up",
      description: "Instant airtime recharge for all major networks",
      icon: LuPhone,
    },
    {
      name: "Data Bundles",
      description: "Affordable data plans for all carriers",
      icon: LuZap,
    },
    {
      name: "Electricity Bills",
      description:
        "Instant electricity bill payments with provider confirmation",
      icon: LuCreditCard,
    },
    {
      name: "Cable TV",
      description: "DSTV, GOTV, and Startimes subscription renewals",
      icon: LuCircleCheck,
    },
  ];

  const benefits = [
    "Instant processing and delivery",
    "Competitive rates and discounts",
    "Support for all major networks",
    "Automatic transaction status verification",
    "24/7 automated service",
    "Secure payment processing",
    "Transaction history tracking",
  ];

  const supportedNetworks = ["MTN", "Airtel", "Glo", "9mobile"];

  return (
    <div
      className={clsx(
        "min-h-screen flex flex-col w-full mt-[25px] px-[20px]",
        "bg-white"
      )}
    >
      {/* Hero Section */}
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
                Popular Service
              </span>
            </div>

            <div
              className={clsx(
                "flex flex-row w-full h-full",
                "items-center justify-center",
                "gap-6",
                "mb-6"
              )}
            >
              <div
                className={clsx(
                  "p-4",
                  "border-2",
                  "border-muted",
                  "bg-muted rounded-2xl",
                  "text-white"
                )}
              >
                <LuPhone
                  className={clsx("w-10", "h-10", "sm:w-12", "sm:h-12")}
                />
              </div>
              <div
                className={clsx(
                  "flex-1 w-full h-full",
                  "items-center",
                  "justify-center"
                )}
              >
                <h1
                  className={clsx(
                    "text-4xl",
                    "sm:text-5xl",
                    "md:text-6xl",
                    "font-bold",
                    "tracking-tight",
                    "mb-0",
                    "flex w-full h-full text-muted"
                  )}
                >
                  VTU & Bills Payment
                </h1>
              </div>
            </div>

            <p
              className={clsx(
                "text-lg",
                "sm:text-xl",
                "text-gray-600",
                "leading-relaxed"
              )}
            >
              Reliable virtual top-up and bills payment services for everyday
              use. Recharge airtime, purchase data bundles, pay electricity
              bills, and manage cable TV subscriptions with instant processing
              and transparent pricing.
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div
        className={clsx(
          "max-w-7xl text-muted",
          "mx-auto",
          "px-4",
          "sm:px-6",
          "lg:px-8",
          "py-16",
          "sm:py-20"
        )}
      >
        <h2 className={clsx("text-3xl", "sm:text-4xl", "font-bold", "mb-12")}>
          Available Services
        </h2>
        <div className={clsx("grid", "grid-cols-1", "md:grid-cols-2", "gap-6")}>
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.name}
                className={clsx(
                  "border-2",
                  "border-muted rounded-2xl",
                  "p-8",
                  "hover:bg-muted cursor-pointer",
                  "hover:text-white",
                  "transition-all",
                  "duration-700",
                  "group"
                )}
              >
                <Icon className={clsx("w-12", "h-12", "mb-4")} />
                <h3 className={clsx("text-2xl", "font-bold", "mb-3")}>
                  {service.name}
                </h3>
                <p
                  className={clsx("text-gray-600", "group-hover:text-gray-300")}
                >
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div
        className={clsx("border-t-2 text-muted", "border-muted", "bg-gray-50")}
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
          <h2 className={clsx("text-3xl", "sm:text-4xl", "font-bold", "mb-12")}>
            How It Works
          </h2>
          <div
            className={clsx("grid", "grid-cols-1", "md:grid-cols-3", "gap-8")}
          >
            <div className="text-center">
              <div
                className={clsx(
                  "w-16",
                  "h-16",
                  "border-2",
                  "border-muted rounded-xl",
                  "bg-muted",
                  "text-white",
                  "text-2xl",
                  "font-bold",
                  "flex",
                  "items-center",
                  "justify-center",
                  "mx-auto",
                  "mb-4"
                )}
              >
                1
              </div>
              <h3 className={clsx("text-xl", "font-bold", "mb-2")}>
                Select Service
              </h3>
              <p className="text-gray-600">
                Choose from airtime, data, bills, or cable TV
              </p>
            </div>
            <div className="text-center">
              <div
                className={clsx(
                  "w-16",
                  "h-16",
                  "border-2",
                  "border-muted rounded-xl",
                  "bg-muted",
                  "text-white",
                  "text-2xl",
                  "font-bold",
                  "flex",
                  "items-center",
                  "justify-center",
                  "mx-auto",
                  "mb-4"
                )}
              >
                2
              </div>
              <h3 className={clsx("text-xl", "font-bold", "mb-2")}>
                Enter Details
              </h3>
              <p className="text-gray-600">
              Provide required details and confirm the transaction
              </p>
            </div>
            <div className="text-center">
              <div
                className={clsx(
                  "w-16",
                  "h-16",
                  "border-2",
                  "border-muted rounded-xl",
                  "bg-muted",
                  "text-white",
                  "text-2xl",
                  "font-bold",
                  "flex",
                  "items-center",
                  "justify-center",
                  "mx-auto",
                  "mb-4"
                )}
              >
                3
              </div>
              <h3 className={clsx("text-xl", "font-bold", "mb-2")}>
                Instant Delivery
              </h3>
              <p className="text-gray-600">
                Payment processed and delivered instantly
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
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
            "grid-cols-1",
            "lg:grid-cols-2",
            "gap-12",
            "items-center text-muted"
          )}
        >
          <div>
            <h2
              className={clsx("text-3xl", "sm:text-4xl", "font-bold", "mb-6")}
            >
              Why Choose Our VTU Service?
            </h2>
            <p className={clsx("text-lg", "text-gray-600", "mb-8")}>
            Our VTU system is designed for consistency, speed, and accuracy.
All transactions are processed automatically, logged in real time,
and reflected instantly upon successful confirmation.

            </p>
            <ul className="space-y-4">
              {benefits.map((benefit, idx) => (
                <li key={idx} className={clsx("flex", "items-start", "gap-3")}>
                  <LuCircleCheck
                    className={clsx("w-6", "h-6", "shrink-0", "mt-0.5")}
                  />
                  <span className="text-lg">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className={clsx(
              "border-2",
              "border-muted rounded-2xl",
              "p-8",
              "bg-muted",
              "text-white"
            )}
          >
            <h3 className={clsx("text-2xl", "font-bold", "mb-6")}>
              Supported Networks
            </h3>
            <div className={clsx("grid", "grid-cols-2", "gap-4", "mb-8")}>
              {supportedNetworks.map((network) => (
                <div
                  key={network}
                  className={clsx(
                    "border-2",
                    "border-white rounded-2xl",
                    "p-4",
                    "text-center",
                    "font-bold",
                    "text-xl"
                  )}
                >
                  {network}
                </div>
              ))}
            </div>
            <div className={clsx("border-t-2", "border-white", "pt-6")}>
              <div className={clsx("flex", "items-center", "gap-3", "mb-4")}>
                <LuClock className={clsx("w-6", "h-6")} />
                <span>24/7 Availability</span>
              </div>
              <div className={clsx("flex", "items-center", "gap-3", "mb-4")}>
                <LuShield className={clsx("w-6", "h-6")} />
                <span>Secure Transactions</span>
              </div>
              <div className={clsx("flex", "items-center", "gap-3")}>
                <LuZap className={clsx("w-6", "h-6")} />
                <span>Instant Processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Preview */}
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
          <h2
            className={clsx(
              "text-3xl",
              "sm:text-4xl",
              "font-bold",
              "mb-4",
              "text-center"
            )}
          >
            Transparent Pricing
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
            No hidden fees. What you see is what you pay. Competitive rates across all supported services.
          </p>
          <div
            className={clsx(
              "grid",
              "grid-cols-1",
              "md:grid-cols-3",
              "gap-6",
              "max-w-5xl",
              "mx-auto"
            )}
          >
            <div
              className={clsx(
                "border-2",
                "border-muted rounded-2xl",
                "p-6",
                "bg-white",
                "text-center"
              )}
            >
              <h4 className={clsx("font-bold", "text-lg", "mb-2")}>Airtime</h4>
              <p className={clsx("text-3xl", "font-bold", "mb-2")}>
                2% Discount
              </p>
              <p className={clsx("text-sm", "text-gray-600")}>
                On all networks
              </p>
            </div>
            <div
              className={clsx(
                "border-2",
                "border-muted rounded-2xl",
                "p-6",
                "bg-white",
                "text-center"
              )}
            >
              <h4 className={clsx("font-bold", "text-lg", "mb-2")}>
                Data Bundles
              </h4>
              <p className={clsx("text-3xl", "font-bold", "mb-2")}>
                Up to 5% Off
              </p>
              <p className={clsx("text-sm", "text-gray-600")}>
                Best market rates
              </p>
            </div>
            <div
              className={clsx(
                "border-2",
                "border-muted rounded-2xl",
                "p-6",
                "bg-white",
                "text-center"
              )}
            >
              <h4 className={clsx("font-bold", "text-lg", "mb-2")}>Bills</h4>
              <p className={clsx("text-3xl", "font-bold", "mb-2")}>
                No Charges
              </p>
              <p className={clsx("text-sm", "text-gray-600")}>
                Zero service fee
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div
        className={clsx(
          "border-t-2",
          "border-muted",
          "bg-muted rounded-2xl",
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
            Ready to Get Started?
          </h2>
          <p className={clsx("text-gray-300", "text-lg", "mb-8")}>
            Start enjoying instant VTU services today. Sign up to access fast, secure, and reliable VTU services.
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
                "text-muted rounded-xl",
                "px-8",
                "py-4",
                "text-lg",
                "font-semibold",
                "hover:bg-muted hover:text-soft",
                "transition-colors",
                "duration-700",
                "border-2",
                "border-white"
              )}
            >
              Get Started Now
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
                "hover:text-muted rounded-xl",
                "transition-colors",
                "duration-300",
                "border-2",
                "border-white"
              )}
            >
              View Pricing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
