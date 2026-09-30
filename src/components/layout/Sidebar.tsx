import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Compass,
  FileBox,
  Layers,
  HardHat,
  Calculator,
  FileCheck2,
  Bell,
  History,
  Building,
  ShieldAlert,
  Database,
  X,
  CreditCard,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const {
    activeTab,
    setActiveTab,
    projects,
    clients,
    files,
    unreadNotificationsCount,
    currentUser,
    currentCompany,
  } = useApp();

  const isSuperAdmin = currentUser.role === 'Super Admin';

  const pendingCorrections = files.filter(
    (f) => f.status === 'Correction Required' || f.status === 'Under Review'
  ).length;

  const navItems = [
    { id: 'dashboard', label: 'Main Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Project Portfolio', icon: FolderKanban, badge: projects.length },
    { id: 'clients', label: 'Client Management', icon: Users, badge: clients.length },
    { id: 'siteVisits', label: 'Site Visits & Allowance', icon: Compass },
    {
      id: 'files',
      label: 'Drawing & File Vault',
      icon: FileBox,
      badge: pendingCorrections > 0 ? `${pendingCorrections} rev` : undefined,
      badgeColor: 'bg-orange-500 text-white',
    },
    { id: 'soilTest', label: 'Soil Investigation & SPT', icon: Layers },
    { id: 'team', label: 'Engineers & Staff Payroll', icon: HardHat },
    { id: 'contractors', label: 'Contractors & Referrers', icon: Briefcase },
    { id: 'commitments', label: 'Payment Commitments', icon: CreditCard },
    { id: 'accounts', label: 'Accounting & Boksis', icon: Calculator },
    { id: 'reports', label: 'Reports & Statements', icon: FileCheck2 },
    {
      id: 'notifications',
      label: 'Notification Center',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
      badgeColor: 'bg-orange-600 text-white',
    },
    { id: 'audit', label: 'Audit Security Log', icon: History },
    { id: 'companySettings', label: 'Company Profile & Info', icon: Building },
    { id: 'backup', label: 'Backup & GitHub Vault', icon: Database },
  ];

  if (isSuperAdmin) {
    navItems.push({
      id: 'superAdmin',
      label: 'Super Admin: All Tenants',
      icon: ShieldAlert,
      badge: 'Master',
      badgeColor: 'bg-purple-600 text-white',
    });
  }

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800 bg-[#0F172A] text-slate-300 transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header inside sidebar */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 font-black text-white shadow-sm">
              HC
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight text-white">HYBRID CIVIL</p>
              <p className="text-[10px] text-slate-400">Engineering &amp; Consultancy</p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Managing Director & Brand banner */}
        <div className="border-b border-slate-800 bg-slate-900/60 p-3.5">
          <div className="rounded-lg bg-slate-800/80 p-2.5 border border-slate-700/60">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">
                Principal Consultant
              </span>
            </div>
            <p className="mt-1 text-xs font-bold text-white">
              {currentCompany.managingDirector}
            </p>
            <p className="text-[10px] text-orange-400 truncate">
              {currentCompany.managingDirectorQualifications || 'Structural Engineering Specialist'}
            </p>
          </div>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-orange-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeColor || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom App Info & System Status */}
        <div className="border-t border-slate-800 bg-slate-900/90 p-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Storage: Resilient Local / Git</span>
            </span>
            <span className="font-mono text-[10px] text-slate-400">v2.4.0</span>
          </div>
          <p className="mt-1 text-[10px] text-slate-400 truncate">
            {currentCompany.name}
          </p>
        </div>
      </aside>
    </>
  );
};
