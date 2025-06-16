import { useEffect, useState } from "react";
import SvgKoreaMap from "../components/SvgKoreaMap";
import RegionTrainerModal from "../components/RegionTrainerModal";
import { supabase } from "../lib/supabaseClient";

interface Trainer {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  region: string;
  image?: string;
}

interface MapSectionProps {
  selectedRegion?: string | null;
  onRegionClick: (region: string) => void;
}

export default function MapSection({
  selectedRegion = null,
  onRegionClick,
}: MapSectionProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [clickedRegion, setClickedRegion] = useState<string | null>(null);
  const [isHoveringModal, setIsHoveringModal] = useState(false);
  const [trainers, setTrainers] = useState<Trainer[]>([]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const targetRegion = isMobile ? clickedRegion : hoveredRegion;
    if (!targetRegion) return;

    const fetchTrainers = async () => {
      const { data, error } = await supabase
        .from("trainers")
        .select("id, name, specialty, experience, rating, region, image")
        .eq("region", targetRegion);

      if (error) {
        console.error("트레이너 불러오기 오류:", error.message);
        setTrainers([]);
      } else {
        setTrainers(data || []);
      }
    };

    fetchTrainers();
  }, [clickedRegion, hoveredRegion, isMobile]);

  return (
    <section className="py-15 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#1A1B35] mb-2">
          지역별 인증 전문가 찾기
        </h2>
        <p className="text-gray-600">한국 전역의 인증된 트레이너를 확인해보세요</p>
      </div>

      <div className="relative bg-white rounded-xl shadow-lg p-4 h-[50vh] mb-8 flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          <SvgKoreaMap
            className="w-full max-w-[400px] h-auto"
            selectedRegion={selectedRegion}
            isMobile={isMobile}
            isHoveringModal={isHoveringModal}
            onRegionClick={(region) => {
              if (isMobile) setClickedRegion(region);
              else setHoveredRegion(region);
            }}
            onRegionLeave={() => {
              if (!isMobile && !isHoveringModal) setHoveredRegion(null);
            }}
            isHoveredRegion={(region) => hoveredRegion === region}
          />
        </div>

        <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg shadow-sm text-sm z-10">
          <div className="font-semibold mb-2">자격증 레벨</div>
          <div className="text-xs text-gray-700 space-y-1">
            <div>
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2" />
              CESK 강사
            </div>
            <div>
              <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2" />
              교정운동전문가
            </div>
            <div>
              <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2" />
              퍼스널 트레이너
            </div>
          </div>
        </div>
      </div>

      {isMobile && clickedRegion && (
        <RegionTrainerModal
          region={clickedRegion}
          trainers={trainers}
          onClose={() => setClickedRegion(null)}
          isMobile={isMobile}
        />
      )}

      {!isMobile && hoveredRegion && (
        <RegionTrainerModal
          region={hoveredRegion}
          trainers={trainers}
          onClose={() => setHoveredRegion(null)}
          isMobile={isMobile}
          onHoverChange={(hovering) => setIsHoveringModal(hovering)}
        />
      )}
    </section>
  );
}
