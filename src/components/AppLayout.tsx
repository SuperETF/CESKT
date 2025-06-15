import React, { useState, useEffect } from "react";
import TopNav from "./TopNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // 바깥 클릭 시 프로필 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".relative")) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50 flex justify-center">
      <TopNav
        showProfileMenu={showProfileMenu}
        setShowProfileMenu={setShowProfileMenu}
        setShowLogoutModal={setShowLogoutModal}
      />
      <main className="w-full max-w-[900px] pt-[60px]">{children}</main>

      {/* 로그아웃 모달 */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] px-4">
          <div className="bg-white rounded-xl w-full max-w-xs p-6">
            <h3 className="text-lg font-bold text-center mb-4">
              로그아웃 하시겠습니까?
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors !rounded-button"
              >
                취소
              </button>
              <button
                onClick={() => {
                  // 여기에 실제 로그아웃 로직 추가
                  window.location.href = "/login";
                }}
                className="flex-1 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors !rounded-button"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
