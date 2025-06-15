//src/pages/PostDetailPage.tsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [user, setUser] = useState<{ id: string | null }>({ id: null });
  const [authorName, setAuthorName] = useState("작성자");
const [authorImage, setAuthorImage] = useState(""); // 프로필 이미지


  const postId = id;

  useEffect(() => {
    if (!post?.user_id) return;
  
    const fetchAuthorInfo = async () => {
      const { data, error } = await supabase
        .from("trainers")
        .select("name, image")
        .eq("user_id", post.user_id)
        .single();
  
      if (error) {
        console.warn("작성자 정보 불러오기 실패:", error.message);
        setAuthorName("익명");
        setAuthorImage("https://placehold.co/40x40?text=👤");
      } else {
        setAuthorName(data.name ?? "익명");
        setAuthorImage(data.image ?? "https://placehold.co/40x40?text=👤");
      }
    };
  
    fetchAuthorInfo();
  }, [post?.user_id]);
  

  // ✅ 유저 정보 설정 (회원 or guest UUID)
  useEffect(() => {
    const initUser = async () => {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();
  
      if (authError || !authUser) {
        console.error("❌ 유저 정보를 불러오지 못함:", authError?.message);
        alert("로그인이 필요합니다.");
        return;
      }
  
      console.log("✅ 로그인된 유저:", authUser);
      setUser({ id: authUser.id }); // 👈 uuid 타입 그대로 사용
    };
  
    initUser();
  }, []);

  
  

  // ✅ 게시글 로드 + 조회수 기록
  useEffect(() => {
    if (!postId || !user.id) return;

    const fetchPost = async () => {
      const { data, error } = await supabase.from("posts").select("*").eq("id", postId).single();
      if (error) {
        console.error("❌ 게시글 로드 실패:", error.message);
        setLoading(false);
        return;
      }

      setPost(data);
      setComments(data.comments || []);

      const { error: viewError } = await supabase
        .from("post_views")
        .upsert({ post_id: postId, user_id: user.id }, { onConflict: "post_id,user_id" });

      if (viewError) console.error("❌ 조회수 기록 실패:", viewError.message);

      setLoading(false);
    };

    fetchPost();
  }, [postId, user.id]);

  // ✅ 좋아요 / 북마크 상태 로드 (user.id가 설정된 후에만)
  useEffect(() => {
    if (!user.id || !postId) return;

    const fetchMeta = async () => {
      const [{ data: like, error: likeError }, { data: bookmark, error: bookmarkError }, { count, error: countError }] =
        await Promise.all([
          supabase.from("post_likes").select("id").eq("user_id", user.id).eq("post_id", postId).maybeSingle(),
          supabase.from("post_bookmarks").select("id").eq("user_id", user.id).eq("post_id", postId).maybeSingle(),
          supabase.from("post_likes").select("id", { count: "exact", head: true }).eq("post_id", postId),
        ]);

      if (likeError) console.error("❌ 좋아요 상태 조회 실패:", likeError.message);
      if (bookmarkError) console.error("❌ 북마크 상태 조회 실패:", bookmarkError.message);
      if (countError) console.error("❌ 좋아요 수 조회 실패:", countError.message);

      setIsLiked(!!like);
      setIsBookmarked(!!bookmark);
      setLikeCount(count ?? 0);
    };

    fetchMeta();
  }, [user.id, postId]);

  

  const toggleLike = async () => {
    if (!user.id) return;
  
    if (isLiked) {
      const { error } = await supabase
        .from("post_likes")
        .delete()
        .eq("user_id", user.id)
        .eq("post_id", postId);
  
      if (error) {
        console.error("❌ 좋아요 취소 실패:", error.message);
        alert("좋아요를 취소하는 중 오류가 발생했습니다.");
        return;
      }
  
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      const { error } = await supabase
        .from("post_likes")
        .insert({ user_id: user.id, post_id: postId });
  
      if (error) {
        if (error.code === "23505") {
          // 중복 insert 방지
          console.warn("이미 좋아요 누른 상태");
        } else {
          console.error("❌ 좋아요 등록 실패:", error.message);
          alert("좋아요를 등록하는 중 오류가 발생했습니다.");
          return;
        }
      }
  
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };
  

  const toggleBookmark = async () => {
    if (!user.id || user.id.startsWith("guest-")) {
      alert("북마크는 로그인 후 사용 가능합니다.");
      return;
    }
  
    if (isBookmarked) {
      const { error } = await supabase
        .from("post_bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("post_id", postId);
  
      if (error) {
        console.error("❌ 북마크 해제 실패:", error.message);
        alert("북마크를 해제하는 중 오류가 발생했습니다.");
        return;
      }
  
      setIsBookmarked(false);
    } else {
      const { error } = await supabase
        .from("post_bookmarks")
        .insert({ user_id: user.id, post_id: postId });
  
      if (error) {
        if (error.code === "23505") {
          console.warn("이미 북마크된 게시글");
        } else {
          console.error("❌ 북마크 추가 실패:", error.message);
          alert("북마크를 저장하는 중 오류가 발생했습니다.");
          return;
        }
      }
  
      setIsBookmarked(true);
    }
  };
  

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      author: "나",
      authorImage: "https://placehold.co/40x40?text=ME",
      content: commentText,
      time: "방금",
    };
    const updatedComments = [newComment, ...comments];

    const { error } = await supabase.from("posts").update({ comments: updatedComments }).eq("id", postId);
    if (error) {
      console.error("🔴 댓글 저장 실패:", error.message);
      alert("댓글 저장에 실패했습니다");
      return;
    }

    setComments(updatedComments);
    setCommentText("");
  };

  const handleShare = () => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("링크가 복사되었습니다");
    } catch (err) {
      console.error("🔴 링크 복사 실패:", err);
      alert("링크 복사에 실패했습니다");
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-500">불러오는 중...</div>;
  if (!post) return <div className="p-6 text-center text-red-500">존재하지 않는 게시글입니다.</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 상단 네비게이션 바 */}
      <div className="bg-[#1A1B35] text-white z-50 shadow-md fixed top-0 left-0 right-0">
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[960px] px-4 py-3 flex items-center justify-between">
            <button className="p-2" onClick={() => navigate(-1)}>
              <i className="fas fa-arrow-left text-lg"></i>
            </button>
            <div className="text-lg font-bold text-center flex-1">게시글</div>
            <button className="p-2">
              <i className="fas fa-sliders-h text-lg"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 mt-14 mb-32 px-4">
        {/* 게시글 내용 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-3">
          <div className="p-4">
            <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs mb-2">
              {post.category}
            </span>
            <h2 className="text-xl font-bold text-gray-800 mb-3">{post.title}</h2>
            <div className="flex items-center mb-4">
            <img
  src={authorImage}
  alt={authorName}
  className="w-8 h-8 rounded-full mr-2"
/>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{authorName}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  <span className="mx-1.5">•</span>
                  <i className="fas fa-eye mr-1"></i>
                  <span>{post.views ?? 0}</span>
                </div>
              </div>
            </div>
            <div
              className="text-gray-700 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: post.content }}
            ></div>
          </div>
        </div>

        {/* 상호작용 버튼 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-4">
          <div className="flex items-center justify-between px-4 py-3">
          <button
    onClick={toggleLike}
    className={`flex items-center gap-1 ${
      isLiked || likeCount > 0 ? "text-red-500" : "text-gray-500"
    }`}
  >
    <i className={isLiked ? "fas fa-heart" : "far fa-heart"}></i>
    <span className="text-sm">좋아요 {likeCount}</span>
  </button>
              {/* 공유 버튼 */}
  <button
    onClick={handleShare}
    className="flex items-center gap-1 text-gray-500 hover:text-blue-500"
  >
    <i className="fas fa-share-alt"></i>
    <span className="text-sm">공유</span>
  </button>
  {/* 저장 버튼 */}
  <button
    onClick={toggleBookmark}
    className={`flex items-center gap-1 ${
      isBookmarked ? "text-yellow-500" : "text-gray-500"
    }`}
  >
    <i className={isBookmarked ? "fas fa-bookmark" : "far fa-bookmark"}></i>
    <span className="text-sm">저장</span>
  </button>
          </div>
        </div>

        {/* 댓글 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-4">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">댓글</h3>
              <span className="text-sm text-gray-500">{comments.length}개</span>
            </div>
            <form onSubmit={handleCommentSubmit} className="mb-5">
              <div className="flex items-center space-x-2">
                <img src="https://placehold.co/40x40?text=ME" alt="내 프로필" className="w-8 h-8 rounded-full" />
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="댓글을 입력하세요"
                    className="w-full pl-3 pr-12 py-2 rounded-full bg-gray-100 text-sm focus:outline-none border-none"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 cursor-pointer"
                    disabled={!commentText.trim()}
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </form>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <img
                    src={comment.authorImage}
                    alt={comment.author}
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-800 text-sm">{comment.author}</span>
                        <span className="text-xs text-gray-500">{comment.time}</span>
                      </div>
                      <p className="text-gray-700 text-sm">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 하단 탭바 */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 z-10">
        <div className="grid grid-cols-5 h-16">
          <a href="/" className="flex flex-col items-center justify-center cursor-pointer">
            <i className="fas fa-home text-gray-400"></i>
            <span className="mt-1 text-xs text-gray-500">홈</span>
          </a>
          <a href="#" className="flex flex-col items-center justify-center cursor-pointer">
            <i className="fas fa-dumbbell text-gray-400"></i>
            <span className="mt-1 text-xs text-gray-500">운동</span>
          </a>
          <a href="#" className="flex flex-col items-center justify-center cursor-pointer">
            <i className="fas fa-utensils text-gray-400"></i>
            <span className="mt-1 text-xs text-gray-500">식단</span>
          </a>
          <a href="/board" className="flex flex-col items-center justify-center cursor-pointer">
            <i className="fas fa-comments text-blue-500"></i>
            <span className="mt-1 text-xs text-blue-500">커뮤니티</span>
          </a>
          <a href="/profile" className="flex flex-col items-center justify-center cursor-pointer">
            <i className="fas fa-user text-gray-400"></i>
            <span className="mt-1 text-xs text-gray-500">마이</span>
          </a>
        </div>
      </div>
    </div>
  );
}
