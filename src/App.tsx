import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { QuickActionModal } from './components/layout/QuickActionModal';
import { LoginModal } from './components/auth/LoginModal';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { ProjectList } from './components/projects/ProjectList';
import { ClientList } from './components/clients/ClientList';
import { SiteVisitManager } from './components/sitevisits/SiteVisitManager';
import { FileManager } from './components/files/FileManager';
import { SoilTestManager } from './components/soiltest/SoilTestManager';
import { TeamManager } from './components/team/TeamManager';
import { ContractorManager } from './components/contractors/ContractorManager';
import { CommitmentManager } from './components/commitments/CommitmentManager';
import { AccountingManager } from './components/accounting/AccountingManager';
import { ReportsManager } from './components/reports/ReportsManager';
import { NotificationCenter } from './components/notifications/NotificationCenter';
import { AuditLogViewer } from './components/audit/AuditLogViewer';
import { CompanySettingsModal } from './components/company/CompanySettingsModal';
import { BackupManager } from './components/backup/BackupManager';
import { SuperAdminCompanyManager } from './components/company/SuperAdminCompanyManager';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab, currentUser } = useApp();

  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleQuickAction = (actionKey: string) => {
    switch (actionKey) {
      case 'new-project':
        setActiveTab('projects');
        break;
      case 'new-client':
        setActiveTab('clients');
        break;
      case 'new-payment':
        setActiveTab('commitments');
        break;
      case 'new-site-visit':
        setActiveTab('siteVisits');
        break;
      case 'new-expense':
        setActiveTab('accounts');
        break;
      case 'new-file':
        setActiveTab('files');
        break;
      case 'new-soil-test':
        setActiveTab('soilTest');
        break;
      default:
        break;
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'projects':
        return <ProjectList />;
      case 'clients':
        return <ClientList />;
      case 'siteVisits':
        return <SiteVisitManager />;
      case 'files':
        return <FileManager />;
      case 'soilTest':
        return <SoilTestManager />;
      case 'team':
        return <TeamManager />;
      case 'contractors':
        return <ContractorManager />;
      case 'commitments':
        return <CommitmentManager />;
      case 'accounts':
        return <AccountingManager />;
      case 'reports':
        return <ReportsManager />;
      case 'notifications':
        return <NotificationCenter />;
      case 'audit':
        return <AuditLogViewer />;
      case 'companySettings':
        return <CompanySettingsModal />;
      case 'backup':
        return <BackupManager />;
      case 'superAdmin':
        return <SuperAdminCompanyManager />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-orange-500 selection:text-white">
      {/* Top Header */}
      <Header
        onOpenQuickAdd={() => setIsQuickActionOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onToggleSidebarMobile={() => setIsSidebarMobileOpen(!isSidebarMobileOpen)}
      />

      {/* Main Body with Sidebar & Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar + Mobile Drawer */}
        <Sidebar
          isOpenMobile={isSidebarMobileOpen}
          onCloseMobile={() => setIsSidebarMobileOpen(false)}
        />

        {/* Primary Viewport Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-20 md:pb-8">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation for Android & touch users */}
      <MobileNav onOpenMenu={() => setIsSidebarMobileOpen(true)} />

      {/* Global Modals */}
      <GlobalSearchModal />

      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        onTriggerAction={handleQuickAction}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
