import clsx from "clsx";
import React from "react";
import { LuWallet, LuCoins, LuRepeat, LuShield } from "react-icons/lu";

export default function NeonPayServicePage() {
  return (
    <div className={clsx("min-h-screen", "bg-white", "px-[20px]", "mt-[25px]")}>
      <section className={clsx("border-b-2", "border-muted")}>
        <div className={clsx("max-w-7xl", "mx-auto", "py-20", "text-muted")}>
          <h1 className={clsx("text-5xl", "font-bold", "mb-6")}>NeonPay</h1>
          <p className={clsx("text-xl", "text-gray-600", "max-w-3xl")}>
            An internal wallet and settlement system that powers deposits,
            service payments, withdrawals, and activity-based platform rewards.
          </p>
        </div>
      </section>

      <section className={clsx("max-w-7xl", "mx-auto", "py-20", "text-muted")}>
        <div
          className={clsx("grid", "md:grid-cols-2", "gap-12", "items-center")}
        >
          <div>
            <h2 className={clsx("text-4xl", "font-bold", "mb-6")}>
              How NeonPay Works
            </h2>
            <ul className={clsx("space-y-4", "text-lg")}>
              <li className={clsx("flex", "gap-3")}>
                <LuWallet className={clsx("w-6", "h-6", "mt-1")} />
                Deposit funds into your NeonPay wallet
              </li>
              <li className={clsx("flex", "gap-3")}>
                <LuRepeat className={clsx("w-6", "h-6", "mt-1")} />
                Convert wallet balance into platform coins for services
              </li>
              <li className={clsx("flex", "gap-3")}>
                <LuCoins className={clsx("w-6", "h-6", "mt-1")} />
                Earn platform tokens through verified activity and milestones
              </li>
              <li className={clsx("flex", "gap-3")}>
                <LuShield className={clsx("w-6", "h-6", "mt-1")} />
                Withdraw available wallet balance securely
              </li>
            </ul>
          </div>

          <div
            className={clsx(
              "border-2",
              "border-muted",
              "rounded-2xl",
              "p-8",
              "bg-muted",
              "text-white"
            )}
          >
            <h3 className={clsx("text-2xl", "font-bold", "mb-4")}>
              Token Policy
            </h3>
            <p className="text-gray-300">
              Platform tokens are non-purchasable, non-transferable, and
              non-withdrawable. They are earned solely through verified platform
              activity and may be used only for service discounts and internal
              benefits.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
