import Link from "next/link";
import React from "react";
import { LuArrowLeft, LuMenu, LuX } from "react-icons/lu";

export default function ServicesLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const serviceLinks = [
    { name: "VTU & Bills", href: "/services/vtu" },
    { name: "Virtual Numbers", href: "/services/virtual-numbers" },
    { name: "Social Purchases", href: "/services/social-purchases" },
    { name: "Wallet & Tokens", href: "/services/wallet" },
    { name: "Rewards", href: "/services/rewards" },
    { name: "Public API", href: "/services/api" },
    { name: "Vendor Marketplace", href: "/services/vendor-marketplace" },
    { name: "Social Marketplace", href: "/services/social-marketplace" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <nav className="border-b-2 border-black sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Back to Home */}
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold hover:opacity-70 transition-opacity"
            >
              <LuArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {serviceLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium hover:bg-black hover:text-white transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 border-2 border-black hover:bg-black hover:text-white transition-colors"
            >
              {mobileMenuOpen ? (
                <LuX className="w-5 h-5" />
              ) : (
                <LuMenu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t-2 border-black py-4">
              <div className="flex flex-col gap-2">
                {serviceLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="px-4 py-3 text-sm font-medium hover:bg-black hover:text-white transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t-2 border-black bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Services Column */}
            <div>
              <h3 className="font-bold text-lg mb-4">Services</h3>
              <ul className="space-y-2">
                {serviceLinks.slice(0, 4).map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-black transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* More Services Column */}
            <div>
              <h3 className="font-bold text-lg mb-4">More Services</h3>
              <ul className="space-y-2">
                {serviceLinks.slice(4).map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-black transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h3 className="font-bold text-lg mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/help"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="/docs"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="/api"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    API Reference
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-300 text-center text-sm text-gray-600">
            <p>&copy; 2024 Your Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
