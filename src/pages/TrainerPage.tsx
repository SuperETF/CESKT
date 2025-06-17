import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { FaMapMarkerAlt, FaHistory } from "react-icons/fa";
import { Helmet } from "react-helmet-async";

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
    <>
      {/* ✅ SEO 태그 설정 */}
      <Helmet>
        <title>CESKT | 인증된 트레이너 찾기</title>
        <meta
          name="description"
          content="CESKT는 지역 기반의 맞춤형 트레이너를 찾아주는 플랫폼입니다. 지금 바로 나에게 맞는 전문가를 검색해보세요."
        />
        <link rel="canonical" href="https://www.ceskt.kr/" />
      </Helmet>

      <div className="relative bg-gray-50 min-h-screen pb-28">
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
                <div
                  key={t.id}
                  className="bg-white p-4 rounded-lg shadow-md flex transition-transform hover:-translate-y-1 duration-300 cursor-pointer"
                >
                  <div className="w-[96px] h-[150px] rounded-lg overflow-hidden bg-gray-100 mr-4 flex-shrink-0">
                    <img
                      src={t.image || "https://placehold.co/96x150?text=No+Image"}
                      alt={t.name}
                      className="w-full h-full object-cover brightness-110"
                      loading="lazy"
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

                    {/* ✅ 전문 분야 2줄 고정 */}
                    <p className="text-sm text-gray-700 mt-1 line-clamp-2 break-words">
                      {getSpecialtyString(t.specialty)}
                    </p>

                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <FaMapMarkerAlt className="text-gray-400 text-xs" />
                      {t.location}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
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
              <p className="text-center text-gray-500 py-10">
                검색 결과가 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
