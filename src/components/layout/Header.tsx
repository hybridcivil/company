import React, { useState } from 'react';
import {
  Search,
  Bell,
  Building2,
  User,
  Plus,
  ShieldCheck,
  ChevronDown,
  Layers,
  FileText,
  DollarSign,
  Compass,
  Briefcase,
  SlidersHorizontal,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onOpenQuickAdd: () => void;
  onOpenLogin: () => void;
  onToggleSidebarMobile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenQuickAdd,
  onOpenLogin,
  onToggleSidebarMobile,
}) => {
  const {
    currentUser,
    currentCompany,
    companies,
    setCurrentCompany,
    unreadNotificationsCount,
    setActiveTab,
    setIsGlobalSearchOpen,
  } = useApp();

  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isSuperAdmin = currentUser.role === 'Super Admin';

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-[#0F172A] px-4 text-white shadow-md sm:px-6">
      {/* Left: Mobile hamburger & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebarMobile}
          className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 focus:outline-none md:hidden"
          title="Open Menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Brand Identity */}
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 font-extrabold text-white shadow-sm shadow-orange-500/30">
            HC
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold tracking-wider text-white sm:text-base">
                HYBRID CIVIL
              </span>
              <span className="hidden rounded bg-orange-500/20 px-1.5 py-0.2 text-[10px] font-semibold text-orange-400 sm:inline-block">
                SYSTEM
              </span>
            </div>
            <p className="hidden text-[11px] font-medium text-slate-400 sm:block">
              {currentCompany.name}
            </p>
          </div>
        </div>
      </div>

      {/* Center: Global Search Bar Trigger */}
      <div className="mx-2 max-w-md flex-1 px-2 md:mx-6 md:px-0">
        <button
          onClick={() => setIsGlobalSearchOpen(true)}
          className="group flex w-full items-center justify-between rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs text-slate-400 shadow-inner transition hover:border-slate-600 hover:bg-slate-800 sm:px-4 sm:py-2 sm:text-sm"
        >
          <span className="flex items-center gap-2 overflow-hidden truncate">
            <Search className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-orange-400" />
            <span className="truncate">Search Client, Project, Drawing, Soil, Bill...</span>
          </span>
          <kbd className="hidden shrink-0 rounded border border-slate-600 bg-slate-900 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 sm:inline-block">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Quick actions, Company switcher, Notifications, User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Add Button */}
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-1 rounded-lg bg-orange-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-orange-500 active:scale-95 sm:px-3 sm:text-sm"
          title="Create New Project, Client, Bill, etc."
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Action</span>
        </button>

        {/* Company Selector (for Multi-tenant admin & super admin) */}
        {companies.length > 1 && (
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs text-slate-300 hover:border-slate-600"
            >
              <Building2 className="h-3.5 w-3.5 text-orange-400" />
              <span className="max-w-[120px] truncate font-medium">{currentCompany.name}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {isCompanyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-xl">
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Select Organization
                </div>
                {companies.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => {
                      setCurrentCompany(comp);
                      setIsCompanyDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition ${
                      comp.id === currentCompany.id
                        ? 'bg-orange-600/20 text-orange-400 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate">{comp.name}</span>
                    <span className="text-[10px] rounded bg-slate-800 px-1 text-slate-400">
                      {comp.plan}
                    </span>
                  </button>
                ))}
                {isSuperAdmin && (
                  <button
                    onClick={() => {
                      setActiveTab('superAdmin');
                      setIsCompanyDropdownOpen(false);
                    }}
                    className="mt-1 flex w-full items-center gap-1.5 border-t border-slate-800 px-2 pt-2 text-left text-xs text-orange-400 hover:underline"
                  >
                    <SlidersHorizontal className="h-3 w-3" /> Manage All Companies
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Notifications Button */}
        <button
          onClick={() => setActiveTab('notifications')}
          className="relative rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white"
          title="Notifications Center"
        >
          <Bell className="h-5 w-5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white shadow">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* User Profile & Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 p-1.5 text-xs text-slate-200 hover:border-slate-600 sm:px-2.5"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-600 text-[11px] font-bold text-white">
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold leading-tight text-white">{currentUser.name}</p>
              <p className="text-[10px] text-orange-400 font-medium">{currentUser.role}</p>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl">
              <div className="border-b border-slate-800 px-3 py-2">
                <p className="text-xs font-bold text-white">{currentUser.name}</p>
                <p className="text-[11px] text-slate-400">{currentUser.email}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="inline-flex items-center rounded-full bg-orange-500/20 px-2 py-0.5 text-[10px] font-semibold text-orange-400">
                    <ShieldCheck className="mr-1 h-3 w-3" /> {currentUser.role}
                  </span>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    onOpenLogin();
                    setIsUserMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <User className="h-4 w-4 text-orange-400" />
                  Switch Role / Account
                </button>

                <button
                  onClick={() => {
                    setActiveTab('companySettings');
                    setIsUserMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <Building2 className="h-4 w-4 text-slate-400" />
                  Company Profile & Letterhead
                </button>

                {isSuperAdmin && (
                  <button
                    onClick={() => {
                      setActiveTab('superAdmin');
                      setIsUserMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-orange-400 hover:bg-slate-800"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Multi-Company Admin Panel
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
