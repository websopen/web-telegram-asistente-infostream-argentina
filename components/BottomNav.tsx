import React from 'react';
import { Youtube, Twitter, TrendingUp } from 'lucide-react';
import { Tab } from '../types';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const getButtonClass = (tab: Tab) => {
    const baseClass = "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200";
    const activeClass = "text-blue-500";
    const inactiveClass = "text-gray-400 hover:text-gray-200";
    return `${baseClass} ${activeTab === tab ? activeClass : inactiveClass}`;
  };

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full h-16 bg-gray-900 border-t border-gray-800 pb-safe">
      <div className="flex h-full max-w-lg mx-auto">
        <button
          onClick={() => onTabChange(Tab.YOUTUBE)}
          className={getButtonClass(Tab.YOUTUBE)}
        >
          <Youtube size={24} />
          <span className="text-xs font-medium">YouTube</span>
        </button>
        
        <button
          onClick={() => onTabChange(Tab.X)}
          className={getButtonClass(Tab.X)}
        >
          <Twitter size={24} /> {/* Using Twitter icon for X as it's recognizable */}
          <span className="text-xs font-medium">X</span>
        </button>
        
        <button
          onClick={() => onTabChange(Tab.FINANCE)}
          className={getButtonClass(Tab.FINANCE)}
        >
          <TrendingUp size={24} />
          <span className="text-xs font-medium">Finanzas</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
