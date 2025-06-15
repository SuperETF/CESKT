// src/components/board/SearchAndSortBar.tsx
import React from "react";

export default function SearchAndSortBar({
  searchQuery,
  setSearchQuery,
  sortOption,
  setSortOption,
  sortOptions,
}: {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  sortOption: string;
  setSortOption: (v: string) => void;
  sortOptions: string[];
}) {
  return (
    <>
      <div className="relative">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-100 text-sm focus:outline-none border-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <i className="fas fa-search absolute left-3.5 top-3 text-gray-400"></i>
      </div>
      <div className="flex justify-end mt-3">
        <div className="relative">
          <select
            className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 pr-8 text-sm text-gray-700 focus:outline-none cursor-pointer"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <i className="fas fa-chevron-down absolute right-3 top-2.5 text-gray-400 pointer-events-none text-xs"></i>
        </div>
      </div>
    </>
  );
}
