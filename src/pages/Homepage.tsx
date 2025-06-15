// src/pages/HomePage.tsx
import HeroSection from "../sections/HeroSection";
import MapSection from "../sections/MapSection";
import TrainerDirectory from "../sections/TrainerDirectory";
import FacilitySection from "../sections/FacilitySection";
import BoardSection from "../sections/BoardSection";
import SearchModal from "../components/SearchModal";
import RegionTrainerModal from "../components/RegionTrainerModal";
import { useState } from "react";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("");

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
    <div className="pb-28">
      <HeroSection />
      <MapSection onRegionClick={(region) => {
        setSelectedRegion(region);
        setShowRegionModal(true);
      }} />
      <TrainerDirectory searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <FacilitySection />
      <BoardSection />

      {/* FAB */}
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
          trainers={regionTrainers[selectedRegion as keyof typeof regionTrainers] || []}
          onClose={() => setShowRegionModal(false)}
        />
      )}
    </div>
  );
}
