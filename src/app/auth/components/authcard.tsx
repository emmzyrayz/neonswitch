import clsx from "clsx";
import React from "react";

const AuthCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={clsx('max-w-md', 'w-full', 'bg-black/30', 'p-6', 'md:p-8', 'mx-6', 'rounded-xl', 'shadow-soft')}>
      {children}
    </div>
  );
};

export default AuthCard;
