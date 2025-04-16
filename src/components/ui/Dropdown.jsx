import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

// Create a context for the dropdown state
const DropdownContext = createContext(null);

export const DropdownMenu = ({
  children,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
}) => {
  // State for uncontrolled usage
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);

  // Determine if we're in controlled or uncontrolled mode
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  // Function to toggle open state
  const toggle = () => {
    if (isControlled) {
      onOpenChange?.(!open);
    } else {
      setUncontrolledOpen(!open);
    }
  };

  // Close dropdown when clicking outside
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (isControlled) {
          onOpenChange?.(false);
        } else {
          setUncontrolledOpen(false);
        }
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open, isControlled, onOpenChange]);

  return (
    <DropdownContext.Provider value={{ open, toggle, dropdownRef }}>
      <div ref={dropdownRef} className="relative">
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

export const DropdownMenuTrigger = ({ children, className = "", ...props }) => {
  const { toggle } = useContext(DropdownContext);

  return React.cloneElement(React.Children.only(children), {
    onClick: (e) => {
      e.preventDefault();
      toggle();
      children.props.onClick?.(e);
    },
    className: `${children.props.className || ""} ${className}`,
    ...props,
  });
};

export const DropdownMenuContent = ({
  children,
  className = "",
  align = "end",
  sideOffset = 4,
  ...props
}) => {
  const { open, dropdownRef } = useContext(DropdownContext);
  const contentRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Calculate position of the dropdown menu
  useEffect(() => {
    if (open && dropdownRef.current && contentRef.current) {
      const triggerRect = dropdownRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();

      let top = triggerRect.bottom + sideOffset + window.scrollY;
      let left;

      // Horizontal positioning based on alignment
      if (align === "start") {
        left = triggerRect.left + window.scrollX;
      } else if (align === "end") {
        left = triggerRect.right - contentRect.width + window.scrollX;
      } else {
        // center
        left =
          triggerRect.left +
          triggerRect.width / 2 -
          contentRect.width / 2 +
          window.scrollX;
      }

      // Check if dropdown would go out of viewport
      if (left < 0) left = 0;
      if (left + contentRect.width > window.innerWidth) {
        left = window.innerWidth - contentRect.width - 8;
      }

      // Check if it would go below viewport and flip upward if needed
      if (top + contentRect.height > window.innerHeight + window.scrollY) {
        top =
          triggerRect.top - contentRect.height - sideOffset + window.scrollY;
      }

      setPosition({ top, left });
    }
  }, [open, align, sideOffset]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      ref={contentRef}
      style={{
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 50,
        minWidth: "10rem",
      }}
      className={`
        bg-white rounded-md shadow-lg overflow-hidden border border-gray-200
        animate-in fade-in-50 zoom-in-95 
        ${className}
      `}
      {...props}
    >
      {children}
    </div>,
    document.body
  );
};

export const DropdownMenuItem = ({
  children,
  onClick,
  disabled = false,
  className = "",
  ...props
}) => {
  const { toggle } = useContext(DropdownContext);

  const handleClick = (e) => {
    if (disabled) return;
    onClick?.(e);
    toggle();
  };

  return (
    <div
      className={`
        px-3 py-2 text-sm cursor-pointer flex items-center
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}
        ${className}
      `}
      onClick={handleClick}
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      {children}
    </div>
  );
};

export const DropdownMenuCheckboxItem = ({
  children,
  checked,
  onCheckedChange,
  disabled = false,
  className = "",
  ...props
}) => {
  const handleChange = (e) => {
    if (disabled) return;
    onCheckedChange(!checked);
  };

  return (
    <div
      className={`
        px-3 py-2 text-sm cursor-pointer flex items-center
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}
        ${className}
      `}
      onClick={handleChange}
      role="menuitemcheckbox"
      aria-checked={checked}
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      <div className="mr-2 h-4 w-4 flex items-center justify-center">
        {checked ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        ) : null}
      </div>
      {children}
    </div>
  );
};

export const DropdownMenuLabel = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`
        px-3 py-2 text-xs font-semibold text-gray-500
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const DropdownMenuSeparator = ({ className = "", ...props }) => {
  return (
    <div
      className={`
        h-px bg-gray-200 my-1
        ${className}
      `}
      role="separator"
      {...props}
    />
  );
};

export const DropdownMenuGroup = ({ children, className = "", ...props }) => {
  return (
    <div className={className} role="group" {...props}>
      {children}
    </div>
  );
};

// Simple preset button with dropdown
export const DropdownButton = ({
  children,
  buttonText,
  icon,
  buttonClassName = "",
  contentClassName = "",
  align = "end",
  ...props
}) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} {...props}>
      <DropdownMenuTrigger>
        <button
          className={`
            flex items-center justify-center gap-2 px-3 py-2 
            bg-white border border-gray-300 rounded-md 
            hover:bg-gray-50 focus:outline-none
            ${buttonClassName}
          `}
        >
          {icon}
          {buttonText}
          <ChevronDown
            className={`h-4 w-4 ${
              open ? "transform rotate-180" : ""
            } transition-transform`}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={contentClassName}>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
