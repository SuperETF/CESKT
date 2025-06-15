import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import HomePage from "./pages/Homepage";
import TrainerPage from "./pages/TrainerPage";
import TrainerDetailPage from "./pages/TrainerDetailPage";
import BottomTabBar from "./components/BottomTabBar";
import AppLayout from "./components/AppLayout";
import BoardPage from "./pages/BoardPage";
import PostWritePage from "./pages/PostWritePage";
import PostDetailPage from "./pages/PostDetailPage";
import LoginPage from "./pages/LoginPage"; // 경로에 따라 수정



function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = () => {
    if (location.pathname === "/trainers") return "trainers";
    if (location.pathname === "/board") return "board";
    if (location.pathname === "/") return "home";
    return "";
  };
  

  return (
    <AppLayout>
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/trainers" element={<TrainerPage />} />
  <Route path="/trainers/:id" element={<TrainerDetailPage />} />
  <Route path="/board" element={<BoardPage />} /> {/* ✅ 이 줄 추가 */}
  <Route path="/board/write" element={<PostWritePage />} />
  <Route path="/board/:id" element={<PostDetailPage />} />
  <Route path="/login" element={<LoginPage />} />
</Routes>


      <BottomTabBar
        activeTab={getActiveTab()}
        onChange={(tabKey) => {
          if (tabKey === "home") navigate("/");
          if (tabKey === "trainers") navigate("/trainers");
          if (tabKey === "board") navigate("/board");
        }}
        
      />
    </AppLayout>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
