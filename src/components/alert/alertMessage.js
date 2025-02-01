import React from "react";

export const Alert = ({ variant = "error", children }) => {
  const styles = {
    error: "bg-red-50 border border-red-400 text-red-700",
    success: "bg-green-50 border border-green-400 text-green-700",
    warning: "bg-yellow-50 border border-yellow-400 text-yellow-700",
  };

  return (
    <div className={`${styles[variant]} px-4 py-3 rounded relative`}>
      {children}
    </div>
  );
};
