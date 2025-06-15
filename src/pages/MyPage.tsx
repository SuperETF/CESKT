import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faPen, faChartLine, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

interface Trainer {
  id: string;
  name: string;
  image?: string;
  introduction?: string;
  location?: string;
  experience?: string;
}

interface Post {
  id: string;
  title: string;
  category: string;
  created_at: string;
  image?: string;
}

export default function MyPage() {
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [activeTab, setActiveTab] = useState("saved");
  const [loading, setLoading] = useState(true);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("❌ 유저 정보 가져오기 실패:", authError?.message);
        return;
      }

      const { data: trainerData } = await supabase
        .from("trainers")
        .select("id, name, image, introduction, location, experience")
        .eq("user_id", user.id)
        .single();

      setTrainer(trainerData);

      const { data: postsData } = await supabase
        .from("posts")
        .select("id, title, category, created_at, image")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setMyPosts(postsData || []);

      const { data: bookmarkData, error: bookmarkError } = await supabase
        .from("post_bookmarks")
        .select("post_id")
        .eq("user_id", user.id);

      if (bookmarkData?.length) {
        const postIds = bookmarkData.map((b) => b.post_id);
        const { data: saved, error: savedError } = await supabase
          .from("posts")
          .select("id, title, category, created_at, image")
          .in("id", postIds);
        if (savedError) console.error("❌ 북마크 게시글 불러오기 실패:", savedError.message);
        setSavedPosts(saved || []);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">불러오는 중...</div>;
  }

  if (!trainer) {
    return <div className="text-center py-20 text-gray-500">트레이너 정보를 찾을 수 없습니다.</div>;
  }

  const tabMeta = [
    { key: "saved", label: "저장한 게시물", icon: faBookmark },
    { key: "my", label: "작성한 게시물", icon: faPen },
    { key: "activity", label: "활동 내역", icon: faChartLine },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pt-16 pb-28 px-4 max-w-3xl mx-auto">
      {/* 프로필 카드 */}
      <div className="bg-white rounded-xl shadow p-6 text-center mb-6">
        <img
          src={trainer.image || "https://placehold.co/120x120?text=\uD83D\uDC64"}
          alt={trainer.name}
          className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
        />
        <h1 className="text-xl font-bold text-gray-800">{trainer.name}</h1>
        <p className="text-sm text-gray-500 mt-1">{trainer.location}</p>
        <p className="text-sm text-gray-600 mt-1">경력 {trainer.experience}</p>
        <p className="text-sm text-gray-700 mt-4 leading-relaxed">
          {trainer.introduction || "소개글이 없습니다."}
        </p>
        <button className="mt-4 px-4 py-2 text-sm font-medium bg-indigo-50 text-indigo-800 rounded-full hover:bg-indigo-100 transition-colors duration-200">
          프로필 편집
        </button>
      </div>

      {/* 탭 메뉴 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="flex p-1 m-3 bg-gray-50 rounded-xl">
          {tabMeta.map((tab) => (
            <button
              key={tab.key}
              className={`flex-1 py-3 text-sm font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === tab.key
                  ? "text-indigo-800 bg-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              <FontAwesomeIcon icon={tab.icon} className="text-sm" />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-4 text-sm text-gray-700">
          {activeTab === "saved" && (
            <div className="space-y-4">
              {savedPosts.length === 0 ? (
                <p className="text-center text-gray-400">저장한 게시물이 없습니다.</p>
              ) : (
                savedPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => navigate(`/board/${post.id}`)}
                    className="flex space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
                  >
                    <img
                      src={post.image || "https://placehold.co/80x80?text=Post"}
                      alt={post.title}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-800 rounded-full text-xs mb-1">
                        {post.category}
                      </span>
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          {activeTab === "my" && (
            <div className="space-y-4">
              {myPosts.length === 0 ? (
                <p className="text-center text-gray-400">작성한 게시물이 없습니다.</p>
              ) : (
                myPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => navigate(`/board/${post.id}`)}
                    className="flex space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
                  >
                    <img
                      src={post.image || "https://placehold.co/80x80?text=Post"}
                      alt={post.title}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-800 rounded-full text-xs mb-1">
                        {post.category}
                      </span>
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          {activeTab === "activity" && <p><FontAwesomeIcon icon={faChartLine} className="mr-2" />활동 내역이 표시됩니다.</p>}
        </div>
      </div>

      {/* 로그아웃 버튼 */}
      <div className="text-center">
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 text-sm font-medium text-red-600 border border-red-100 bg-red-50 px-4 py-2 rounded-full hover:bg-red-100 transition"
        >
          <FontAwesomeIcon icon={faRightFromBracket} /> 로그아웃
        </button>
      </div>
    </div>
  );
}