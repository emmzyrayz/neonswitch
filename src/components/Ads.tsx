// components/Ads.tsx
import clsx from "clsx";
import Link from "next/link";

export default function Ads() {
  return (
    <div
      className={clsx(
        "w-[95%]",
        "bg-linear-to-r",
        "from-primary/30",
        "via-primary/40",
        "to-primary/30",
        "rounded-lg",
        "py-4",
        "px-6",
        "my-4",
        "shadow-[0_0_20px_rgba(229,231,235,0.3)]",
        "border",
        "border-primary/20"
      )}
    >
      <div
        className={clsx(
          "max-w-6xl",
          "mx-auto",
          "flex",
          "flex-col",
          "md:flex-row",
          "items-center",
          "justify-between",
          "gap-4"
        )}
      >
        {/* Ad Content */}
        <div className={clsx("flex-1", "text-center", "md:text-left")}>
          <p className={clsx("text-black", "font-semibold", "text-sm", "md:text-base")}>
            🎉 <span className="font-bold">Special Offer:</span> Get 20% off on all virtual numbers this month!
          </p>
          <p className={clsx("text-black/70", "text-xs", "md:text-sm", "mt-1")}>
            Limited time offer. Use code: <span className={clsx('font-mono', 'font-bold')}>NEON20</span>
          </p>
        </div>

        {/* CTA Button */}
        <Link
          href="/pricing"
          className={clsx(
            "px-6",
            "py-2",
            "bg-black",
            "text-white",
            "font-semibold",
            "rounded-lg",
            "shadow-[0_0_15px_rgba(0,0,0,0.5)]",
            "hover:bg-black/80",
            "transition",
            "text-sm",
            "whitespace-nowrap"
          )}
        >
          Claim Offer
        </Link>
      </div>
    </div>
  );
}