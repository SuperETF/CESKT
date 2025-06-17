import { HelmetProvider } from "react-helmet-async";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useRef } from "react";

// ✅ 페이지 & 레이아웃 import
import HomePage from "./pages/Homepage";
import TrainerPage from "./pages/TrainerPage";
import TrainerDetailPage from "./pages/TrainerDetailPage";
import BoardPage from "./pages/BoardPage";
import PostWritePage from "./pages/PostWritePage";
import PostDetailPage from "./pages/PostDetailPage";
import LoginPage from "./pages/LoginPage";
import MyPage from "./pages/MyPage";
import AppLayout from "./components/AppLayout";

// ✅ 탭 순서 기준 정의
const tabOrder = ["home", "trainers", "board", "mypage"];

function AppRoutes() {
  const location = useLocation();
  const prevTabIndexRef = useRef(0);

  const getTabKey = () => {
    if (location.pathname === "/") return "home";
    if (location.pathname.startsWith("/trainers")) return "trainers";
    if (location.pathname.startsWith("/board")) return "board";
    if (location.pathname.startsWith("/mypage")) return "mypage";
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

  // ✅ 부드러운 슬라이드 애니메이션 variants
  const variants: Variants = {
    initial: (dir: number) => ({
      opacity: 0,
      x: dir * 300,
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: -dir * 300,
      transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
    }),
  };

  return (
    <AppLayout>
      <AnimatePresence mode="wait" custom={direction}>
      <motion.div
  key={location.pathname}
  custom={direction}
  variants={variants}
  initial="initial"
  animate="animate"
  exit="exit"
  className="w-full"
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/trainers" element={<TrainerPage />} />
            <Route path="/trainers/:id" element={<TrainerDetailPage />} />
            <Route path="/board" element={<BoardPage />} />
            <Route path="/board/write" element={<PostWritePage />} />
            <Route path="/board/:id" element={<PostDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/mypage" element={<MyPage />} />
          </Routes>
        </motion.div>
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
