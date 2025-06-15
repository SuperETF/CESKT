import { useRef, useState } from "react";

import HeroSection from "../sections/HeroSection";
import MapSection from "../sections/MapSection";
import TrainerDirectory from "../sections/TrainerDirectory";
import FacilitySection from "../sections/FacilitySection";
import BoardSection from "../sections/BoardSection";
import SearchModal from "../components/SearchModal";
import RegionTrainerModal from "../components/RegionTrainerModal";
import FadeInSection from "../components/FadeInSection";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("");

  // ✅ TrainerDirectory로 스크롤 이동을 위한 ref
  const trainerRef = useRef<HTMLDivElement>(null);

  const scrollToTrainerSection = () => {
    if (trainerRef.current) {
      const offsetTop = trainerRef.current.offsetTop;
      const offset = 100; // 필요에 따라 60~120 사이로 조절
  
      window.scrollTo({
        top: offsetTop - offset,
        behavior: "smooth",
      });
    }
  };
  

  const regionTrainers = {
    서울: [
      { name: "김준호", specialty: "헬스 트레이닝", experience: "7년", rating: 4.9 },
      { name: "이미나", specialty: "필라테스", experience: "5년", rating: 4.8 },
    ],
    부산: [
      { name: "박성민", specialty: "재활운동", experience: "6년", rating: 4.7 },
      { name: "정유진", specialty: "요가", experience: "8년", rating: 4.9 },
    ],
  };

  return (
    <div className="pb-28 space-y-12 px-4 relative">
      {/* ✅ HeroSection: 버튼 클릭 시 TrainerDirectory로 이동 */}
      <HeroSection onFindTrainerClick={scrollToTrainerSection} />

      <FadeInSection delay={0.1}>
        <MapSection
          onRegionClick={(region) => {
            setSelectedRegion(region);
            setShowRegionModal(true);
          }}
        />
      </FadeInSection>

      <FadeInSection delay={0.2}>
        <div ref={trainerRef}>
          <TrainerDirectory
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </FadeInSection>

      <FadeInSection delay={0.3}>
        <FacilitySection />
      </FadeInSection>

      <FadeInSection delay={0.4}>
        <BoardSection />
      </FadeInSection>

      {/* ✅ FAB 버튼 */}
      <button
        onClick={() => setShowSearchModal(true)}
        className="fixed right-4 bottom-[88px] bg-[#1A1B35] text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center z-40 hover:bg-[#2A2B45] transition"
      >
        <i className="fas fa-search text-xl" />
      </button>

      {showSearchModal && (
        <SearchModal
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onClose={() => setShowSearchModal(false)}
        />
      )}

      {showRegionModal && (
        <RegionTrainerModal
          region={selectedRegion}
          trainers={
            regionTrainers[selectedRegion as keyof typeof regionTrainers] || []
          }
          onClose={() => setShowRegionModal(false)}
        />
      )}
    </div>
  );
}
