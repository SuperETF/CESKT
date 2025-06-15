import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <motion.section
      className="relative bg-[#1A1B35] text-white h-[80vh] rounded-b-2xl overflow-hidden mb-10"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 90, damping: 20 }}
    >
      <div className="absolute inset-0 z-0">
        {/* 히어로 이미지 */}
        <img
          src="https://readdy.ai/api/search-image?query=Professional%20male%20fitness%20trainer%20wearing%20a%20headset%20in%20action%20pose%2C%20athletic%20build%2C%20confident%20expression%2C%20dark%20navy%20blue%20background%2C%20dramatic%20lighting%2C%20professional%20photography%2C%20high%20contrast%2C%20fitness%20professional%20portrait%2C%20studio%20shot%2C%20modern%20and%20sleek&width=600&height=800&seq=1&orientation=portrait"
          alt="Trainer"
          className="object-cover object-top w-full h-full opacity-60"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#1A1B35] via-[#1A1B35]/90 to-transparent z-10"></div>
      <div className="relative z-20 h-full flex flex-col justify-center px-6">
        <div className="max-w-[80%]">
          <h1 className="text-3xl font-bold mb-2">EXERCISE SCHOOL</h1>
          <h2 className="text-2xl font-semibold mb-4">
            당신 근처의 인증된 트레이너를 찾아보세요
          </h2>
          <p className="text-gray-300 mb-6">
            전문 자격증을 보유한 트레이너와 함께 건강한 라이프스타일을 시작하세요
          </p>
          <a href="#" data-readdy="true">
            <button className="bg-white text-[#1A1B35] px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition cursor-pointer">
              트레이너 찾기
            </button>
          </a>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-full h-20 bg-white transform -skew-y-6 translate-y-10 z-10"></div>
    </motion.section>
  );
}
