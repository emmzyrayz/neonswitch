import React from "react";
import {
  LuArrowRight,
  LuZap,
  LuPhone,
  LuTrendingUp,
  LuWallet,
  LuGift,
  LuCode,
  LuStore,
  LuUsers,
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
      "Get disposable phone numbers for SMS verification across multiple platforms and services.",
    icon: LuZap,
    link: "/services/virtual-numbers",
    features: [
      "Multi-Platform Support",
      "Instant Activation",
      "Privacy Protection",
      "Affordable Rates",
    ],
  },
  {
    id: "social-purchases",
    title: "Social Media Digital Purchases",
    description:
      "Purchase TikTok coins, Instagram boosts, and other social media services at competitive rates.",
    icon: LuTrendingUp,
    link: "/services/social-purchases",
    features: [
      "TikTok Coins",
      "Instagram Boosts",
      "Fast Delivery",
      "Secure Transactions",
    ],
  },
  {
    id: "wallet",
    title: "Wallet + Coins + Platform Token",
    description:
      "Integrated digital wallet system with platform coins and tokens for seamless transactions.",
    icon: LuWallet,
    link: "/services/wallet",
    features: [
      "Secure Wallet",
      "Platform Coins",
      "Token Integration",
      "Easy Transfers",
    ],
  },
  {
    id: "rewards",
    title: "Activity Reward Token System",
    description:
      "Earn rewards for platform activity and engagement. Convert tokens to coins or services.",
    icon: LuGift,
    link: "/services/rewards",
    features: [
      "Activity Rewards",
      "Token Conversion",
      "Referral Bonuses",
      "Daily Challenges",
    ],
  },
  {
    id: "api",
    title: "Public API",
    description:
      "Developer-friendly API to integrate our services into your applications and platforms.",
    icon: LuCode,
    link: "/services/api",
    features: [
      "RESTful API",
      "Comprehensive Docs",
      "Webhook Support",
      "Rate Limiting",
    ],
  },
  {
    id: "vendor-marketplace",
    title: "Vendor Marketplace",
    description:
      "A marketplace for vendors to offer services and products directly to platform users.",
    icon: LuStore,
    link: "/services/vendor-marketplace",
    features: [
      "Vendor Registration",
      "Product Listings",
      "Secure Payments",
      "Rating System",
    ],
  },
  {
    id: "social-marketplace",
    title: "Social Account Marketplace",
    description:
      "Buy and sell social media accounts securely with escrow protection and verification.",
    icon: LuUsers,
    link: "/services/social-marketplace",
    features: [
      "Account Verification",
      "Escrow Protection",
      "Secure Transfers",
      "Wide Selection",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <div className="border-b border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Our Services
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive digital services platform offering everything from
              VTU payments to social media solutions. All in one place, secure
              and reliable.
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group border-2 border-black p-8 hover:bg-black hover:text-white transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 border-2 border-black group-hover:border-white group-hover:bg-white transition-colors duration-300">
                    <Icon className="w-8 h-8 group-hover:text-black" />
                  </div>
                  <LuArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" />
                </div>

                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-600 group-hover:text-gray-300 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-black group-hover:bg-white" />
                      <span className="text-gray-700 group-hover:text-gray-200">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-300 group-hover:border-gray-700">
                  <span className="text-sm font-semibold inline-flex items-center gap-2">
                    Learn More
                    <LuArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t-2 border-black bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of users already enjoying our services. Sign up today
            and get instant access to all features.
          </p>
          <button className="bg-white text-black px-8 py-4 text-lg font-semibold hover:bg-gray-100 transition-colors duration-300 inline-flex items-center gap-2 border-2 border-white">
            Get Started Now
            <LuArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
