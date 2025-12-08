import clsx from "clsx";

const Footer = () => {
  return (
    <footer
      className={clsx(
        "w-full",
        "bg-[#0f0f0f]",
        "p-3",
        "md:p-4",
        "mt-auto",
        "text-center",
        "text-white",
        "shadow-muted"
      )}
    >
      <p className={clsx("text-xs", "md:text-sm", "text-soft")}>
        &copy; 2025 NeonSwitch. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;