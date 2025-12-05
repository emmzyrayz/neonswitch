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
    <div className={clsx('p-6', 'rounded-xl', 'bg-black/30', 'border', 'border-white/10', 'shadow-[0_0_20px_rgba(34,211,238,0.15)]')}>
      <h3 className={clsx('text-gray-400', 'text-sm')}>{title}</h3>
      <p className={clsx('text-3xl', 'font-semibold', 'text-cyan-300', 'mt-2', 'drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]')}>
        {value}
      </p>
      {subtitle && <p className={clsx('text-xs', 'text-gray-500', 'mt-1')}>{subtitle}</p>}
    </div>
  );
}
