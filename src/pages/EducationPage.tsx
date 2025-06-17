import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface Course {
  id: string;
  title: string;
  type: "정규과정" | "보수교육";
  format: "온라인" | "오프라인";
  duration: string;
  price: number;
  deadline: string;
  image_url?: string;
}

export default function EducationPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filter, setFilter] = useState<string>("전체");
  const [query, setQuery] = useState<string>("");

  const filters = ["전체", "정규과정", "보수교육", "온라인", "오프라인"];

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from("continuing_education_courses")
        .select("*")
        .order("deadline", { ascending: true });

      if (error) {
        console.error("보수교육 불러오기 실패:", error.message);
      } else {
        setCourses(data as Course[]);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchFilter =
      filter === "전체" ||
      course.type === filter ||
      course.format === filter;
    const matchQuery =
      query === "" || course.title.toLowerCase().includes(query.toLowerCase());
    return matchFilter && matchQuery;
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="fixed top-0 w-full bg-[#1A1B35] text-white z-50 px-4 py-3 flex items-center">
        <h1 className="text-xl font-bold">보수교육</h1>
      </div>

      <div className="pt-10 px-4">
        <div className="mb-6">
          <div className="relative mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="교육과정 검색"
              className="w-full bg-white pl-10 pr-4 py-3 rounded-lg text-sm border-none shadow-sm"
            />
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
          <div className="flex overflow-x-auto space-x-2 py-1 px-2 scrollbar-hide scroll-smooth">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-md text-sm whitespace-nowrap !rounded-button ${
                  filter === f
                    ? "bg-[#1A1B35] text-white"
                    : "bg-white text-[#1A1B35] border border-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="h-40 overflow-hidden">
                <img
                  src={course.image_url}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      course.type === "정규과정"
                        ? "bg-red-100 text-red-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {course.type}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    {course.format}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <div className="text-gray-500">교육시간</div>
                    <div className="font-medium">{course.duration}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">수강료</div>
                    <div className="font-medium">
                      {course.price.toLocaleString()}원
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">신청마감</div>
                    <div className="font-medium">{course.deadline}</div>
                  </div>
                </div>
                <button className="w-full bg-[#1A1B35] text-white py-3 rounded-lg font-medium hover:bg-[#2A2B45] transition-colors">
                  수강신청
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
