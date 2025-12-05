import clsx from "clsx";
import React from "react";

const AuthCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={clsx('max-w-md', 'w-full', 'bg-[#0f0f0f]', 'p-4', 'md:p-8', 'mx-6', 'rounded-xl', 'shadow-neonGreen')}>
      {children}
    </div>
  );
};

export default AuthCard;
