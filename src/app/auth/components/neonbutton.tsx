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
      className={`bg-neonPink text-black px-6 py-2 rounded-md font-bold tracking-wide shadow-neonPink hover:shadow-neonPinkGlow transition-all duration-300 ${className}`}
    >
      {children}
    </button>
  );
};

export default NeonButton;