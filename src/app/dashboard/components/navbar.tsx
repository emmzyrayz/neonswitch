import clsx from "clsx";

const Navbar = () => {
  return (
    <header className={clsx('w-full', 'bg-[#0f0f0f]', 'p-4', 'flex', 'justify-between', 'items-center', 'shadow-neonCyan')}>
      <h2 className={clsx('text-xl', 'font-bold', 'text-neonGreen')}>Dashboard</h2>
      <div className={clsx('flex', 'items-center', 'gap-4')}>
        <button className={clsx('px-4', 'py-2', 'bg-neonPink', 'rounded-md', 'shadow-neonPinkGlow', 'hover:shadow-neonPinkGlow', 'transition-all')}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
