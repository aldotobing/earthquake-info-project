import React from "react";

const Button = ({ className, children, ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors 
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
      disabled:opacity-50 disabled:pointer-events-none
      ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };
