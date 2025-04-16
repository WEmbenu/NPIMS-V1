import React from "react";
import { Loader2 } from "lucide-react";

const Loader = ({
  size = "md",
  title = "Loading...",
  showText = true,
  inline = false,
  className = "",
  white = false,
}) => {
  // Size variants for the spinner
  const sizeVariants = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  // Text size based on spinner size
  const textSizeVariants = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  return (
    <div
      className={`
      ${inline ? "inline-flex" : "flex"} 
      ${inline ? "items-center" : "flex-col items-center justify-center"} 
      ${className}
    `}
    >
      <Loader2
        className={`
          animate-spin 
          ${sizeVariants[size]} 
          ${white ? "text-white" : "text-cyan-600"}
        `}
      />
      {showText && (
        <p
          className={`
          mt-2 
          ${textSizeVariants[size]} 
          ${inline ? "ml-2 mt-0" : ""} 
          ${white ? "text-white" : "text-gray-600"}
        `}
        >
          {title}
        </p>
      )}
    </div>
  );
};

export default Loader;
