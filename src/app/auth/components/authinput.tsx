import clsx from "clsx";
import React from "react";

interface AuthInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  options?: Array<{ value: string; label: string }>;
  required?: boolean;
  name?: string;
  error?: string;
  disabled?: boolean;
}

const AuthInput: React.FC<AuthInputProps> = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  options,
  required = false,
  name,
  error,
  disabled = false,
}) => {
  const disabledClasses = "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-800";

  // Render select if options are provided
  if (options && type === "select") {
    return (
      <div className={clsx('flex', 'flex-col', 'mb-4')}>
        <label className={clsx('text-muted', 'mb-1', 'font-mono')}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={clsx(
            'px-4',
            'py-2',
            'rounded-md',
            'bg-[#1a1a1a]',
            'border',
            error ? 'border-red-500' : 'border-soft',
            'focus:border-muted',
            'focus:ring-2',
            'focus:ring-soft',
            'text-white',
            'outline-none',
            'transition-all',
            'duration-500',
            'appearance-none',
            'cursor-pointer',
            disabledClasses
          )}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div className={clsx('flex', 'flex-col', 'mb-4')}>
      <label className={clsx('text-muted', 'mb-1', 'font-mono', 'md:text-[16px] text-[14px]')}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={clsx(
          'md:px-4 px-2',
          'md:py-2 py-1',
          'rounded-md',
          'bg-[#1a1a1a]',
          'border',
          error ? 'border-red-500' : 'border-soft',
          'focus:border-muted',
          'focus:ring-2',
          'focus:ring-soft',
          'text-white',
          'outline-none',
          'transition-all',
          'duration-300',
          disabledClasses
        )}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default AuthInput;