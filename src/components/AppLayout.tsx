import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopNav from "./TopNav";
import BottomTabBar from "./BottomTabBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

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

  // ✅ 현재 경로 기준으로 activeTab 설정
  const getActiveTab = () => {
    if (location.pathname === "/") return "home";
    if (location.pathname.startsWith("/education")) return "education"; // ✅ 추가
    if (location.pathname.startsWith("/trainers")) return "trainers";
    if (location.pathname.startsWith("/board")) return "board";
    if (location.pathname.startsWith("/mypage")) return "mypage";
    return "";
  };

  // ✅ 탭 클릭 시 navigate 처리
  const handleTabChange = (key: string) => {
    const routes: Record<string, string> = {
      home: "/",
      education: "/education", // ✅ 추가
      trainers: "/trainers",
      board: "/board",
      mypage: "/mypage",
    };
    setShowProfileMenu(false);
    navigate(routes[key]);
  };

  // "/"는 홈(HeroSection) → 패딩, max-width 없음. 그 외에는 900px, mx-auto 적용.
  const isHome = location.pathname === "/";

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
      {/* TopNav 영역 */}
      <div className="w-full bg-[#1A1B35]">
        <div className="mx-auto w-full max-w-[900px]">
          <TopNav
            showProfileMenu={showProfileMenu}
            setShowProfileMenu={setShowProfileMenu}
            setShowLogoutModal={setShowLogoutModal}
          />
        </div>
      </div>

      {/* 본문 */}
      <main
        className={
          isHome
            ? "w-full pt-[60px] pb-[64px] px-0"
            : "w-full max-w-[900px] mx-auto pt-[60px] pb-[64px] px-4"
        }
      >
        {children}
      </main>

      {/* 하단 탭바 */}
      <div className="w-full">
        <div className="mx-auto w-full max-w-[900px]">
          <BottomTabBar
            activeTab={getActiveTab()}
            onChange={handleTabChange}
          />
        </div>
      </div>

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
                  localStorage.clear();
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
