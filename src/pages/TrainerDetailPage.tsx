// 리팩토링된 트레이너 상세 페이지 - 전체 디자인 통합 (기존 상단바 유지 + 프로필 사진 분리 + 소개문 정리 + 위치/경력 줄바꿈 개선 + 반응형 한 줄 처리 + 모바일 단락 분리)
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

interface Trainer {
  id: string;
  name: string;
  location: string;
  experience: string;
  image?: string;
  hero_image?: string;
  specialty?: string[];
  introduction?: string;
  certificates?: string[];
  detailedLocation?: string;
  contact?: {
    phone?: string;
    email?: string;
    instagram?: string;
    kakao?: string;
  };
  availableContactTime?: string;
}

const TrainerDetailPage: React.FC = () => {
  const { id } = useParams();
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFullIntro, setShowFullIntro] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);

  useEffect(() => {
    const fetchTrainer = async () => {
      const { data, error } = await supabase.from("trainers").select("*").eq("id", id).single();
      if (!error) setTrainer(data);
      else console.error("트레이너 로드 실패", error.message);
      setLoading(false);
    };
    if (id) fetchTrainer();
  }, [id]);

  if (loading) return <div className="text-center py-20 text-gray-500">로딩 중...</div>;
  if (!trainer) return <div className="text-center py-20 text-gray-500">트레이너를 찾을 수 없습니다.</div>;

  return (
    <div className="bg-white min-h-screen pb-20 relative">
      {/* 상단바는 기존 Layout 상단 탭바를 그대로 사용한다 (중복 안됨) */}

      {/* Hero 이미지 */}
      <div className="relative pt-0 h-[420px]">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={trainer.hero_image || "https://placehold.co/375x420?text=Trainer+Hero"}
            className="w-full h-full object-cover object-center"
            alt={trainer.name}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/80"></div>
        </div>
        <div className="absolute bottom-8 left-5 text-white w-[calc(100%-144px)]">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-1 truncate">
            {trainer.name}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center text-white/90 text-sm font-medium sm:space-x-2 space-y-1 sm:space-y-0">
            <div className="flex items-center">
              <i className="fas fa-map-marker-alt text-sm mr-1"></i>
              <span className="truncate max-w-[80vw] sm:max-w-[200px]">{trainer.location}</span>
            </div>
            <span className="hidden sm:inline text-white/60">·</span>
            <span className="truncate max-w-[80vw] sm:max-w-[240px]">경력 {trainer.experience}</span>
          </div>
        </div>

        {/* 프로필 이미지 */}
        <div className="absolute -bottom-12 right-5">
          <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden shadow-xl">
            <img
              src={trainer.image || "https://placehold.co/112x112?text=Profile"}
              className="w-full h-full object-cover"
              alt="프로필 사진"
            />
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="pt-14 pb-20">
        {/* 전문 분야 */}
        {(trainer.specialty ?? []).length > 0 && (
          <div className="px-4 mb-8 overflow-x-auto hide-scrollbar">
            <div className="flex space-x-2 py-2">
              {(trainer.specialty ?? []).map((s, i) => (
                <div key={i} className="px-5 py-2.5 bg-gray-100 text-gray-900 rounded-full text-sm font-medium whitespace-nowrap">{s}</div>
              ))}
            </div>
          </div>
        )}

        {/* 소개 */}
        <div className="bg-white mb-2">
          <div className="px-5 py-7">
            <h2 className="text-xl font-bold mb-4 text-gray-900">소개</h2>
            <p className={`text-gray-600 leading-relaxed text-[15px] whitespace-pre-wrap break-words ${!showFullIntro ? "line-clamp-4" : ""}`}>
              {trainer.introduction || "소개 정보가 없습니다."}
            </p>
            {trainer.introduction && (
              <button
                className="text-gray-900 text-sm font-semibold mt-3 hover:text-gray-600"
                onClick={() => setShowFullIntro(!showFullIntro)}
              >
                {showFullIntro ? "접기" : "더보기"}
              </button>
            )}
          </div>
        </div>

        {/* 자격증 */}
        {(trainer.certificates ?? []).length > 0 && (
          <div className="bg-white mb-2">
            <div className="px-5 py-7">
              <h2 className="text-xl font-bold mb-3">자격증</h2>
              <ul className="text-gray-700 space-y-3">
                {(showAllCertificates ? trainer.certificates ?? [] : trainer.certificates?.slice(0, 3) ?? []).map((cert, i) => (
                  <li key={i} className="flex items-start">
                    <i className="fas fa-medal text-yellow-500 mt-1 mr-2"></i>
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
              {(trainer.certificates ?? []).length > 3 && (
                <button
                  className="text-blue-600 text-sm font-medium mt-4"
                  onClick={() => setShowAllCertificates(!showAllCertificates)}
                >
                  {showAllCertificates ? "접기" : "더보기"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* 위치 */}
        {trainer.detailedLocation && (
          <div className="bg-white mb-2">
            <div className="px-5 py-7">
              <h2 className="text-xl font-bold mb-3">위치</h2>
              <div className="overflow-hidden h-48 mb-3">
                <img
                  src="https://readdy.ai/api/search-image?query=Map%20of%20Gangnam"
                  alt="위치 지도"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-start">
                <i className="fas fa-map-marker-alt text-red-500 mt-1 mr-2"></i>
                <p className="text-gray-700">{trainer.detailedLocation}</p>
              </div>
            </div>
          </div>
        )}

        {/* 연락처 */}
        {(trainer.contact || trainer.availableContactTime) && (
          <div className="bg-white mb-2">
            <div className="px-5 py-7">
              <h2 className="text-xl font-bold mb-3">연락처</h2>
              <div className="divide-y divide-gray-100">
                {trainer.contact?.phone && (
                  <div className="flex items-center py-3">
                    <i className="fas fa-phone text-green-500 w-8"></i>
                    <span className="text-gray-700">{trainer.contact.phone}</span>
                  </div>
                )}
                {trainer.contact?.email && (
                  <div className="flex items-center py-3">
                    <i className="fas fa-envelope text-blue-500 w-8"></i>
                    <span className="text-gray-700">{trainer.contact.email}</span>
                  </div>
                )}
                {trainer.contact?.instagram && (
                  <div className="flex items-center py-3">
                    <i className="fab fa-instagram text-pink-500 w-8"></i>
                    <span className="text-gray-700">{trainer.contact.instagram}</span>
                  </div>
                )}
                {trainer.contact?.kakao && (
                  <div className="flex items-center py-3">
                    <i className="fas fa-comment text-yellow-500 w-8"></i>
                    <span className="text-gray-700">카카오톡 ID: {trainer.contact.kakao}</span>
                  </div>
                )}
              </div>
              {trainer.availableContactTime && (
                <p className="text-sm text-gray-500 mt-3">
                  <i className="fas fa-clock mr-1"></i>
                  연락 가능 시간: {trainer.availableContactTime}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="fixed bottom-[72px] left-0 w-full bg-gradient-to-t from-white via-white to-transparent py-4 px-5 flex justify-center">
        <button className="max- w-[800px] bg-[#1A1B35] text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:bg-gray-900 text-[15px]">
          상담 예약하기
        </button>
      </div>
    </div>
  );
};

export default TrainerDetailPage;
