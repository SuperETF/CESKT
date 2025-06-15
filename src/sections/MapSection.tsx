import React from "react";
import SvgKoreaMap from "../components/SvgKoreaMap"; // 실제 경로로!

interface MapSectionProps {
  selectedRegion?: string | null;
  onRegionClick: (region: string) => void;
}

export default function MapSection({
  selectedRegion = null,
  onRegionClick,
}: MapSectionProps) {
  return (
    <section className="py-15 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#1A1B35] mb-2">
          지역별 인증 전문가 찾기
        </h2>
        <p className="text-gray-600">한국 전역의 인증된 트레이너를 확인해보세요</p>
      </div>

      <div className="relative bg-white rounded-xl shadow-lg p-4 h-[50vh] mb-8 flex items-center justify-center">
        {/* SVG 지도 컴포넌트 */}
        <div className="w-full h-full flex items-center justify-center">
          <SvgKoreaMap
            selectedRegion={selectedRegion}
            onRegionClick={onRegionClick}
          />
        </div>

        {/* 등급 설명 박스 */}
        <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg shadow-sm text-sm z-10">
          <div className="font-semibold mb-2">자격증 레벨</div>
          <div className="text-xs text-gray-700 space-y-1">
            <div>
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2" />
              마스터 트레이너
            </div>
            <div>
              <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2" />
              전문 트레이너
            </div>
            <div>
              <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2" />
              일반 트레이너
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
