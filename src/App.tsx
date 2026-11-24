import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { NavigationTabs } from './components/layout/NavigationTabs';
import { ProfileDrawer } from './components/common/ProfileDrawer';
import { DashboardView } from './components/dashboard/DashboardView';
import { PlanView } from './components/plan/PlanView';
import { IndoorView } from './components/indoor/IndoorView';
import { CommuteView } from './components/commute/CommuteView';
import { ImpactView } from './components/impact/ImpactView';
import { CommunityView } from './components/community/CommunityView';
import { AssistantView } from './components/assistant/AssistantView';
import { ShieldCheck, HeartHandshake } from 'lucide-react';

export const App: React.FC = () => {
  const { activeTab } = useApp();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'plan':
        return <PlanView />;
      case 'indoor':
        return <IndoorView />;
      case 'commute':
        return <CommuteView />;
      case 'impact':
        return <ImpactView />;
      case 'community':
        return <CommunityView />;
      case 'assistant':
        return <AssistantView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-stone-900 selection:bg-amber-500/20 selection:text-amber-900">
      {/* Unified Sticky Header: Status Banner + Main Navbar + Navigation Tabs */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-warm-200 shadow-warm-xs">
        <Navbar />
        <NavigationTabs />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {renderActiveTab()}
      </main>

      {/* Profile & Context Drawer */}
      <ProfileDrawer />

      {/* Footer & Grounding Disclaimers */}
      <footer className="border-t border-warm-200 bg-white py-6 px-4 sm:px-6 lg:px-8 mt-12 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>
              <strong className="text-stone-800">BreatheWise AI</strong> • Grounded in Central Pollution Control Board (CPCB) benchmarks & atmospheric inversion science.
            </span>
          </div>

          <div className="flex items-center gap-2 text-stone-400 text-[11px] text-center md:text-right">
            <HeartHandshake className="w-3.5 h-3.5 text-stone-400 inline" />
            <span>
              General environmental & lifestyle decision guidance; does not replace medical advice or official emergency alerts.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
