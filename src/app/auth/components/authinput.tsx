import clsx from "clsx";
import React from "react";

interface AuthInputProps {
  label: string;
  type?: string;
  placeholder?: string;
}

const AuthInput: React.FC<AuthInputProps> = ({
  label,
  type = "text",
  placeholder,
}) => {
  return (
    <div className={clsx('flex', 'flex-col', 'mb-4')}>
      <label className={clsx('text-neonGreen', 'mb-1', 'font-mono')}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className={clsx('px-4', 'py-2', 'rounded-md', 'bg-[#1a1a1a]', 'border', 'border-neonGreen', 'focus:border-neonCyan', 'focus:ring-2', 'focus:ring-neonGreen', 'text-white', 'outline-none', 'transition-all', 'duration-300')}
      />
    </div>
  );
};

export default AuthInput;
