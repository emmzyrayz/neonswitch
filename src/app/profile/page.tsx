import clsx from "clsx";
import React from "react";
import Link from "next/link";
import { 
  LuUser, 
  LuSettings, 
  LuMail, 
  LuPhone, 
  LuMapPin, 
  LuCalendar,
  LuCreditCard,
  LuShield,
  LuBadgeCheck
} from "react-icons/lu";

// Pattern Component with Tailwind CSS
const QuantumPattern = () => {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl">
      {/* SVG Filter Definition */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <filter id="quantum-texture">
          <feTurbulence 
            result="noise" 
            numOctaves={2} 
            baseFrequency="0.1" 
            type="turbulence" 
          />
          <feSpecularLighting 
            result="specular" 
            lightingColor="#00ffcc" 
            specularExponent={30} 
            specularConstant={1} 
            surfaceScale={3} 
            in="noise"
          >
            <fePointLight z={150} y={100} x={100} />
          </feSpecularLighting>
          <feComposite result="lit" operator="over" in2="SourceGraphic" in="specular" />
          <feBlend mode="screen" in2="lit" in="SourceGraphic" />
        </filter>
      </svg>
      
      {/* Pattern Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, rgba(0, 50, 100, 0.8), rgba(1, 103, 132, 0.8), rgba(0, 50, 100, 0.8))",
          filter: "url(#quantum-texture)",
        }}
      />
      
      {/* Depth Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(0, 255, 204, 0.15) 20px, rgba(0, 255, 204, 0.15) 40px)"
        }}
      />
    </div>
  );
};

export default function ProfilePage() {
  // Mock user data - replace with actual data from your backend/context
  const user = {
    fullName: "Nnamdi Emmanuel",
    email: "nnamdi.emmanuel@example.com",
    phone: "+234 812 345 6789",
    address: "Lagos, Nigeria",
    accountType: "Premium User",
    memberSince: "January 2024",
    userId: "USR-2024-001234",
    verificationStatus: "Verified",
    accountStatus: "Active",
    kycLevel: "Level 2",
  };

  return (
    <div className={clsx("space-y-4", "sm:space-y-6", "text-muted")}>
      {/* ID Card Style Profile with Pattern Background */}
      <section
        className={clsx(
          "relative",
          "rounded-2xl",
          "sm:rounded-3xl",
          "p-5",
          "sm:p-8",
          "shadow-lg",
          "overflow-hidden",
          "bg-white/90",
          "backdrop-blur-sm"
        )}
      >
        {/* Quantum Pattern Background */}
        <QuantumPattern />
        
        {/* Content Layer */}
        <div className="relative z-10">
          {/* Verification Badge */}
          <div className={clsx("absolute", "top-4", "right-4", "sm:top-6", "sm:right-6", "z-20")}>
            <div className={clsx(
              "flex items-center gap-1.5 sm:gap-2",
              "bg-green-50/90 backdrop-blur-sm text-green-700",
              "border border-green-200",
              "px-2 sm:px-3",
              "py-1",
              "rounded-full",
              "text-xs",
              "font-semibold",
              "shadow-sm"
            )}>
              <LuBadgeCheck className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{user.verificationStatus}</span>
              <span className="sm:hidden">✓</span>
            </div>
          </div>

          {/* Header Section */}
          <div className={clsx("flex", "flex-col", "sm:flex-row", "items-start", "gap-4", "sm:gap-6", "mb-5", "sm:mb-6")}>
            {/* Avatar with glass effect */}
            <div className={clsx(
              "w-20 h-20",
              "sm:w-24 sm:h-24",
              "rounded-xl",
              "sm:rounded-2xl",
              "bg-linear-to-br from-primary/50 to-muted/30",
              "backdrop-blur-sm",
              "",
              "flex items-center justify-center",
              "text-white",
              "text-2xl",
              "sm:text-3xl",
              "font-bold",
              "shrink-0",
              "shadow-lg"
            )}>
              {user.fullName.split(' ').map(n => n[0]).join('')}
            </div>

            {/* Name and Type */}
            <div className={clsx("flex-1", "w-full", "sm:w-auto bg-linear-to-br from-muted/50 to-soft/40 p-2 rounded-2xl")}>
              <h2 className={clsx("text-2xl", "sm:text-3xl", "font-bold", "mb-1", "text-primary", "pr-12", "sm:pr-0")}>
                {user.fullName}
              </h2>
              <p className={clsx("text-sm", "sm:text-base", "text-primary font-semibold", "mb-1")}>{user.accountType}</p>
              <p className={clsx("text-xs", "sm:text-sm", "text-primary font-semibold", "font-sora", "bg-soft/5", "px-2", "py-1", "rounded", "inline-block")}>
                {user.userId}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className={clsx("h-px", "bg-soft", "my-4", "sm:my-6")} />

          {/* Details Grid */}
          <div className={clsx("grid", "grid-cols-1", "sm:grid-cols-2", "gap-3", "sm:gap-4", "mb-5", "sm:mb-6")}>
            {[
              { icon: LuMail, label: "Email Address", value: user.email },
              { icon: LuPhone, label: "Phone Number", value: user.phone },
              { icon: LuMapPin, label: "Location", value: user.address },
              { icon: LuCalendar, label: "Member Since", value: user.memberSince },
              { icon: LuShield, label: "KYC Level", value: user.kycLevel },
              { icon: LuCreditCard, label: "Account Status", value: user.accountStatus, color: "text-green-600" },
            ].map((item, index) => (
              <div key={index} className={clsx("flex", "gap-2.5", "sm:gap-3", "items-start bg-linear-to-br from-muted/50 to-soft/40 p-2 rounded-xl")}>
                <item.icon className={clsx('w-4 h-4 sm:w-5 sm:h-5', 'mt-0.5', 'text-primary', 'shrink-0')} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-primary mb-0.5">{item.label}</p>
                  <p className={clsx("text-xs sm:text-sm font-medium truncate", item.color || "text-primary")}>
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className={clsx("flex", "flex-col", "sm:flex-row", "gap-3", "mt-5", "sm:mt-6")}>
            <Link
              href="/profile/edit"
              className={clsx(
                "flex items-center justify-center gap-2",
                "border-2",
                "border-muted",
                "bg-muted",
                "text-white",
                "rounded-xl",
                "px-4 sm:px-5",
                "py-2.5",
                "text-sm",
                "font-medium",
                "hover:bg-gray-700",
                "transition-colors",
                "touch-manipulation",
                "relative z-10",
                "shadow-md"
              )}
            >
              <LuUser className="w-4 h-4" />
              Edit Profile
            </Link>

            <Link
              href="/profile/settings"
              className={clsx(
                "flex items-center justify-center gap-2",
                "border-2",
                "border-soft/40",
                "rounded-xl",
                "px-4 sm:px-5",
                "py-2.5",
                "text-sm",
                'text-primary hover:text-muted',
                "font-medium",
                "hover:bg-soft/60",
                "transition-colors",
                "touch-manipulation",
                "relative z-10",
                "shadow-sm"
              )}
            >
              <LuSettings className="w-4 h-4" />
              Settings
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <div className={clsx("grid", "grid-cols-1", "sm:grid-cols-3", "gap-3", "sm:gap-4")}>
        {[
          { label: "Total Transactions", value: "127" },
          { label: "Wallet Balance", value: "₦45,230" },
          { label: "Active Services", value: "3" },
        ].map((stat, index) => (
          <div 
            key={index}
            className={clsx(
              "border-2", 
              "border-muted/30", 
              "rounded-xl", 
              "sm:rounded-2xl", 
              "p-4", 
              "sm:p-5",
              "bg-white/80",
              "backdrop-blur-sm",
              "shadow-sm"
            )}
          >
            <p className="text-xs sm:text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}