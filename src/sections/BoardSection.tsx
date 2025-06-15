import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function extractTextFromHTML(html: string, maxLength = 60): string {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  const text = temp.textContent || temp.innerText || "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

interface Post {
  id: string;
  title: string;
  category?: string;
  created_at: string;
  content: string;
  thumbnail_url?: string;
  user_id?: string;
  authorName?: string;
  authorImage?: string;
}

export default function BoardSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const { data: rawPosts, error } = await supabase
        .from("posts")
        .select("id, title, category, content, created_at, thumbnail_url, user_id")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error || !rawPosts) {
        console.error("게시글 불러오기 실패:", error?.message);
        setLoading(false);
        return;
      }

      const userIds = [...new Set(rawPosts.map((p) => p.user_id).filter(Boolean))];
      const { data: trainers } = await supabase
        .from("trainers")
        .select("user_id, name, image")
        .in("user_id", userIds);

      const enrichedPosts = rawPosts.map((post) => {
        const trainer = trainers?.find((t) => t.user_id === post.user_id);
        return {
          ...post,
          authorName: trainer?.name ?? "익명",
          authorImage: trainer?.image ?? "https://placehold.co/24x24?text=👤",
        };
      });

      setPosts(enrichedPosts);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <section id="board" className="w-full py-8 px-4 bg-white">
      <h2 className="text-2xl font-bold text-[#1A1B35] mb-6">최신 게시글</h2>

      {loading ? (
        <p className="text-gray-500 text-center">게시글을 불러오는 중입니다...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500 text-center">게시글이 없습니다.</p>
      ) : (
        posts.map((post) => (
          <div
  key={post.id}
  onClick={() => navigate(`/board/${post.id}`)}
  className="bg-white rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition duration-300 transform mb-4 cursor-pointer overflow-hidden"
>
  <div className="flex w-full max-w-full">
    {/* 왼쪽 썸네일 영역 */}
    <div className="w-[120px] sm:w-[120px] aspect-square flex-shrink-0 p-2">

      <div className="w-full h-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        <img
          src={post.thumbnail_url || "https://via.placeholder.com/120x80.png?text=No+Image"}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>
    </div>

    {/* 오른쪽 내용 영역 */}
    <div className="flex-1 min-w-0 p-3">
      <div className="flex items-center mb-1">
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
          {post.category || "기타"}
        </span>
      </div>
      <h3 className="font-bold mb-1 text-sm line-clamp-2">{post.title}</h3>
      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
        {extractTextFromHTML(post.content)}
      </p>
      <div className="text-xs text-gray-500 flex items-center gap-2">
        <img
          src={post.authorImage}
          alt={post.authorName}
          className="w-5 h-5 rounded-full"
        />
        <span>{post.authorName}</span>
        <span>•</span>
        <span>{new Date(post.created_at).toLocaleDateString("ko-KR")}</span>
      </div>
    </div>
  </div>
</div>

        ))
      )}

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => navigate("/board")}
          className="bg-white border border-[#1A1B35] text-[#1A1B35] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition !rounded-button cursor-pointer"
        >
          전체 게시글 보기
        </button>
      </div>
    </section>
  );
}
