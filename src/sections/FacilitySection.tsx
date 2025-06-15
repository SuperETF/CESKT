import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Facility {
  id: string;
  name: string;
  address: string;
  hours: string;
  image_url: string;
  link_url?: string;
}

export default function FacilitySection() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFacilities = async () => {
      const { data, error } = await supabase
        .from("facilities")
        .select("id, name, address, hours, image_url, link_url")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("시설 데이터 불러오기 실패:", error.message);
      } else {
        setFacilities(data || []);
      }

      setLoading(false);
    };

    fetchFacilities();
  }, []);

  const scrollByCard = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const card = container.querySelector(".snap-start") as HTMLElement;
    if (card) {
      const cardWidth = card.offsetWidth + 16; // 카드 간 간격 포함
      container.scrollBy({
        left: direction === "left" ? -cardWidth : cardWidth,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">시설 정보를 불러오는 중...</div>;
  }

  return (
    <section className="relative w-full py-8 px-4 bg-white">
      <h2 className="text-2xl font-bold text-[#1A1B35] mb-4">제휴 운동시설</h2>

      <div className="relative">
        {/* 좌우 화살표 */}
        <button
          onClick={() => scrollByCard("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 shadow-md rounded-full p-2"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={() => scrollByCard("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 shadow-md rounded-full p-2"
        >
          <FaChevronRight />
        </button>

        {/* 스크롤 영역 */}
        <div
  ref={scrollRef}
  className="flex overflow-x-auto gap-4 snap-x snap-mandatory scroll-smooth px-1 scrollbar-hide"
>
          {facilities.map((facility) => (
            <div
              key={facility.id}
              className="min-w-[280px] max-w-[280px] flex-shrink-0 snap-start cursor-pointer"
              onClick={() => facility.link_url && window.open(facility.link_url, "_blank")}
            >
              <div className="w-full h-40 rounded-lg overflow-hidden mb-2 shadow-md bg-gray-100">
                <img
                  src={facility.image_url}
                  alt={facility.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  style={{ imageRendering: "auto" }}
                />
              </div>
              <h3 className="font-bold text-base text-[#1A1B35] truncate">{facility.name}</h3>
              <p className="text-xs text-gray-600 truncate">
                <i className="fas fa-map-marker-alt mr-1" /> {facility.address}
              </p>
              <p className="text-xs text-gray-600">
                <i className="fas fa-clock mr-1" /> {facility.hours}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
