import React from "react";
import { useNavigate } from "react-router-dom";

interface Post {
  id: number;
  category: string;
  title: string;
  authorName: string;
  authorImage?: string;
  created_at: string;
  views: number;
  likes: number;
  thumbnail?: string;
}

export default function PostCard({ post }: { post: Post }) {
  const navigate = useNavigate();
  const fallbackThumbnail = "https://via.placeholder.com/150x100?text=No+Image";
  const fallbackProfile = "https://placehold.co/40x40?text=👤";

  const formattedDate = post.created_at
    ? new Date(post.created_at).toLocaleDateString("ko-KR", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      })
    : "";

  // 이미지 오류 시 fallback 처리
  const [imgError, setImgError] = React.useState(false);

  return (
    <div
      className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:bg-gray-50 transition"
      onClick={() => navigate(`/board/${post.id}`)}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="w-24 h-20 rounded-lg overflow-hidden flex-shrink-0 mr-3">
          <img
  src={!imgError && post.thumbnail ? post.thumbnail : fallbackThumbnail}
  alt={post.title}
  className="w-full h-full object-cover object-top"
  onError={() => setImgError(true)}
/>
          </div>
          <div className="flex-1 min-w-0">
            <span className="inline-block px-2 py-0.5 bg-gray-100 text-[#1A1E27] rounded-full text-xs mb-1.5">
              {post.category}
            </span>
            <h3 className="text-base font-medium text-gray-800 mb-1 line-clamp-2">
              {post.title}
            </h3>
            <div className="flex items-center mt-2">
              <img
                src={post.authorImage || fallbackProfile}
                alt={post.authorName}
                className="w-5 h-5 rounded-full mr-1.5"
              />
              <span className="text-xs text-gray-600 mr-2">{post.authorName}</span>
              <span className="text-xs text-gray-500 mr-2">{formattedDate}</span>
              <div className="flex items-center text-xs text-gray-500">
                <i className="fas fa-eye mr-1 text-gray-400"></i>
                <span>{post.views}</span>
                <i className="fas fa-heart ml-2 mr-1 text-gray-400"></i>
                <span>{post.likes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
