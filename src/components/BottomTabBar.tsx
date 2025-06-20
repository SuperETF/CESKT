interface BottomTabBarProps {
  activeTab: string;
  onChange: (key: string) => void;
}

export default function BottomTabBar({ activeTab, onChange }: BottomTabBarProps) {
  const tabs = [
    { key: "home", label: "홈", icon: "fas fa-home" },
    { key: "education", label: "보수교육", icon: "fas fa-graduation-cap" },
    { key: "trainers", label: "트레이너", icon: "fas fa-dumbbell" },
    { key: "board", label: "게시판", icon: "fas fa-clipboard-list" },
    { key: "mypage", label: "마이", icon: "fas fa-user" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto w-full max-w-[900px] bg-white border-t border-gray-200 grid grid-cols-5 h-16">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`flex flex-col items-center justify-center cursor-pointer text-sm
              transition-colors duration-200 ease-in-out
              ${activeTab === tab.key ? "text-[#1A1B35]" : "text-gray-500 hover:text-[#1A1B35]"}`}
          >
            <i className={`${tab.icon} text-lg`} />
            <span className="text-xs mt-1">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
