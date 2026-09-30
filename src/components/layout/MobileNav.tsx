import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Calculator,
  Menu,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MobileNavProps {
  onOpenMenu: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenMenu }) => {
  const { activeTab, setActiveTab, unreadNotificationsCount } = useApp();

  const tabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'accounts', label: 'Accounts', icon: Calculator },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-slate-200 bg-white/95 px-2 py-1 shadow-lg backdrop-blur-md md:hidden dark:border-slate-800 dark:bg-slate-900/95">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 transition-transform active:scale-95 ${
              isActive
                ? 'text-orange-600 font-bold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-[11px] leading-tight mt-0.5">{tab.label}</span>
          </button>
        );
      })}

      {/* More / Menu Drawer Trigger */}
      <button
        onClick={onOpenMenu}
        className="relative flex flex-col items-center justify-center py-1 text-slate-600 hover:text-slate-900 active:scale-95 dark:text-slate-400"
      >
        <div className="relative">
          <Menu className="h-5 w-5 stroke-2" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 rounded-full bg-orange-600" />
          )}
        </div>
        <span className="text-[11px] leading-tight mt-0.5">More</span>
      </button>
    </nav>
  );
};
