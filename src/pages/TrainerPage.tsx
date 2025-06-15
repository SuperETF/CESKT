import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomTabBar from "../components/BottomTabBar";
import { supabase } from "../lib/supabaseClient";
import { FaMapMarkerAlt, FaHistory } from "react-icons/fa";


interface Trainer {
  id: number;
  name: string;
  specialty: string[] | string | null;
  experience: string;
  rating: number;
  location: string;
  introduction: string;
  image: string;
}

export default function TrainerPage() {
  const [activeTab, setActiveTab] = useState("trainers");
  const [searchQuery, setSearchQuery] = useState("");
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainers = async () => {
      const { data, error } = await supabase.from("trainers").select("*");
      if (!error) setTrainers(data as Trainer[]);
      else console.error("트레이너 로드 실패", error.message);
    };
    fetchTrainers();
  }, []);

  // ✅ specialty 값 안전하게 문자열로 처리
  const getSpecialtyString = (s: Trainer["specialty"]) => {
    if (Array.isArray(s)) return s.join(", ");
    if (typeof s === "string") return s;
    return "전문 분야 미입력";
  };

  const filtered = trainers.filter((t) => {
    const specialtyStr = getSpecialtyString(t.specialty).toLowerCase();
    return (
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specialtyStr.includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="relative bg-gray-50 min-h-screen pb-28">
      {/* 상단 네비게이션 바 */}
      <div className="bg-[#1A1B35] text-white z-50 shadow-md">
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[960px] px-4 py-3 flex items-center justify-between">
            <button className="p-2" onClick={() => navigate(-1)}>
              <i className="fas fa-arrow-left text-lg"></i>
            </button>
            <div className="text-lg font-bold text-center flex-1">트레이너 찾기</div>
            <button className="p-2">
              <i className="fas fa-sliders-h text-lg"></i>
            </button>
          </div>
        </div>
      </div>

      {/* 검색 + 리스트 */}
      <div className="pt-5 max-w-[960px] mx-auto px-4">
        <div className="mb-4">
          <div className="flex w-full rounded-lg overflow-hidden border border-gray-300">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 text-sm outline-none"
              placeholder="트레이너 이름, 지역, 분야 검색"
            />
            <button className="px-4 bg-[#1A1B35] text-white">
              <i className="fas fa-search text-sm" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filtered.length > 0 ? (
            filtered.map((t) => (
              <div key={t.id} className="bg-white p-4 rounded-lg shadow-md flex transition-transform hover:-translate-y-1 duration-300 cursor-pointer">
                {/* ✅ 고정 비율 박스 */}
                <div className="w-[96px] h-[150px] rounded-lg overflow-hidden bg-gray-100 mr-4 flex-shrink-0">
                  <img
                    src={t.image || "https://placehold.co/96x150?text=No+Image"}
                    alt={t.name}
                    className="w-full h-full object-cover brightness-110"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">{t.name}</h3>
                    <div className="text-yellow-500 text-sm font-medium">
                      <i className="fas fa-star mr-1" />
                      {t.rating}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">
                    {getSpecialtyString(t.specialty)}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
    <FaMapMarkerAlt className="text-gray-400 text-xs" />
    {t.location}
  </p>
  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
    <FaHistory className="text-gray-400 text-xs" />
     {t.experience}
  </p>
                  <button
                    className="mt-2 w-full bg-[#1A1B35] text-white py-2 rounded-lg text-sm font-medium"
                    onClick={() => navigate(`/trainers/${t.id}`)}
                  >
                    상세 프로필
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-10">검색 결과가 없습니다.</p>
          )}
        </div>
      </div>

      {/* 탭바 */}
      <BottomTabBar activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}
