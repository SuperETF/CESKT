import { motion } from "framer-motion";

export default function MapSection() {
  return (
    <motion.section
      className="my-10 bg-white rounded-xl shadow-lg p-4 h-[50vh] relative"
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", delay: 0.1 }}
    >
      <div className="text-center text-gray-400">지도 및 지역별 트레이너 영역</div>
    </motion.section>
  );
}
