// PostWritePage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { RichTextEditor } from "@mantine/rte";

export default function PostWritePage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | { message: string; type: "success" | "error" }>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const categories = ["트레이닝 팁", "영양 정보", "건강 정보", "운동 루틴", "성공 사례"];

  const handleSubmit = async () => {
    setSubmitStatus(null);
    if (!title.trim() || !category || !content.trim()) {
      setSubmitStatus({ message: "모든 필드를 입력해주세요.", type: "error" });
      return;
    }
  
    const {
      data: { session },
    } = await supabase.auth.getSession();
  
    if (!session) {
      setSubmitStatus({ message: "로그인 후 작성 가능합니다.", type: "error" });
      return;
    }
  
    const userId = session.user.id;
  
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("posts").insert([
        {
          title,
          category,
          content,
          images,
          user_id: userId, // ✅ 반드시 전달
        },
      ]);
  
      if (error) throw error;
      setSubmitStatus({ message: "등록 완료", type: "success" });
      setTimeout(() => navigate("/board"), 1000);
    } catch (err) {
      console.error("게시글 등록 실패:", err);
      setSubmitStatus({ message: "등록 실패", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <>
      {/* 상단 네비게이션 바 */}
      <div className="bg-[#1A1B35] text-white z-50 shadow-md">
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[960px] px-4 py-3 flex items-center justify-between">
            <button className="p-2" onClick={() => navigate(-1)}>
              <i className="fas fa-arrow-left text-lg"></i>
            </button>
            <div className="text-lg font-bold text-center flex-1">글쓰기</div>
            <div className="p-2 w-5" />
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 py-6">
        {/* 카테고리 선택 */}
        <div className="mb-4 relative">
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            className="border px-4 py-3 rounded-lg cursor-pointer flex justify-between items-center text-sm"
          >
            <span className={category ? "text-gray-800" : "text-gray-400"}>
              {category || "카테고리 선택"}
            </span>
            <i className={`fas fa-chevron-down transition-transform ${showDropdown ? "rotate-180" : ""}`}></i>
          </div>
          {showDropdown && (
            <ul className="absolute w-full bg-white border rounded mt-1 shadow z-10">
              {categories.map((cat) => (
                <li
                  key={cat}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    setCategory(cat);
                    setShowDropdown(false);
                  }}
                >
                  {cat}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 제목 입력 */}
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-4 py-3 rounded-lg mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
        />

        {/* 본문 에디터 */}
        <RichTextEditor
          value={content}
          onChange={setContent}
          className="min-h-[500px] mb-6 rounded-lg border"
        />

        {/* 제출 버튼 */}
        <div className="flex space-x-3">
          <button
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-[#1A1E27] text-white rounded-lg font-medium hover:opacity-90"
          >
            {isSubmitting ? "등록 중..." : "등록"}
          </button>
        </div>

        {/* 상태 메시지 */}
        {submitStatus && (
          <div className={`mt-4 text-sm text-center font-medium ${submitStatus.type === "success" ? "text-green-600" : "text-red-600"}`}>
            {submitStatus.message}
          </div>
        )}
      </div>
    </>
  );
}