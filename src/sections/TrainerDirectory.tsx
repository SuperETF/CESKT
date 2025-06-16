import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { FaMapMarkerAlt, FaHistory } from "react-icons/fa"; // 위치, 경력 아이콘
import { useNavigate } from "react-router-dom"; 


interface Trainer {
  id: string;
  name: string;
  level: string;
  specialty: string;
  location: string;
  image?: string;
}

interface Props {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export default function TrainerDirectory({ searchQuery, setSearchQuery }: Props) {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainers = async () => {
      const { data, error } = await supabase
        .from("trainers")
        .select("id, name, level, specialty, location, image")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("트레이너 데이터 불러오기 실패:", error.message);
      } else {
        setTrainers(data || []);
      }

      setLoading(false);
    };

    fetchTrainers();
  }, []);

  const filtered = trainers.filter((t) =>
    [
      t.name,
      t.location,
      ...(Array.isArray(t.specialty) ? t.specialty : [t.specialty]),
    ]
      .filter(Boolean)
      .some((v) =>
        typeof v === "string" && v.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <section className="w-full py-8 px-4">
      <h2 className="text-2xl font-bold text-[#1A1B35] mb-4">CESK 트레이너</h2>

      {/* 검색바 */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="트레이너 또는 지역 검색"
            className="flex-1 py-2 px-4 outline-none border-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="bg-[#1A1B35] text-white p-2 !rounded-button cursor-pointer">
            <i className="fas fa-search" />
          </button>
        </div>
      </div>

{/* 트레이너 카드 리스트 */}
<div
  className="overflow-x-auto"
  style={{
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  }}
>
  <div className="flex gap-4 w-max px-1 pb-2">
    {loading ? (
      <p className="text-gray-500 text-sm text-center w-full">로딩 중...</p>
    ) : filtered.length === 0 ? (
      <p className="text-gray-500 text-sm text-center w-full">검색 결과가 없습니다.</p>
    ) : (
      filtered.map((trainer) => (
        <div
          key={trainer.id}
          className="min-w-[220px] w-[220px] bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 cursor-pointer"
        >
          {/* 이미지 */}
          <div className="h-49 overflow-hidden">
            <img
              src={
                trainer.image ||
                "https://placehold.co/300x150?text=Trainer"
              }
              alt={trainer.name}
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* 내용 */}
          <div className="p-3">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-semibold text-sm">{trainer.name}</h3>
              <span
                title="Certified Trainer"
                className="w-5 h-5 flex items-center justify-center text-[10px] font-black text-amber-900 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-200 ring-2 ring-yellow-300 shadow"
              >
                C
              </span>
            </div>
            <div className="text-xs text-gray-600 mb-2 space-y-0.5">
              <div>{trainer.specialty}</div>
              <div>{trainer.location}</div>
            </div>
            <button
              onClick={() => navigate(`/trainers/${trainer.id}`)}
              className="w-full bg-gray-100 text-[#1A1B35] text-sm py-1.5 rounded font-medium !rounded-button cursor-pointer"
            >
              프로필 보기
</button>
        </div>
      </div>
    ))
  )}
</div>
</div>
    </section>
  );
}
