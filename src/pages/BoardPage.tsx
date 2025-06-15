import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import PostCard from "../components/board/PostCard";
import Pagination from "../components/board/Pagination";

const categories = [
  "전체",
  "웨이트 트레이닝",
  "영양 정보",
  "근골격계 정보",
  "운동 루틴",
  "논문 분석",
];

export default function BoardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("\uac1c\uccb4");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    const fetchPosts = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      const guestId = localStorage.getItem("guest_id") || crypto.randomUUID();
      localStorage.setItem("guest_id", guestId);
      const viewerId = authUser?.id ?? `guest-${guestId}`;

      const { data: rawPosts, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (!rawPosts || error) return;

      const userIds = [...new Set(rawPosts.map((p) => p.user_id))];
      const { data: trainers } = await supabase
        .from("trainers")
        .select("user_id, name, image")
        .in("user_id", userIds);

      const enrichedPosts = rawPosts.map((post) => {
        const trainer = trainers?.find((t) => t.user_id === post.user_id);
        return {
          ...post,
          authorName: trainer?.name ?? "익명",
          authorImage: trainer?.image ?? "https://placehold.co/40x40?text=\ud83d\udc64",
          thumbnail: post.thumbnail_url || "",
        };
      });

      setPosts(enrichedPosts);

      const viewPromises = enrichedPosts.map((post) =>
        supabase
          .from("post_views")
          .upsert(
            { post_id: post.id, user_id: viewerId },
            { onConflict: "post_id,user_id" }
          )
      );
      await Promise.all(viewPromises);
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts
    .filter(
      (post) => activeCategory === "개체" || post.category === activeCategory
    )
    .filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <div className="relative bg-gray-50 min-h-screen pb-28">
      {/* 상단 타이틀 */}
      <div className="pt-5 max-w-[960px] mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">게시판</h1>
          <button
            className="text-sm bg-[#1A1B35] text-white px-3 py-1.5 rounded-lg"
            onClick={() => navigate("/board/write")}
          >
            글쓰기
          </button>
        </div>

        {/* 검색 */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-100 text-sm focus:outline-none border-none"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            <i className="fas fa-search absolute left-3.5 top-3 text-gray-400"></i>
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="overflow-x-auto scrollbar-hide py-3 -mx-4">
          <div className="flex px-4 space-x-2 min-w-max">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-3 py-1.5 rounded-md text-sm whitespace-nowrap !rounded-button ${
                  activeCategory === category
                    ? "bg-[#1A1B35] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => {
                  setActiveCategory(category);
                  setCurrentPage(1);
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 게시권 리스트 */}
        <div className="space-y-4 mt-6">
          {currentPosts.length > 0 ? (
            currentPosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="text-center text-gray-500 py-10">
              검색 결과가 없습니다
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        {filteredPosts.length > postsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={(page) => {
              setCurrentPage(page);
              window.scrollTo(0, 0);
            }}
          />
        )}
      </div>
    </div>
  );
}
