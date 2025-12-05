import clsx from "clsx";

const Footer = () => {
  return (
    <footer className={clsx('w-full', 'bg-[#0f0f0f]', 'p-4', 'mt-auto', 'text-center', 'text-white', 'shadow-neonPink')}>
      <p className={clsx('text-sm', 'text-neonCyan')}>
        &copy; 2025 NeonSwitch. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
