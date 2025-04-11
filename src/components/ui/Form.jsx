import { useState } from "react";
import { Eye, EyeOff, AlertTriangle, CheckCircle, X } from "lucide-react";

// Form container component
export const Form = ({ children, onSubmit, className = "" }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {children}
    </form>
  );
};

// Form section component for grouping fields
export const FormSection = ({
  title,
  description,
  children,
  className = "",
}) => {
  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
      {(title || description) && (
        <div className="px-4 py-4 sm:px-6 border-b border-gray-200">
          {title && (
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}
      <div className="px-4 py-5 sm:p-6">{children}</div>
    </div>
  );
};

// Form row component for layout
export const FormRow = ({ className = "", children }) => {
  return (
    <div
      className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className}`}
    >
      {children}
    </div>
  );
};

// Form group component for individual fields
export const FormGroup = ({
  label,
  htmlFor,
  error,
  required,
  className = "",
  helpText,
  children,
}) => {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

// Input field component
export const Input = ({
  type = "text",
  id,
  name,
  value,
  onChange,
  placeholder,
  required,
  disabled,
  className = "",
  error,
  min,
  max,
  step,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="relative">
      <input
        type={inputType}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className={`form-input ${
          error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : ""
        } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""} ${className}`}
        {...props}
      />

      {type === "password" && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-gray-400" />
          ) : (
            <Eye className="h-5 w-5 text-gray-400" />
          )}
        </button>
      )}
    </div>
  );
};

// Select component
export const Select = ({
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  required,
  disabled,
  className = "",
  error,
  ...props
}) => {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={`form-select ${
        error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : ""
      } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""} ${className}`}
      {...props}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

// Textarea component
export const Textarea = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  required,
  disabled,
  rows = 3,
  className = "",
  error,
  ...props
}) => {
  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      rows={rows}
      className={`form-textarea ${
        error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : ""
      } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""} ${className}`}
      {...props}
    ></textarea>
  );
};

// Checkbox component
export const Checkbox = ({
  id,
  name,
  checked,
  onChange,
  label,
  disabled,
  className = "",
  ...props
}) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        } ${className}`}
        {...props}
      />
      {label && (
        <label htmlFor={id} className="ml-2 block text-sm text-gray-700">
          {label}
        </label>
      )}
    </div>
  );
};

// Radio group component
export const RadioGroup = ({
  id,
  name,
  value,
  onChange,
  options = [],
  required,
  disabled,
  className = "",
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`} {...props}>
      {options.map((option) => (
        <div key={option.value} className="flex items-center">
          <input
            id={`${id}-${option.value}`}
            name={name}
            type="radio"
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={`h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500 ${
              disabled ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
          <label
            htmlFor={`${id}-${option.value}`}
            className="ml-2 block text-sm text-gray-700"
          >
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
};

// Submit button component
export const SubmitButton = ({
  children,
  loading,
  loadingText = "Processing...",
  disabled,
  className = "",
  ...props
}) => {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={`btn btn-primary ${
        loading || disabled ? "opacity-70 cursor-not-allowed" : ""
      } ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

// Button component for non-submit buttons
export const Button = ({
  children,
  type = "button",
  variant = "default",
  loading,
  loadingText = "Processing...",
  disabled,
  className = "",
  ...props
}) => {
  // Define button styles based on variant
  const variantStyles = {
    default: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
    primary: "bg-primary-600 text-white hover:bg-primary-700",
    secondary: "bg-secondary-600 text-white hover:bg-secondary-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    warning: "bg-yellow-600 text-white hover:bg-yellow-700",
    info: "bg-blue-600 text-white hover:bg-blue-700",
    link: "text-primary-600 hover:text-primary-700 bg-transparent hover:bg-transparent",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`btn ${variantStyles[variant]} ${
        loading || disabled ? "opacity-70 cursor-not-allowed" : ""
      } ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

// Form alert component for success/error messages
export const FormAlert = ({
  type = "info",
  title,
  message,
  onClose,
  className = "",
}) => {
  // Define alert styles based on type
  const alertStyles = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error: "bg-red-50 border-red-200 text-red-800",
  };

  // Define icon based on type
  const AlertIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div
      className={`rounded-md p-4 border ${alertStyles[type]} ${className}`}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertIcon />
        </div>
        <div className="ml-3 flex-1">
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          {message && <p className="text-sm mt-1">{message}</p>}
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              className="inline-flex bg-transparent rounded-md p-1 hover:bg-white text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
