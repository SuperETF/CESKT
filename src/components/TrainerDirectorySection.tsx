import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabaseClient";

type Trainer = {
  id: number;
  name: string;
  specialty: string;
  region: string;
  experience: string;
  rating: number;
};

export default function TrainerDirectorySection() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. 최초 데이터 fetch
    const fetchData = async () => {
      setLoading(true);
      const { data } = await supabase.from("trainers").select("*").order("id", { ascending: true });
      setTrainers(data ?? []);
      setLoading(false);
    };

    fetchData();

    // 2. 실시간 구독 (INSERT, UPDATE, DELETE 모두)
    const channel = supabase
      .channel("public:trainers")
      .on("postgres_changes", { event: "*", schema: "public", table: "trainers" }, fetchData)
      .subscribe();

    // 3. cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <motion.section
      className="my-10"
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", delay: 0.2 }}
    >
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">추천 트레이너</h2>
        {loading && <div className="text-gray-400">불러오는 중...</div>}
        {!loading && trainers.length === 0 && (
          <div className="text-gray-400">등록된 트레이너가 없습니다.</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {trainers.map((t) => (
            <div key={t.id} className="border rounded-lg p-4 shadow-sm">
              <div className="font-semibold text-lg">{t.name}</div>
              <div className="text-sm text-gray-600">{t.specialty}</div>
              <div className="text-xs text-gray-500 mt-1">
                지역: {t.region} | 경력: {t.experience} | 평점: {t.rating}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
