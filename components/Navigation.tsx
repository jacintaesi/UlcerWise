import React from 'react';
import { Home, NotebookPen, HeartHandshake, User, Plus } from 'lucide-react';
import { Tab } from '../types';
import { COLORS } from '../constants';

interface NavigationProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  onAddPress: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, onAddPress }) => {
  const getIconColor = (tab: Tab) => activeTab === tab ? COLORS.primary : COLORS.textLight;
  const getLabelClass = (tab: Tab) => activeTab === tab ? `text-blue-600 font-bold` : 'text-slate-400 font-medium';

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-2 pb-safe flex justify-between items-end z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]" style={{ paddingBottom: 'env(safe-area-inset-bottom, 20px)' }}>
      
      <button onClick={() => setActiveTab('home')} className="flex flex-col items-center gap-1 p-2 active:scale-95 transition-transform">
        <Home size={24} color={getIconColor('home')} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
        <span className={`text-[10px] ${getLabelClass('home')}`}>Home</span>
      </button>

      <button onClick={() => setActiveTab('journal')} className="flex flex-col items-center gap-1 p-2 active:scale-95 transition-transform">
        <NotebookPen size={24} color={getIconColor('journal')} strokeWidth={activeTab === 'journal' ? 2.5 : 2} />
        <span className={`text-[10px] ${getLabelClass('journal')}`}>Journal</span>
      </button>

      {/* Floating Action Button (FAB) */}
      <div className="relative -top-6">
        <button 
            onClick={onAddPress}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl shadow-teal-700/20 transform transition active:scale-90 hover:scale-105"
            style={{ backgroundColor: COLORS.secondary }}
        >
            <Plus size={32} color={COLORS.white} strokeWidth={3} />
        </button>
      </div>

      <button onClick={() => setActiveTab('care')} className="flex flex-col items-center gap-1 p-2 active:scale-95 transition-transform">
        <HeartHandshake size={24} color={getIconColor('care')} strokeWidth={activeTab === 'care' ? 2.5 : 2} />
        <span className={`text-[10px] ${getLabelClass('care')}`}>Care</span>
      </button>

      <button onClick={() => setActiveTab('profile')} className="flex flex-col items-center gap-1 p-2 active:scale-95 transition-transform">
        <User size={24} color={getIconColor('profile')} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
        <span className={`text-[10px] ${getLabelClass('profile')}`}>Profile</span>
      </button>

    </div>
  );
};