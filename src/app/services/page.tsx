import clsx from "clsx";
import Link from "next/link";
import React from "react";
import {
  LuArrowRight,
  LuZap,
  LuPhone,
  LuTrendingUp,
  LuWallet,
  // LuGift,
  LuCode,
  // LuStore,
  // LuUsers,
} from "react-icons/lu";

const services = [
  {
    id: "vtu",
    title: "VTU & Bills Payment",
    description:
      "Seamless airtime, data, and utility bills payment services. Pay for electricity, cable TV, and more instantly.",
    icon: LuPhone,
    link: "/services/vtu",
    features: [
      "Instant Airtime Top-up",
      "Data Bundles",
      "Electricity Bills",
      "Cable TV Subscriptions",
    ],
  },
  {
    id: "virtual-numbers",
    title: "Virtual Numbers",
    description:
      "Disposable and long-term virtual phone numbers for SMS verification across multiple platforms.",
    icon: LuZap,
    link: "/services/virtual_number",
    features: [
      "Multi-Platform Support",
      "Instant Activation",
      "Privacy Protection",
      "Flexible Pricing",
    ],
  },
  {
    id: "neonaccess",
    title: "NeonAccess",
    description:
      "A verified digital access marketplace for social platforms, subscriptions, and online services with escrow protection.",
    icon: LuTrendingUp,
    link: "/services/neonaccess",
    features: [
      "Social Coins & Boosts",
      "Verified Digital Accounts",
      "Escrow & Monitoring",
      "Trusted Vendors",
    ],
  },
  {
    id: "neonpay",
    title: "NeonPay",
    description:
      "Integrated wallet system with platform coins, activity-based tokens, and secure withdrawals.",
    icon: LuWallet,
    link: "/services/neonpay",
    features: [
      "Secure Wallet",
      "Platform Coins",
      "Reward Tokens",
      "Deposits & Withdrawals",
    ],
  },
  {
    id: "api",
    title: "Public API",
    description:
      "Developer-friendly API for integrating VTU, wallet, and digital services into external platforms.",
    icon: LuCode,
    link: "/services/api",
    features: [
      "RESTful API",
      "Comprehensive Docs",
      "Webhook Events",
      "Rate Limiting",
    ],
  },
];


export default function ServicesPage() {
  return (
    <div className={clsx('flex flex-col p-8 lg:p-5 items-center justify-center w-full h-full', 'bg-white', 'text-black font-sora', 'mt-[10%]')}>
      {/* Hero Section */}
      <div className={clsx('border-b', 'border-black', 'bg-muted/10 rounded-xl ')}>
        <div className={clsx('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-16', 'sm:py-24')}>
          <div className="text-center">
            <h1 className={clsx('text-4xl', 'sm:text-5xl', 'md:text-6xl', 'font-bold', 'tracking-tight', 'mb-6')}>
              Our Services
            </h1>
            <p className={clsx('text-lg', 'sm:text-xl', 'text-gray-600', 'max-w-3xl', 'mx-auto')}>
              Comprehensive digital services platform offering everything from
              VTU payments to social media solutions. All in one place, secure
              and reliable.
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className={clsx('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-16', 'sm:py-24')}>
        <div className={clsx('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-8')}>
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link
               href={service.link}
                key={service.id}
                className={clsx('group', 'border-2 rounded-2xl', 'border-muted', 'p-8', 'hover:bg-muted/60 shadow-muted shadow-none hover:shadow-xl hover:scale-105 duration-700 ease-in-out transition-all', 'hover:text-white', 'transition-all', 'duration-300', 'cursor-pointer')}
              >
                <div className={clsx('flex', 'items-start', 'justify-between', 'mb-6')}>
                  <div className={clsx('p-3', 'border-2 rounded-2xl', 'border-muted', 'group-hover:border-white', 'group-hover:bg-white', 'transition-colors', 'duration-300')}>
                    <Icon className={clsx('w-8', 'h-8', 'group-hover:text-black')} />
                  </div>
                  <LuArrowRight className={clsx('w-6', 'h-6', 'transform', 'group-hover:translate-x-1', 'transition-transform', 'duration-300')} />
                </div>

                <h3 className={clsx('text-2xl', 'font-bold', 'mb-3')}>{service.title}</h3>
                <p className={clsx('text-gray-600', 'group-hover:text-gray-300', 'mb-6', 'leading-relaxed')}>
                  {service.description}
                </p>

                <div className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className={clsx('flex', 'items-center', 'gap-2', 'text-sm')}>
                      <div className={clsx('w-1.5', 'h-1.5', 'bg-black', 'group-hover:bg-white')} />
                      <span className={clsx('text-gray-700', 'group-hover:text-gray-200')}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={clsx('mt-8', 'pt-6', 'border-t', 'border-gray-300', 'group-hover:border-gray-700')}>
                  <span className={clsx('text-sm', 'font-semibold', 'inline-flex', 'items-center', 'gap-2')}>
                    Learn More
                    <LuArrowRight className={clsx('w-4', 'h-4')} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className={clsx('border-t-2', 'border-muted', 'bg-muted rounded-2xl', 'text-white')}>
        <div className={clsx('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-16', 'sm:py-20', 'text-center')}>
          <h2 className={clsx('text-3xl', 'sm:text-4xl', 'font-bold', 'mb-4')}>
            Ready to Get Started?
          </h2>
          <p className={clsx('text-gray-300', 'text-lg', 'mb-8', 'max-w-2xl', 'mx-auto')}>
            Join thousands of users already enjoying our services. Sign up today
            and get instant access to all features.
          </p>
          <Link href='/auth/signup' className={clsx('bg-white', 'text-black hover:text-shadow-xs text-shadow-black', 'px-8', 'py-4', 'text-lg', 'font-semibold', 'hover:bg-soft/30 hover:border-soft/10 rounded-2xl', 'transition-colors', 'duration-300', 'inline-flex', 'items-center', 'gap-2', 'border-2', 'border-white')}>
            Get Started Now
            <LuArrowRight className={clsx('w-5', 'h-5')} />
          </Link>
        </div>
      </div>
    </div>
  );
}
