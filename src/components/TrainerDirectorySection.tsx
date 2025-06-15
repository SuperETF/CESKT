import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface Trainer {
  id: string;
  name: string;
  level: string;
  specialty: string;
  location: string;
  image?: string;
}

export default function TrainerDirectorySection() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let subscription: ReturnType<typeof supabase.channel> | null = null;

    const fetchTrainers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("trainers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        setError(error.message);
        setTrainers([]);
      } else {
        setTrainers(data as Trainer[]);
        setError(null);
      }
      setLoading(false);
    };

    fetchTrainers();

    subscription = supabase
      .channel("public:trainers")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "trainers" },
        () => fetchTrainers()
      )
      .subscribe();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="py-16 text-center text-gray-400">트레이너 정보를 불러오는 중입니다...</div>;
  }
  if (error) {
    return <div className="py-16 text-center text-red-500">에러 발생: {error}</div>;
  }
  if (trainers.length === 0) {
    return <div className="py-16 text-center text-gray-400">등록된 트레이너가 없습니다.</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#1A1B35] mb-4">추천 트레이너</h2>
      <div className="grid grid-cols-2 gap-4">
        {trainers.map((trainer) => (
          <div
            key={trainer.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="h-32 overflow-hidden">
              <img
                src={
                  trainer.image ||
                  "https://readdy.ai/api/search-image?query=Professional%20Asian%20fitness%20trainer&width=200&height=200"
                }
                alt={trainer.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="p-3">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold">{trainer.name}</h3>
                <span className="bg-[#1A1B35] text-white text-xs px-2 py-1 rounded-full">
                  {trainer.level}
                </span>
              </div>
              <div className="text-xs text-gray-600 mb-2">
                <div>{trainer.specialty}</div>
                <div>{trainer.location}</div>
              </div>
              <button className="w-full bg-gray-100 text-[#1A1B35] text-sm py-1.5 rounded font-medium !rounded-button cursor-pointer">
                프로필 보기
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <button className="bg-white border border-[#1A1B35] text-[#1A1B35] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition !rounded-button cursor-pointer">
          더 보기
        </button>
      </div>
    </div>
  );
}
