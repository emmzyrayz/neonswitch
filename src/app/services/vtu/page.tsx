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
      description: "Pay your electricity bills instantly",
      icon: LuCreditCard,
    },
    {
      name: "Cable TV",
      description: "Subscribe to DSTV, GOTV, and Startimes",
      icon: LuCircleCheck,
    },
  ];

  const benefits = [
    "Instant processing and delivery",
    "Competitive rates and discounts",
    "Support for all major networks",
    "24/7 automated service",
    "Secure payment processing",
    "Transaction history tracking",
  ];

  const supportedNetworks = ["MTN", "Airtel", "Glo", "9mobile"];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-4xl">
            <div className="inline-block border-2 border-black px-4 py-1 mb-6">
              <span className="text-sm font-bold uppercase tracking-wide">
                Popular Service
              </span>
            </div>

            <div className="flex items-start gap-6 mb-6">
              <div className="p-4 border-2 border-black bg-black text-white">
                <LuPhone className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
                  VTU & Bills Payment
                </h1>
              </div>
            </div>

            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              Seamless virtual top-up and bills payment service. Recharge
              airtime, buy data bundles, pay electricity bills, and renew cable
              TV subscriptions instantly with competitive rates.
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12">
          Available Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.name}
                className="border-2 border-black p-8 hover:bg-black hover:text-white transition-colors duration-300 group"
              >
                <Icon className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-3">{service.name}</h3>
                <p className="text-gray-600 group-hover:text-gray-300">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="border-t-2 border-black bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 border-2 border-black bg-black text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Select Service</h3>
              <p className="text-gray-600">
                Choose from airtime, data, bills, or cable TV
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 border-2 border-black bg-black text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Enter Details</h3>
              <p className="text-gray-600">
                Provide phone number and select amount
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 border-2 border-black bg-black text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Instant Delivery</h3>
              <p className="text-gray-600">
                Payment processed and delivered instantly
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Why Choose Our VTU Service?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We provide the fastest and most reliable virtual top-up service
              with competitive rates and instant delivery. Our platform is
              trusted by thousands of users daily.
            </p>
            <ul className="space-y-4">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <LuCircleCheck className="w-6 h-6 shrink-0 mt-0.5" />
                  <span className="text-lg">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-2 border-black p-8 bg-black text-white">
            <h3 className="text-2xl font-bold mb-6">Supported Networks</h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {supportedNetworks.map((network) => (
                <div
                  key={network}
                  className="border-2 border-white p-4 text-center font-bold text-xl"
                >
                  {network}
                </div>
              ))}
            </div>
            <div className="border-t-2 border-white pt-6">
              <div className="flex items-center gap-3 mb-4">
                <LuClock className="w-6 h-6" />
                <span>24/7 Availability</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <LuShield className="w-6 h-6" />
                <span>Secure Transactions</span>
              </div>
              <div className="flex items-center gap-3">
                <LuZap className="w-6 h-6" />
                <span>Instant Processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Preview */}
      <div className="border-t-2 border-black bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
            Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto">
            No hidden fees. What you see is what you pay. Get the best rates in
            the market.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="border-2 border-black p-6 bg-white text-center">
              <h4 className="font-bold text-lg mb-2">Airtime</h4>
              <p className="text-3xl font-bold mb-2">2% Discount</p>
              <p className="text-sm text-gray-600">On all networks</p>
            </div>
            <div className="border-2 border-black p-6 bg-white text-center">
              <h4 className="font-bold text-lg mb-2">Data Bundles</h4>
              <p className="text-3xl font-bold mb-2">Up to 5% Off</p>
              <p className="text-sm text-gray-600">Best market rates</p>
            </div>
            <div className="border-2 border-black p-6 bg-white text-center">
              <h4 className="font-bold text-lg mb-2">Bills</h4>
              <p className="text-3xl font-bold mb-2">No Charges</p>
              <p className="text-sm text-gray-600">Zero service fee</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t-2 border-black bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Start enjoying instant VTU services today. Sign up now and get your
            first transaction bonus.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-black px-8 py-4 text-lg font-semibold hover:bg-gray-100 transition-colors duration-300 border-2 border-white">
              Get Started Now
            </button>
            <button className="bg-transparent text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-black transition-colors duration-300 border-2 border-white">
              View Pricing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
