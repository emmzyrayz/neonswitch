import clsx from "clsx";

// app/admin/components/StatsCard.tsx
export default function StatsCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <div
      className={clsx(
        "p-4",
        "md:p-6",
        "rounded-xl",
        "bg-black/30",
        "border",
        "border-white/10",
        "shadow-[0_0_20px_#6B7280]",
        "hover:shadow-[0_0_25px_#F9FAFB]",
        "transition-shadow"
      )}
    >
      <h3
        className={clsx(
          "text-muted",
          "text-xs",
          "md:text-sm",
          "uppercase",
          "tracking-wide"
        )}
      >
        {title}
      </h3>
      <p
        className={clsx(
          "text-2xl",
          "md:text-3xl",
          "font-semibold",
          "text-soft",
          "mt-2",
          "drop-shadow-[0_0_6px_#F9FAFB]"
        )}
      >
        {value}
      </p>
      {subtitle && (
        <p className={clsx("text-xs", "text-gray-500", "mt-1")}>{subtitle}</p>
      )}
    </div>
  );
}
