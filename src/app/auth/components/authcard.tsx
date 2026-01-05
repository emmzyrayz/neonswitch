import clsx from "clsx";
import React from "react";

const AuthCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={clsx('max-w-md', 'md:w-full w-[80%]  flex flex-col items-center justify-center', 'bg-black/50', 'p-4', 'md:p-8', 'md:mx-6', 'rounded-xl', 'shadow-soft')}>
      {children}
    </div>
  );
};

export default AuthCard;
