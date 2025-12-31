import React from "react";

interface NeonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  onClick,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={`bg-primary hover:bg-muted/70 text-soft/40 hover:text-soft ease-in-out px-6 py-2 rounded-md font-bold tracking-wide shadow-soft/30 hover:shadow-neonPinkGlow transition-all duration-700 ${className}`}
    >
      {children}
    </button>
  );
};

export default NeonButton;