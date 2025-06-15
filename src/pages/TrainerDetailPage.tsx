import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const TrainerDetailPage: React.FC = () => {
  const { id } = useParams();
  const [trainer, setTrainer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);

  useEffect(() => {
    const fetchTrainer = async () => {
      const { data, error } = await supabase
        .from("trainers")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("트레이너 불러오기 실패:", error.message);
      } else {
        setTrainer(data);
      }

      setLoading(false);
    };

    if (id) fetchTrainer();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">로딩 중...</div>;
  }

  if (!trainer) {
    return <div className="text-center py-20 text-gray-500">트레이너를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="relative bg-gray-50 min-h-screen pb-32 pt-16">
      {/* ✅ 데스크탑에서는 max-w-3xl 로 제한, 모바일에서는 px-4 */}
      <div className="w-full px-4 max-w-2xl mx-auto">
        {/* ✅ 프로필 카드 */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <img
            src={trainer.image}
            alt={trainer.name}
            className="w-full h-49 object-cover rounded-lg mb-4" // ✅ h-49 → h-48 (정형화)
          />
          <h1 className="text-2xl md:text-3xl font-bold mb-1">{trainer.name}</h1>
          <p className="text-gray-500 text-sm md:text-base">{trainer.location}</p>
          <p className="text-sm text-gray-600 mt-1">경력 {trainer.experience}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {Array.isArray(trainer.specialty) &&
              trainer.specialty.map((spec: string, i: number) => (
                <span key={i} className="bg-[#F0F1FF] text-[#1A1B35] text-sm px-3 py-1 rounded-md">
                  {spec}
                </span>
              ))}
          </div>
        </div>

        {/* ✅ 트레이너 소개 */}
        <div className="bg-white mt-4 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-3">트레이너 소개</h2>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            {showFullDescription ? trainer.introduction : `${trainer.introduction.slice(0, 100)}...`}
          </p>
          <button
            className="text-[#1A1B35] mt-2 font-medium"
            onClick={() => setShowFullDescription(!showFullDescription)}
          >
            {showFullDescription ? "접기" : "더보기"}
          </button>
        </div>

        {/* ✅ 자격증 */}
        {Array.isArray(trainer.certificates) && trainer.certificates.length > 0 && (
          <div className="bg-white mt-4 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-3">자격증</h2>
            <ul className="text-gray-700 list-disc pl-5 text-sm md:text-base">
              {(showAllCertificates ? trainer.certificates : trainer.certificates.slice(0, 3)).map(
                (cert: string, i: number) => <li key={i}>{cert}</li>
              )}
            </ul>
            {trainer.certificates.length > 3 && (
              <button
                className="text-[#1A1B35] mt-2 font-medium"
                onClick={() => setShowAllCertificates(!showAllCertificates)}
              >
                {showAllCertificates ? "접기" : "더보기"}
              </button>
            )}
          </div>
        )}

        {/* ✅ 위치 */}
        {trainer.detailedLocation && (
          <div className="bg-white mt-4 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-3">수업 장소</h2>
            <div className="h-48 rounded-lg overflow-hidden mb-3 bg-gray-200">
              <img
                src="https://readdy.ai/api/search-image?query=Map%2520of%2520Gangnam%2520district..."
                alt="위치 지도"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-gray-700 text-sm md:text-base">
              <i className="fas fa-map-marker-alt mr-2 text-[#1A1B35]" />
              {trainer.detailedLocation}
            </p>
          </div>
        )}

        {/* ✅ 연락처 */}
        {(trainer.contact || trainer.availableContactTime) && (
          <div className="bg-white mt-4 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-3">연락처</h2>
            <div className="space-y-2 text-gray-700 text-sm md:text-base">
              {trainer.contact?.phone && (
                <p>
                  <i className="fas fa-phone mr-2"></i>
                  {trainer.contact.phone}
                </p>
              )}
              {trainer.contact?.email && (
                <p>
                  <i className="fas fa-envelope mr-2"></i>
                  {trainer.contact.email}
                </p>
              )}
              {trainer.contact?.instagram && (
                <p>
                  <i className="fab fa-instagram mr-2"></i>
                  {trainer.contact.instagram}
                </p>
              )}
              {trainer.contact?.kakao && (
                <p>
                  <i className="fas fa-comment mr-2"></i>
                  카카오톡 ID: {trainer.contact.kakao}
                </p>
              )}
            </div>
            {trainer.availableContactTime && (
              <p className="text-sm text-gray-500 mt-2">
                연락 가능 시간: {trainer.availableContactTime}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ✅ 하단 고정 버튼 (데스크탑에서도 적절히 보여야 함) */}
      <div className="fixed bottom-16 left-0 right-0 px-4 py-2 bg-white border-t border-gray-200 z-40">
        <button className="w-full bg-[#1A1B35] text-white py-3 rounded-lg font-bold text-base">
          상담 예약하기
        </button>
      </div>
    </div>
  );
};

export default TrainerDetailPage;
