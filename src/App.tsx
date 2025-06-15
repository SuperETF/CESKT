import MainLayout from "./components/layout/MainLayout";
import HeroSection from "./components/HeroSection";
import MapSection from "./components/MapSection";
import TrainerDirectorySection from "./components/TrainerDirectorySection";
import FacilitySection from "./components/FacilitySection";
import BoardSection from "./components/BoardSection";

function App() {
  return (
    <MainLayout>
      <HeroSection />
      <MapSection />
      {/* 여기만 실시간 supabase 트레이너 디렉토리 */}
      <TrainerDirectorySection />
      <FacilitySection />
      <BoardSection />
    </MainLayout>
  );
}

export default App;
