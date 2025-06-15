import { motion } from "framer-motion";

export default function FacilitySection() {
  return (
    <motion.section
      className="my-10"
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", delay: 0.3 }}
    >
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">제휴 운동시설</h2>
        <div className="text-gray-400">운동시설 정보 영역</div>
      </div>
    </motion.section>
  );
}
