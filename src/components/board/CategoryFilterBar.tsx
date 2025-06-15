// src/components/board/CategoryFilterBar.tsx
import React from "react";

export default function CategoryFilterBar({
  categories,
  active,
  onChange,
}: {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
}) {
  return (
    <div className="overflow-x-auto py-3 -mx-4 scrollbar-hide">
      <div className="flex px-4 space-x-2 min-w-max">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap !rounded-button ${
              active === category
                ? "bg-[#1A1E27] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => onChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
