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
  content?: string;
}

function extractTextFromHTML(html: string, maxLength = 60): string {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  const text = temp.textContent || temp.innerText || "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

export default function PostCard({ post }: { post: Post }) {
  const navigate = useNavigate();
  const fallbackThumbnail = "https://via.placeholder.com/300x180?text=No+Image";
  const fallbackProfile = "https://placehold.co/40x40?text=\ud83d\udc64";

  const formattedDate = post.created_at
    ? new Date(post.created_at).toLocaleDateString("ko-KR", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      })
    : "";

  const [imgError, setImgError] = React.useState(false);

  return (
    <div
      onClick={() => navigate(`/board/${post.id}`)}
      className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:bg-gray-50 transition"
    >
      <div className="flex flex-col sm:flex-row p-4 gap-4">
        {/* ✅ 썸네일 이미지 */}
        <div className="sm:w-[160px] w-full aspect-[16/9] rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={!imgError && post.thumbnail ? post.thumbnail : fallbackThumbnail}
            alt={post.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* ✅ 텍스트 콘텐츠 */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <span className="inline-block px-2 py-0.5 bg-gray-100 text-[#1A1E27] rounded-full text-xs mb-2">
              {post.category}
            </span>

            <h3 className="text-base font-medium text-gray-800 mb-1 line-clamp-2">
              {post.title}
            </h3>

            {post.content && (
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                {extractTextFromHTML(post.content)}
              </p>
            )}
          </div>

          <div className="flex items-center text-xs text-gray-500 mt-2 flex-wrap gap-2">
            <img
              src={post.authorImage || fallbackProfile}
              alt={post.authorName}
              className="w-5 h-5 rounded-full"
            />
            <span className="text-gray-600">{post.authorName}</span>
            <span className="text-gray-400">{formattedDate}</span>
            <div className="flex items-center gap-2 ml-auto">
              <span className="flex items-center">
                <i className="fas fa-eye mr-1 text-gray-400" />
                {post.views}
              </span>
              <span className="flex items-center">
                <i className="fas fa-heart mr-1 text-gray-400" />
                {post.likes}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
