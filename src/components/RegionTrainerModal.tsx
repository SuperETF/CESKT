import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Trainer {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  image?: string;
}

interface Props {
  region: string;
  trainers: Trainer[];
  onClose: () => void;
  isMobile: boolean;
  onHoverChange?: (hovering: boolean) => void;
}

export default function RegionTrainerModal({
  region,
  trainers,
  onClose,
  isMobile,
  onHoverChange,
}: Props) {
  const [show, setShow] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setShow(true);
  }, []);

  if (trainers.length === 0) return null;

  const modalContent = (
    <div
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      className={`bg-white ${
        isMobile ? "rounded-t-2xl" : "rounded-xl"
      } w-full max-w-sm mx-auto ${isMobile ? "" : "shadow-lg"}`}
    >
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-bold text-[#1A1B35]">{region} 지역 트레이너</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* 트레이너 목록 */}
      <div
        className={`p-4 space-y-4 ${
          trainers.length >= 4
            ? "pb-28 max-h-[60vh] overflow-y-auto"
            : "pb-4"
        }`}
      >
        {trainers.map((trainer, index) => (
          <div
            key={index}
            onClick={() => navigate(`/trainers/${trainer.id}`)} // ✅ 상세페이지 이동
            className="flex items-start gap-4 border-b border-gray-100 pb-3 last:border-0 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition"
          >
            <img
              src={
                trainer.image?.startsWith("http")
                  ? trainer.image
                  : "https://via.placeholder.com/80x100?text=PT"
              }
              alt={trainer.name}
              className="w-20 h-24 rounded-xl object-cover border shadow-sm"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h4 className="font-semibold text-[#1A1B35]">{trainer.name}</h4>
                  <p className="text-sm text-gray-600">{trainer.specialty}</p>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-star text-yellow-400 mr-1"></i>
                  <span className="text-sm font-semibold">{trainer.rating}</span>
                </div>
              </div>
              <div className="text-xs text-gray-500">경력 {trainer.experience}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 닫기 버튼 */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="w-full bg-[#1A1B35] text-white py-3 rounded-lg font-semibold"
        >
          닫기
        </button>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {show && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex justify-center items-end sm:items-center px-4"
          onClick={onClose}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full">
            <motion.div
              initial={isMobile ? { y: "100%", opacity: 0 } : { opacity: 0, scale: 0.95 }}
              animate={isMobile ? { y: 0, opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={isMobile ? { y: "100%", opacity: 0 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {modalContent}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
