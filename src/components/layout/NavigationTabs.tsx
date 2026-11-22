import React from 'react';
import { useApp, NavigationTab } from '../../context/AppContext';
import { 
  BarChart3, 
  CalendarClock, 
  Home, 
  Compass, 
  TrendingUp,
  Users, 
  Sparkles 
} from 'lucide-react';

interface TabItem {
  id: NavigationTab;
  label: string;
  hiLabel: string;
  icon: React.ElementType;
}

export const NavigationTabs: React.FC = () => {
  const { activeTab, setActiveTab, language } = useApp();

  const tabs: TabItem[] = [
    { id: 'dashboard', label: 'Air Intelligence', hiLabel: 'वायु स्थिति', icon: BarChart3 },
    { id: 'plan', label: 'My Air Plan', hiLabel: 'दैनिक कार्ययोजना', icon: CalendarClock },
    { id: 'indoor', label: 'Indoor Defense', hiLabel: 'घरेलू सुरक्षा', icon: Home },
    { id: 'commute', label: 'Cleaner Commute', hiLabel: 'सुरक्षित यात्रा', icon: Compass },
    { id: 'impact', label: 'Impact & Habits', hiLabel: 'प्रभाव व आदतें', icon: TrendingUp },
    { id: 'community', label: 'Community Bulletin', hiLabel: 'सामुदायिक सूचना', icon: Users },
    { id: 'assistant', label: 'Ask BreatheWise', hiLabel: 'AI सहायक', icon: Sparkles },
  ];

  return (
    <nav className="bg-white/80 border-b border-warm-200 sticky top-[94px] sm:top-[90px] z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-6">
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap min-h-[40px] ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-terracotta-500/15 text-orange-950 border border-orange-300/80 shadow-warm-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-warm-100/60'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-orange-700' : 'text-stone-400'}`} />
                <span>{language === 'hi' ? tab.hiLabel : tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
