// src/components/board/Pagination.tsx
import React from "react";

export default function Pagination({
  currentPage,
  totalPages,
  onChange,
}: {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  return (
    <div className="flex justify-center mt-6 mb-4">
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`w-8 h-8 flex items-center justify-center rounded-full !rounded-button ${
            currentPage === 1 ? "text-gray-400" : "text-gray-700"
          }`}
        >
          <i className="fas fa-chevron-left text-xs"></i>
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onChange(page)}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm !rounded-button ${
              currentPage === page
                ? "bg-[#1A1E27] text-white"
                : "text-gray-700"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`w-8 h-8 flex items-center justify-center rounded-full !rounded-button ${
            currentPage === totalPages ? "text-gray-400" : "text-gray-700"
          }`}
        >
          <i className="fas fa-chevron-right text-xs"></i>
        </button>
      </div>
    </div>
  );
}
