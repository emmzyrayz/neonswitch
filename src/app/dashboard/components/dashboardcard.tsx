import clsx from "clsx";

interface DashboardCardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className={clsx('bg-[#1a1a1a]', 'p-6', 'rounded-xl', 'shadow-neonGreen', 'hover:shadow-neonCyan', 'transition-all', 'duration-300')}>
      <h3 className={clsx('text-neonGreen', 'font-bold', 'text-lg', 'mb-2')}>{title}</h3>
      <p className={clsx('text-white', 'text-sm', 'mb-4')}>{description}</p>
      {children}
    </div>
  );
};

export default DashboardCard;
