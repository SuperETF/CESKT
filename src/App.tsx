import { HelmetProvider } from "react-helmet-async";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";

import HomePage from "./pages/Homepage";
import TrainerPage from "./pages/TrainerPage";
import TrainerDetailPage from "./pages/TrainerDetailPage";
import BottomTabBar from "./components/BottomTabBar";
import AppLayout from "./components/AppLayout";
import BoardPage from "./pages/BoardPage";
import PostWritePage from "./pages/PostWritePage";
import PostDetailPage from "./pages/PostDetailPage";
import LoginPage from "./pages/LoginPage";
import MyPage from "./pages/MyPage"; // 상단 import 추가

// ✅ 탭 순서 정의 (for direction)
const tabOrder = ["home", "trainers", "board", "mypage"]; // ⬅️ mypage 추가


function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const prevTabIndexRef = useRef(0);

  // 현재 탭 키 계산
  const getTabKey = () => {
    if (location.pathname === "/trainers") return "trainers";
    if (location.pathname === "/board") return "board";
    if (location.pathname === "/mypage") return "mypage";
    if (location.pathname === "/") return "home";
    return null;
  };
  

  const currentTabKey = getTabKey();
  const currentIndex = currentTabKey ? tabOrder.indexOf(currentTabKey) : -1;
  const isTabRoute = currentIndex !== -1;

  const direction = isTabRoute
    ? currentIndex > prevTabIndexRef.current
      ? 1
      : -1
    : 0;

  if (isTabRoute) {
    prevTabIndexRef.current = currentIndex;
  }

  // ✅ 좌우 슬라이드 반전된 variants
  const variants = {
    initial: (dir: number) =>
      dir === 0 ? { opacity: 0 } : { opacity: 0, x: -dir * 100 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.25, ease: "easeOut" as const },
    },
    exit: (dir: number) =>
      dir === 0
        ? { opacity: 0 }
        : { opacity: 0, x: dir * 100, transition: { duration: 0.25, ease: "easeIn" as const } },
  };

  const isHome = location.pathname === "/";

  return (
    <AppLayout>
      <AnimatePresence mode="wait" custom={direction}>
        {isHome ? (
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
          </Routes>
        ) : (
          <motion.div
            key={location.pathname}
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Routes location={location}>
              <Route path="/trainers" element={<TrainerPage />} />
              <Route path="/trainers/:id" element={<TrainerDetailPage />} />
              <Route path="/board" element={<BoardPage />} />
              <Route path="/board/write" element={<PostWritePage />} />
              <Route path="/board/:id" element={<PostDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/mypage" element={<MyPage />} />
            </Routes>
          </motion.div>
        )}
      </AnimatePresence>

    </AppLayout>
  );
}

export default function App() {
  return (
    <HelmetProvider>
    <Router>
      <AppRoutes />
    </Router>
    </HelmetProvider>
  );
}
