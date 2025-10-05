"use client";

interface Tab {
  id: string;
  label: string;
  active: boolean;
}

interface TabsProps {
  tabs: Tab[];
  onTabChange: (tabId: string) => void;
}

export default function Tabs({ tabs, onTabChange }: TabsProps) {
  return (
    <div className="flex border-b mb-6">
      {tabs.map((tab) => (
        <button key={tab.id} onClick={() => onTabChange(tab.id)} className={`pb-3 px-1 mr-8 font-medium transition-colors ${tab.active ? "border-b-2 border-blue-500 text-blue-500" : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
