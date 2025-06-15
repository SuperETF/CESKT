import { motion } from "framer-motion";

export default function BoardSection() {
  return (
    <motion.section
      className="my-10"
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", delay: 0.4 }}
    >
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">최신 게시글</h2>
        <div className="text-gray-400">게시판/게시글 리스트 영역</div>
      </div>
    </motion.section>
  );
}
