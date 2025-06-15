import React, { useState } from "react";

interface TooltipWithIconProps {
  iconClass?: string; // default: "fas fa-info-circle"
  tooltipText?: string;
  tooltipContent?: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  size?: "sm" | "md" | "lg";
}

const positionClasses = {
  top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
  bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
  left: "right-full mr-2 top-1/2 -translate-y-1/2",
  right: "left-full ml-2 top-1/2 -translate-y-1/2",
};

const sizeClasses = {
  sm: "text-xs px-2 py-1",
  md: "text-sm px-3 py-2",
  lg: "text-base px-4 py-3",
};

export default function TooltipWithIcon({
  iconClass = "fas fa-info-circle",
  tooltipText,
  tooltipContent,
  position = "top",
  size = "md",
}: TooltipWithIconProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative inline-block group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <i className={`${iconClass} text-gray-500 hover:text-[#1A1B35] transition`} />

      {hovered && (
        <div
          className={`
            absolute z-50
            ${positionClasses[position]}
            bg-gray-800 text-white rounded-lg shadow-lg whitespace-pre-line
            ${sizeClasses[size]}
          `}
        >
          {tooltipContent ?? tooltipText}
        </div>
      )}
    </div>
  );
}
