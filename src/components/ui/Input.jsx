import React, { forwardRef } from "react";
import { AlertCircle } from "lucide-react";

const Input = forwardRef(
  (
    {
      type = "text",
      label,
      placeholder,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className = "",
      containerClassName = "",
      required = false,
      disabled = false,
      fullWidth = false,
      variant = "default",
      size = "md",
      id,
      name,
      ...props
    },
    ref
  ) => {
    // Size classes
    const sizeClasses = {
      sm: "h-8 text-xs px-2",
      md: "h-10 text-sm px-3",
      lg: "h-12 text-base px-4",
    };

    // Variant specific classes
    const variantClasses = {
      default: `border ${
        error
          ? "border-red-500 focus:border-red-500"
          : "border-gray-300 focus:border-cyan-500"
      } rounded-md`,
      flush: `border-b ${
        error
          ? "border-red-500 focus:border-red-500"
          : "border-gray-300 focus:border-cyan-500"
      } rounded-none`,
      plain: "border-none bg-transparent",
    };

    // Icon padding adjustment
    const getIconPadding = () => {
      if (leftIcon && rightIcon) return "pl-9 pr-9";
      if (leftIcon) return "pl-9";
      if (rightIcon) return "pr-9";
      return "";
    };

    return (
      <div className={`${fullWidth ? "w-full" : ""} ${containerClassName}`}>
        {label && (
          <label
            htmlFor={id || name}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={type}
            id={id || name}
            name={name}
            className={`
            bg-white disabled:bg-gray-100 disabled:text-gray-500 
            w-full focus:outline-none focus:ring-0 transition-colors
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${getIconPadding()}
            ${error ? "text-red-500" : "text-gray-900"}
            ${className}
          `}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${id || name}-error` : undefined}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              {rightIcon}
            </div>
          )}

          {error && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>

        {(error || helperText) && (
          <div className="mt-1 text-xs">
            {error && (
              <p id={`${id || name}-error`} className="text-red-600">
                {error}
              </p>
            )}
            {helperText && !error && (
              <p className="text-gray-500">{helperText}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
