import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface TopNavProps {
  showProfileMenu: boolean;
  setShowProfileMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setShowLogoutModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TopNav({
  showProfileMenu,
  setShowProfileMenu,
  setShowLogoutModal,
}: TopNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (session) {
        setUserEmail(session.user.email ?? null);
        setUserName(session.user.user_metadata?.full_name ?? "회원님");
      } else {
        setUserEmail(null);
        setUserName(null);
      }
    };
    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchSession();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleUserIconClick = () => {
    if (userEmail) {
      setShowProfileMenu(!showProfileMenu);
    } else {
      navigate("/login");
    }
  };

  const getTitle = () => {
    const path = location.pathname;
    if (path.startsWith("/board/write")) return "글쓰기";
    if (path.startsWith("/board/") && path !== "/board") return "게시글 보기";
    if (path === "/board") return "게시판";
    if (path.startsWith("/trainers/") && path !== "/trainers") return "트레이너 프로필";
    if (path === "/trainers") return "트레이너 찾기";
    if (path === "/login") return "로그인";
    return "CESKT 인증 트레이너"; // 홈 or 기본
  };

  const isHome = location.pathname === "/";

  return (
    <div className="fixed bg-center mx-auto w-full max-w-[900px] z-50 shadow-md bg-[#1A1B35]">
      <div className="mx-auto w-full max-w-[900px] px-4 py-3 flex items-center justify-between text-white">
        <div className="flex items-center space-x-3">
          {!isHome && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-[#2A2B45] transition"
            >
              <i className="fas fa-arrow-left text-lg"></i>
            </button>
          )}
          <div className="text-xl font-bold">{getTitle()}</div>
        </div>

        <div className="flex items-center space-x-2">
          {userEmail && (
            <button className="p-2 rounded-full hover:bg-[#2A2B45] transition cursor-pointer">
              <i className="fas fa-bell text-lg"></i>
            </button>
          )}
          <div className="relative">
            <button
              onClick={handleUserIconClick}
              className="p-2 rounded-full hover:bg-[#2A2B45] transition cursor-pointer"
            >
              <i className="fas fa-user text-lg"></i>
            </button>
            {userEmail && showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 text-[#1A1B35]">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="font-semibold">{userName}</div>
                  <div className="text-xs text-gray-500">{userEmail}</div>
                </div>
                {[
                  { icon: "user", label: "프로필 보기" },
                  { icon: "cog", label: "계정 설정" },
                ].map((item, index) => (
                  <button
                    key={index}
                    className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                  >
                    <i className={`fas fa-${item.icon} text-gray-400 w-4`} />
                    <span>{item.label}</span>
                  </button>
                ))}
                <div className="border-t border-gray-100 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowLogoutModal(true);
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-50 flex items-center space-x-3"
                  >
                    <i className="fas fa-sign-out-alt text-red-600 w-4" />
                    <span>로그아웃</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
