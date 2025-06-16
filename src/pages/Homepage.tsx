import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";

import HeroSection from "../sections/HeroSection";
import MapSection from "../sections/MapSection";
import TrainerDirectory from "../sections/TrainerDirectory";
import FacilitySection from "../sections/FacilitySection";
import BoardSection from "../sections/BoardSection";
import SearchModal from "../components/SearchModal";
import RegionTrainerModal from "../components/RegionTrainerModal";
import FadeInSection from "../components/FadeInSection";
import type { Trainer as ImportedTrainer, Trainer } from "../types/Trainer";

type LocalTrainer = {
  id: string;
  name: string;
  specialty: string[]; // ✅ 배열로 정확히
  location: string;
  image?: string;
  introduction?: string;
};

type RegionTrainersMap = {
  [region: string]: Trainer[];
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  const [trainers, setTrainers] = useState<LocalTrainer[]>([]); // ✅ Supabase trainers 상태

  const trainerRef = useRef<HTMLDivElement>(null);

  const scrollToTrainerSection = () => {
    trainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const fetchTrainers = async () => {
      const { data, error } = await supabase
        .from("trainers")
        .select("id, name, specialty, location, image, introduction");

      if (error) {
        console.error("트레이너 데이터 오류:", error.message);
      } else {
        setTrainers(data || []);
      }
    };

    fetchTrainers();
  }, []);

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

      {/* 🔍 Search Modal - 실시간 검색 결과 */}
      {showSearchModal && (
        <SearchModal
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onClose={() => {
            setSearchQuery("");
            setShowSearchModal(false);
          }}
          trainers={trainers}
        />
      )}

      {/* 📍 지역 트레이너 모달 (MapSection 연동) */}
      {showRegionModal && (
        <RegionTrainerModal
          region={selectedRegion}
          trainers={trainers
            .filter((t: LocalTrainer) => t.location?.includes(selectedRegion))
            .map((t: LocalTrainer) => ({
              ...t,
              specialty: t.specialty.join(", "), // Convert array to string
              experience: "0", // Default or derived value converted to string
              rating: 0, // Default or derived value
            }))}
          onClose={() => setShowRegionModal(false)}
          isMobile={false}
        />
      )}
    </div>
  );
}
