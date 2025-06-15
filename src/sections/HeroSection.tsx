import { motion } from "framer-motion";

interface Props {
  onFindTrainerClick: () => void;
}

export default function HeroSection({ onFindTrainerClick }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-[#1A1B35] text-white overflow-hidden"
    >
      <div className="relative h-[80vh]">
        {/* 배경 이미지 */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://readdy.ai/api/search-image?query=Professional..."
            alt="Trainer"
            className="object-cover object-top w-full h-full opacity-60"
          />
        </div>

        {/* 그라디언트 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1B35] via-[#1A1B35]/90 to-transparent z-10" />

        {/* 콘텐츠 */}
        <div className="relative z-20 h-full flex flex-col justify-center px-6">
          <div className="max-w-[80%]">
            <h1 className="text-3xl font-bold mb-2">CESKT 인증 트레이너</h1>
            <h2 className="text-2xl font-semibold mb-4">
              당신 근처의 인증된 트레이너를 찾아보세요
            </h2>
            <p className="text-gray-300 mb-6">
              전문 자격증을 보유한 트레이너와 함께 건강한 라이프스타일을 시작하세요
            </p>
            {/* 🔽 스크롤 이동 버튼 */}
            <button
              onClick={onFindTrainerClick}
              className="bg-white text-[#1A1B35] px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              트레이너 찾기
            </button>
          </div>
        </div>

        {/* 하단 곡선 장식 */}
        <div className="absolute bottom-0 right-0 w-full h-20 bg-white transform -skew-y-6 translate-y-10 z-10" />
      </div>
    </motion.section>
  );
}
