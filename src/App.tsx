import { HelmetProvider } from "react-helmet-async";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

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
import EducationPage from "./pages/EducationPage";

function AppRoutes() {
  const location = useLocation();

  // ✅ 페이드인만 적용된 variants
  const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <AppLayout>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          variants={fadeVariants}
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
            <Route path="/education" element={<EducationPage />} />
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
