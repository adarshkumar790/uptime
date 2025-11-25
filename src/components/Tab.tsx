
type TabOption = "Overview" | "Repositories" | "Projects" | "Packages" | "Stars";

interface TabsProps {
  activeTab: TabOption;
  setActiveTab: (tab: TabOption) => void;
}

export default function Tabs({ activeTab, setActiveTab }: TabsProps) {
  const tabs: TabOption[] = [
    "Overview",
    "Repositories",
    "Projects",
    "Packages",
    "Stars"
  ];

  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={activeTab === tab ? "tab active" : "tab"}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
