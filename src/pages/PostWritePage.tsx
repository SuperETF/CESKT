import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { RichTextEditor } from "@mantine/rte";

function extractFirstImageSrc(html: string): string | null {
  const match = html.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
}

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
    const thumbnail = extractFirstImageSrc(content);

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("posts").insert([
        {
          title,
          category,
          content,
          images,
          user_id: userId,
          thumbnail, // ✅ 대표 이미지 저장
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
      {/* 네비, 입력 폼 등 기존 코드 그대로 사용 */}
      {/* ...생략... */}
      {/* 제출 버튼 */}
      <button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "등록 중..." : "등록"}
      </button>
      {submitStatus && (
        <div className={`mt-4 text-sm text-center font-medium ${submitStatus.type === "success" ? "text-green-600" : "text-red-600"}`}>
          {submitStatus.message}
        </div>
      )}
    </>
  );
}
