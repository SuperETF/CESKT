import React from "react";

interface Trainer {
  id: string;
  name: string;
  specialty: string[] | null;
  location: string | null;
  image?: string | null;
  introduction?: string | null;
}

interface Props {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onClose: () => void;
  trainers: Trainer[];
}

const recentSearches = ["요가 트레이너", "헬스장 추천", "필라테스 강남", "재활운동 전문가"];

const popularCategories = {
  트레이너: ["헬스 트레이너", "요가 강사", "필라테스 강사", "재활 트레이너"],
  운동종류: ["헬스", "요가", "필라테스", "재활운동", "크로스핏"],
  지역: ["강남구", "서초구", "마포구", "송파구", "분당구"],
};

export default function SearchModal({ searchQuery, setSearchQuery, onClose, trainers }: Props) {
  const filtered = trainers.filter((t) =>
    [
      t.name,
      t.location,
      ...(Array.isArray(t.specialty) ? t.specialty : [t.specialty]),
    ]
      .filter(Boolean)
      .some((v) =>
        typeof v === "string" && v.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 px-4 z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl">
        <div className="p-4 border-b border-gray-100">
          <div className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="트레이너, 운동, 지역 검색"
              className="w-full bg-gray-50 pl-10 pr-4 py-3 rounded-lg text-sm outline-none"
            />
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>

          {!searchQuery ? (
            <>
              {/* 최근 검색어 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-700">최근 검색어</h3>
                  <button className="text-xs text-gray-500 hover:text-gray-700">전체 삭제</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(search)}
                      className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs hover:bg-gray-200 !rounded-button"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* 인기 카테고리 */}
              {Object.entries(popularCategories).map(([category, items]) => (
                <div key={category} className="mb-6 last:mb-0">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">{category}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {items.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => setSearchQuery(item)}
                        className="bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm text-left hover:bg-gray-100 !rounded-button"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="py-4">
              <h3 className="text-sm font-bold text-gray-700 mb-3">
                “{searchQuery}” 검색 결과 ({filtered.length}명)
              </h3>
              {filtered.length === 0 ? (
                <p className="text-gray-500 text-sm">일치하는 트레이너가 없습니다.</p>
              ) : (
                <div className="space-y-3 max-h-[320px] overflow-y-auto">
                  {filtered.map((trainer) => (
                    <div
                      key={trainer.id}
                      className="flex gap-3 items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                      // onClick={() => navigate(`/trainers/${trainer.id}`)}
                    >
                      <img
                        src={trainer.image || "https://placehold.co/60x60?text=Trainer"}
                        alt={trainer.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900">{trainer.name}</div>
                        <div className="text-xs text-gray-600">{trainer.specialty?.join(", ")}</div>
                        <div className="text-xs text-gray-500">{trainer.location}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full bg-[#1A1B35] text-white py-3 rounded-lg font-semibold hover:bg-[#2A2B45] transition-colors !rounded-button"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
