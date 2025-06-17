import { Helmet } from "react-helmet-async";
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
  specialty: string[];
  location: string;
  image?: string;
  introduction?: string;
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  const [trainers, setTrainers] = useState<LocalTrainer[]>([]);
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
    <>
      {/* ✅ SEO & OG 태그 */}
      <Helmet>
  <title>CESKT | 검증된 전문가를 찾는다면</title>
  <meta
    name="description"
    content="대한민국 실력 검증된 트레이너를 확인하세요."
  />
  <link rel="canonical" href="https://www.ceskt.kr/" />

  {/* ✅ Open Graph */}
  <meta property="og:type" content="website" />
  <meta property="og:title" content="CESKT | 검증된 전문가를 찾는다면" />
  <meta property="og:description" content="대한민국 실력 검증된 트레이너를 확인하세요." />
  <meta property="og:image" content="https://hecvitgoogsethejrktx.supabase.co/storage/v1/object/public/trainer/CESK.png" />
  <meta property="og:url" content="https://www.ceskt.kr/" />

  {/* ✅ Twitter Preview */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="CESKT | 검증된 전문가를 찾는다면" />
  <meta name="twitter:description" content="대한민국 실력 검증된 트레이너를 확인하세요." />
  <meta name="twitter:image" content="https://hecvitgoogsethejrktx.supabase.co/storage/v1/object/public/trainer/CESK.png" />
</Helmet>

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

        {/* 🔍 Search Modal */}
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

        {/* 📍 지역별 트레이너 모달 */}
        {showRegionModal && (
          <RegionTrainerModal
            region={selectedRegion}
            trainers={trainers
              .filter((t) => t.location?.includes(selectedRegion))
              .map((t) => ({
                ...t,
                specialty: t.specialty.join(", "),
                experience: "0",
                rating: 0,
              }))}
            onClose={() => setShowRegionModal(false)}
            isMobile={false}
          />
        )}
      </div>
    </>
  );
}
