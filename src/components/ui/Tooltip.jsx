import React, { useState, useRef, useEffect } from "react";

const Tooltip = ({
  children,
  text,
  position = "top",
  delay = 300,
  width = "auto",
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef(null);
  const targetRef = useRef(null);
  const timerRef = useRef(null);

  // Position classes
  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-1",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-1",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-1",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-1",
  };

  // Arrow position classes
  const arrowClasses = {
    top: "bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-l-transparent border-r-transparent border-b-0",
    bottom:
      "top-0 left-1/2 transform -translate-x-1/2 -translate-y-full border-l-transparent border-r-transparent border-t-0",
    left: "right-0 top-1/2 transform translate-x-full -translate-y-1/2 border-t-transparent border-b-transparent border-r-0",
    right:
      "left-0 top-1/2 transform -translate-x-full -translate-y-1/2 border-t-transparent border-b-transparent border-l-0",
  };

  // Handle mouse events
  const handleMouseEnter = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      ref={targetRef}
    >
      {children}

      {isVisible && text && (
        <div
          className={`absolute z-50 pointer-events-none ${positionClasses[position]} ${className}`}
          ref={tooltipRef}
          style={{ width: width }}
        >
          <div className="relative">
            <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-md">
              {text}
            </div>
            <div
              className={`absolute w-0 h-0 border-4 border-gray-800 ${arrowClasses[position]}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
