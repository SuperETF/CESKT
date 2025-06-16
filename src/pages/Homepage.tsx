import { useRef, useState } from "react";

import HeroSection from "../sections/HeroSection";
import MapSection from "../sections/MapSection";
import TrainerDirectory from "../sections/TrainerDirectory";
import FacilitySection from "../sections/FacilitySection";
import BoardSection from "../sections/BoardSection";
import SearchModal from "../components/SearchModal";
import RegionTrainerModal from "../components/RegionTrainerModal";
import FadeInSection from "../components/FadeInSection";

type Trainer = {
  id: string; // ✅ 상세 페이지 이동을 위한 고유 ID
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  image?: string;
};

type RegionTrainersMap = {
  [region: string]: Trainer[];
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  const trainerRef = useRef<HTMLDivElement>(null);

  const scrollToTrainerSection = () => {
    trainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ✅ Mock 데이터 (id 포함)
  const regionTrainers: RegionTrainersMap = {
    경상: [
      {
        id: "trainer-kim",
        name: "김준호",
        specialty: "헬스 트레이닝",
        experience: "7년",
        rating: 4.9,
        image: "https://via.placeholder.com/100x130?text=김준호",
      },
      {
        id: "trainer-lee",
        name: "이미나",
        specialty: "필라테스",
        experience: "5년",
        rating: 4.8,
      },
    ],
    부산: [
      {
        id: "trainer-park",
        name: "박성민",
        specialty: "재활운동",
        experience: "6년",
        rating: 4.7,
      },
      {
        id: "trainer-jung",
        name: "정유진",
        specialty: "요가",
        experience: "8년",
        rating: 4.9,
      },
    ],
  };

  return (
    <div className="w-full max-w-[900px] mx-auto pb-28 space-y-12 px-0 relative">
      <HeroSection onFindTrainerClick={scrollToTrainerSection} />

      <FadeInSection delay={0.1}>
        <MapSection
          onRegionClick={(region: string) => {
            setSelectedRegion(region);
            setShowRegionModal(true);
          }}
        />
      </FadeInSection>

      <FadeInSection delay={0.2}>
        <div ref={trainerRef} className="scroll-mt-28">
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

      {/* 🔍 FAB 검색 버튼 */}
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
          trainers={regionTrainers[selectedRegion] || []}
          onClose={() => setShowRegionModal(false)}
          isMobile={false}
        />
      )}
    </div>
  );
}
