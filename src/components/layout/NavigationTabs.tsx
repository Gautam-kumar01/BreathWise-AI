import React, { useRef, useState, useEffect } from 'react';
import { useApp, NavigationTab } from '../../context/AppContext';
import { 
  BarChart3, 
  CalendarClock, 
  Home, 
  Compass, 
  TrendingUp,
  Users, 
  Sparkles,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface TabItem {
  id: NavigationTab;
  label: string;
  hiLabel: string;
  icon: React.ElementType;
}

export const NavigationTabs: React.FC = () => {
  const { activeTab, setActiveTab, language } = useApp();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const tabs: TabItem[] = [
    { id: 'dashboard', label: 'Air Intelligence', hiLabel: 'वायु स्थिति', icon: BarChart3 },
    { id: 'plan', label: 'My Air Plan', hiLabel: 'दैनिक कार्ययोजना', icon: CalendarClock },
    { id: 'indoor', label: 'Indoor Defense', hiLabel: 'घरेलू सुरक्षा', icon: Home },
    { id: 'commute', label: 'Cleaner Commute', hiLabel: 'सुरक्षित यात्रा', icon: Compass },
    { id: 'impact', label: 'Impact & Habits', hiLabel: 'प्रभाव व आदतें', icon: TrendingUp },
    { id: 'community', label: 'Community Bulletin', hiLabel: 'सामुदायिक सूचना', icon: Users },
    { id: 'assistant', label: 'Ask BreatheWise', hiLabel: 'AI सहायक', icon: Sparkles },
  ];

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scrollBy = (offset: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <nav className="border-t border-warm-200/80 bg-white/95 relative">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 relative">
        {/* Left Scroll Fade Indicator (Mobile) */}
        {canScrollLeft && (
          <button
            onClick={() => scrollBy(-120)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 border border-warm-200 shadow-warm-xs flex items-center justify-center text-stone-600 sm:hidden"
            aria-label="Scroll tabs left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Scrollable Tabs Track */}
        <div 
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar scroll-smooth"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap min-h-[38px] sm:min-h-[40px] flex-shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-terracotta-500/15 text-orange-950 border border-orange-300/90 shadow-warm-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-warm-100/70 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${isActive ? 'text-orange-700' : 'text-stone-400'}`} />
                <span>{language === 'hi' ? tab.hiLabel : tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Scroll Fade Indicator (Mobile) */}
        {canScrollRight && (
          <button
            onClick={() => scrollBy(120)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 border border-warm-200 shadow-warm-xs flex items-center justify-center text-stone-600 sm:hidden"
            aria-label="Scroll tabs right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </nav>
  );
};
