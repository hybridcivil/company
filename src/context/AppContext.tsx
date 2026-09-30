import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  UserRole,
  UserSession,
  Company,
  Client,
  LandInfo,
  Project,
  ServiceContract,
  Payment,
  BillCommitment,
  ProjectFile,
  FileVersion,
  FileDownloadHistory,
  FilePrintHistory,
  SiteVisit,
  SiteVisitAllowance,
  Employee,
  Contractor,
  Middleman,
  SoilTest,
  EmployeeSalary,
  OfficeExpense,
  AdvertisementExpense,
  BoksisRecord,
  Transaction,
  AuditLog,
  NotificationItem,
  DashboardMetrics,
} from '../types';
import { defaultStorage, AppDatabaseState, INITIAL_COMPANY_ID } from '../storage';

interface AppContextType {
  currentUser: UserSession;
  setCurrentUser: (user: UserSession) => void;
  currentCompany: Company;
  setCurrentCompany: (company: Company) => void;
  switchCompany: (companyId: string) => void;
  companies: Company[];
  
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;

  // Date filters
  dateRangeMode: 'today' | 'week' | 'month' | 'custom';
  setDateRangeMode: (mode: 'today' | 'week' | 'month' | 'custom') => void;
  customStartDate: string;
  setCustomStartDate: (date: string) => void;
  customEndDate: string;
  setCustomEndDate: (date: string) => void;

  // Data
  clients: Client[];
  lands: LandInfo[];
  projects: Project[];
  services: ServiceContract[];
  payments: Payment[];
  commitments: BillCommitment[];
  files: ProjectFile[];
  downloads: FileDownloadHistory[];
  prints: FilePrintHistory[];
  siteVisits: SiteVisit[];
  allowances: SiteVisitAllowance[];
  employees: Employee[];
  contractors: Contractor[];
  middlemen: Middleman[];
  soilTests: SoilTest[];
  salaries: EmployeeSalary[];
  expenses: OfficeExpense[];
  advertisements: AdvertisementExpense[];
  boksis: BoksisRecord[];
  transactions: Transaction[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];

  // CRUD Actions
  saveClient: (client: Client) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  saveProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  saveLand: (land: LandInfo) => Promise<void>;
  deleteLand: (id: string) => Promise<void>;
  saveService: (service: ServiceContract) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  savePayment: (payment: Payment) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
  saveCommitment: (commitment: BillCommitment) => Promise<void>;
  deleteCommitment: (id: string) => Promise<void>;
  
  // File management
  saveFile: (file: ProjectFile) => Promise<void>;
  addFileVersion: (fileId: string, versionData: Omit<FileVersion, 'versionNumber'>) => Promise<void>;
  markFileFinal: (fileId: string, versionNumber: number) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
  logFileDownload: (fileId: string, version: string, purpose?: string) => Promise<void>;
  logFilePrint: (fileId: string, version: string, count?: number, purpose?: string) => Promise<void>;

  // Site visits & Allowance
  saveSiteVisit: (visit: SiteVisit) => Promise<void>;
  deleteSiteVisit: (id: string) => Promise<void>;
  saveAllowance: (allowance: SiteVisitAllowance) => Promise<void>;
  deleteAllowance: (id: string) => Promise<void>;

  // Employees, Contractors, Middlemen
  saveEmployee: (emp: Employee) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  saveContractor: (cnt: Contractor) => Promise<void>;
  deleteContractor: (id: string) => Promise<void>;
  saveMiddleman: (mid: Middleman) => Promise<void>;
  deleteMiddleman: (id: string) => Promise<void>;

  // Soil Investigation
  saveSoilTest: (soil: SoilTest) => Promise<void>;
  deleteSoilTest: (id: string) => Promise<void>;

  // Salaries & Expenses
  saveSalary: (salary: EmployeeSalary) => Promise<void>;
  deleteSalary: (id: string) => Promise<void>;
  saveExpense: (exp: OfficeExpense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  saveAdvertisement: (ad: AdvertisementExpense) => Promise<void>;
  deleteAdvertisement: (id: string) => Promise<void>;
  saveBoksis: (boksis: BoksisRecord) => Promise<void>;
  deleteBoksis: (id: string) => Promise<void>;

  // Transactions
  saveTransaction: (trx: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;

  // Notifications & Audit
  markNotificationRead: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  logAuditAction: (action: AuditLog['action'], module: string, recordId: string, details: string) => Promise<void>;

  // Company / Multi-tenant actions
  updateCompanyProfile: (company: Company) => Promise<void>;
  createCompany: (company: Company) => Promise<void>;
  toggleCompanyStatus: (companyId: string) => Promise<void>;

  // Backup & Storage
  exportDataJSON: () => Promise<string>;
  importDataJSON: (jsonString: string) => Promise<boolean>;
  syncGitHubVault: () => Promise<{ success: boolean; message: string }>;

  // Metrics
  dashboardMetrics: DashboardMetrics;
  unreadNotificationsCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialUser: UserSession = {
  id: 'emp-001',
  name: 'Engr. Ashraf',
  email: 'ashraf@hybridcivil.com',
  role: 'Managing Director',
  companyId: INITIAL_COMPANY_ID,
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dbState, setDbState] = useState<AppDatabaseState | null>(null);
  const [currentUser, setCurrentUser] = useState<UserSession>(initialUser);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  // Date filters
  const [dateRangeMode, setDateRangeMode] = useState<'today' | 'week' | 'month' | 'custom'>('month');
  const [customStartDate, setCustomStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  });
  const [customEndDate, setCustomEndDate] = useState<string>(() => {
    return new Date().toISOString().slice(0, 10);
  });

  // Load database on mount
  useEffect(() => {
    async function loadData() {
      await defaultStorage.init();
      const state = await defaultStorage.getState();
      setDbState(state);
    }
    loadData();
  }, []);

  const companies = dbState?.companies || [];
  const currentCompany = useMemo(() => {
    if (!companies.length) {
      return {
        id: INITIAL_COMPANY_ID,
        name: 'Hybrid Civil Engineering & Consultancy',
        slogan: 'Precision Engineering & Sustainable Architecture',
        managingDirector: 'Engr. Ashraf',
        managingDirectorQualifications: 'B.Eng, M.Sc.Sc (Structural Engineering)',
        email: 'info@hybridcivil.com',
        phone: '+880 1712-345678',
        address: 'Dhanmondi, Dhaka',
        currencySymbol: '৳',
        status: 'active' as const,
        plan: 'Enterprise' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    const found = companies.find((c) => c.id === currentUser.companyId);
    return found || companies[0];
  }, [companies, currentUser.companyId]);

  const setCurrentCompany = (comp: Company) => {
    setCurrentUser((prev) => ({
      ...prev,
      companyId: comp.id,
    }));
  };

  // Scope data to current company (except for Super Admin who can see all if desired, but default to current active company)
  const isSuperAdmin = currentUser.role === 'Super Admin';
  const filterByCompany = <T extends { companyId: string }>(items?: T[]): T[] => {
    if (!items) return [];
    if (isSuperAdmin && currentUser.companyId === 'all') return items;
    return items.filter((x) => x.companyId === currentCompany.id);
  };

  const clients = useMemo(() => filterByCompany(dbState?.clients), [dbState?.clients, currentCompany.id, isSuperAdmin, currentUser.companyId]);
  const lands = useMemo(() => filterByCompany(dbState?.lands), [dbState?.lands, currentCompany.id, isSuperAdmin, currentUser.companyId]);
  const projects = useMemo(() => filterByCompany(dbState?.projects), [dbState?.projects, currentCompany.id, isSuperAdmin, currentUser.companyId]);
  const services = useMemo(() => filterByCompany(dbState?.services), [dbState?.services, currentCompany.id, isSuperAdmin, currentUser.companyId]);
  const payments = useMemo(() => filterByCompany(dbState?.payments), [dbState?.payments, currentCompany.id, isSuperAdmin, currentUser.companyId]);
  const commitments = useMemo(() => filterByCompany(dbState?.commitments), [dbState?.commitments, currentCompany.id, isSuperAdmin, currentUser.companyId]);
  const files = useMemo(() => filterByCompany(dbState?.files), [dbState?.files, currentCompany.id, isSuperAdmin, currentUser.companyId]);
  const downloads = useMemo(() => filterByCompany(dbState?.downloads), [dbState?.downloads, currentCompany.id, isSuperAdmin, currentUser.companyId]);
  const prints = useMemo(() => filterByCompany(dbState?.prints), [dbState?.prints, currentCompany.id, isSuperAdmin, currentUser.companyId]);
  const siteVisits = useMemo(() => filterByCompany(dbState?.siteVisits), [dbState?.siteVisits, currentCompany.id, isSuperAdmin, currentUser.companyId]);
  const allowances = useMemo(() => filterByCompany(dbState?.allowances), [dbState?.allowances, currentCompany.id, isSuperAdmin, currentUser.companyId]);
  const employees = useMemo(() => filterByCompany(dbState?.employees), [dbState?.employees, currentCompany.id, isSuperAdmin, currentUser.companyId]);
  const contractors = useMemo(() => filterByCompany(dbState?.contractors), [dbState?.contractors, currentCompany.id, isSuperAdmin, currentUser.companyId]);
  const middlemen = useMemo(() => filterByCompany(dbState?.middlemen), [dbState?.middlemen, currentCompany.id, isSuperAdmin, currentUser.companyId]);
  const soilTests = useMemo(() => filterByCompany(dbState?.soilTests), [dbState?.soilTests, currentCompany.id, isSuperAdmin, currentUser.companyId]);
  const salaries = useMemo(() => filterByCompany(dbState?.salaries), [dbState?.salaries, currentCompany.id, isSuperAdmin, currentUser.companyId]);
  const expenses = useMemo(() => filterByCompany(dbState?.expenses), [dbState?.expenses, currentCompany.id, isSuperAdmin, currentUser.companyId]);
  const advertisements = useMemo(() => filterByCompany(dbState?.advertisements), [dbState?.advertisements, currentCompany.id, isSuperAdmin, currentUser.companyId]);
  const boksis = useMemo(() => filterByCompany(dbState?.boksis), [dbState?.boksis, currentCompany.id, isSuperAdmin, currentUser.companyId]);
  const transactions = useMemo(() => filterByCompany(dbState?.transactions), [dbState?.transactions, currentCompany.id, isSuperAdmin, currentUser.companyId]);
  const auditLogs = useMemo(() => filterByCompany(dbState?.auditLogs), [dbState?.auditLogs, currentCompany.id, isSuperAdmin, currentUser.companyId]);
  const notifications = useMemo(() => filterByCompany(dbState?.notifications), [dbState?.notifications, currentCompany.id, isSuperAdmin, currentUser.companyId]);

  // Helper to persist state & refresh local React state
  const commitStateChange = async (newState: AppDatabaseState) => {
    setDbState({ ...newState });
    await defaultStorage.saveState(newState);
  };

  const logAuditAction = async (action: AuditLog['action'], module: string, recordId: string, details: string) => {
    const item: AuditLog = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      companyId: currentCompany.id,
      user: currentUser.name,
      action,
      module,
      recordId,
      details,
      timestamp: new Date().toISOString(),
    };
    if (dbState) {
      const updated = {
        ...dbState,
        auditLogs: [item, ...(dbState.auditLogs || [])],
      };
      await commitStateChange(updated);
    }
  };

  // CLIENT CRUD
  const saveClient = async (client: Client) => {
    if (!dbState) return;
    const now = new Date().toISOString();
    const updatedClient = {
      ...client,
      companyId: client.companyId || currentCompany.id,
      updatedAt: now,
      createdAt: client.createdAt || now,
    };
    const list = [...dbState.clients];
    const idx = list.findIndex((c) => c.id === client.id);
    if (idx >= 0) {
      list[idx] = updatedClient;
      await logAuditAction('EDIT', 'Clients', client.id, `Updated client ${client.name}`);
    } else {
      list.unshift(updatedClient);
      await logAuditAction('CREATE', 'Clients', client.id, `Created new client ${client.name} (${client.clientCode})`);
    }
    await commitStateChange({ ...dbState, clients: list });
  };

  const deleteClient = async (id: string) => {
    if (!dbState) return;
    const client = dbState.clients.find((c) => c.id === id);
    const updated = {
      ...dbState,
      clients: dbState.clients.filter((c) => c.id !== id),
    };
    await logAuditAction('DELETE', 'Clients', id, `Deleted client ${client?.name || id}`);
    await commitStateChange(updated);
  };

  // PROJECT CRUD
  const saveProject = async (project: Project) => {
    if (!dbState) return;
    const now = new Date().toISOString();
    const updatedProject = {
      ...project,
      companyId: project.companyId || currentCompany.id,
      updatedAt: now,
      createdAt: project.createdAt || now,
      dueAmount: Math.max(0, (project.contractAmount || 0) - (project.paidAmount || 0)),
    };
    const list = [...dbState.projects];
    const idx = list.findIndex((p) => p.id === project.id);
    if (idx >= 0) {
      list[idx] = updatedProject;
      await logAuditAction('EDIT', 'Projects', project.id, `Updated project ${project.name} (${project.currentStage})`);
    } else {
      list.unshift(updatedProject);
      await logAuditAction('CREATE', 'Projects', project.id, `Created new project ${project.name} [${project.storeys} Storey, ${project.foundationType}]`);
    }
    await commitStateChange({ ...dbState, projects: list });
  };

  const deleteProject = async (id: string) => {
    if (!dbState) return;
    const proj = dbState.projects.find((p) => p.id === id);
    const updated = {
      ...dbState,
      projects: dbState.projects.filter((p) => p.id !== id),
    };
    await logAuditAction('DELETE', 'Projects', id, `Deleted project ${proj?.name || id}`);
    await commitStateChange(updated);
  };

  // LAND CRUD
  const saveLand = async (land: LandInfo) => {
    if (!dbState) return;
    const now = new Date().toISOString();
    const updatedLand = {
      ...land,
      companyId: land.companyId || currentCompany.id,
      updatedAt: now,
      createdAt: land.createdAt || now,
    };
    const list = [...dbState.lands];
    const idx = list.findIndex((l) => l.id === land.id);
    if (idx >= 0) {
      list[idx] = updatedLand;
      await logAuditAction('EDIT', 'Land', land.id, `Updated land information for project ${land.projectId}`);
    } else {
      list.unshift(updatedLand);
      await logAuditAction('CREATE', 'Land', land.id, `Added land record: ${land.landArea} (${land.decimal} Dec) in ${land.mouza}`);
    }
    await commitStateChange({ ...dbState, lands: list });
  };

  const deleteLand = async (id: string) => {
    if (!dbState) return;
    const updated = {
      ...dbState,
      lands: dbState.lands.filter((l) => l.id !== id),
    };
    await logAuditAction('DELETE', 'Land', id, `Deleted land record ${id}`);
    await commitStateChange(updated);
  };

  // SERVICE & CONTRACT MANAGEMENT (Auto calculates: finalContractAmount = agreedPrice - discount, due = finalContractAmount - paid)
  const saveService = async (service: ServiceContract) => {
    if (!dbState) return;
    const now = new Date().toISOString();
    const finalAmount = Math.max(0, (service.agreedPrice || 0) - (service.discount || 0));
    const dueAmount = Math.max(0, finalAmount - (service.paid || 0));

    const updatedService: ServiceContract = {
      ...service,
      companyId: service.companyId || currentCompany.id,
      finalContractAmount: finalAmount,
      due: dueAmount,
      updatedAt: now,
      createdAt: service.createdAt || now,
    };

    const list = [...dbState.services];
    const idx = list.findIndex((s) => s.id === service.id);
    if (idx >= 0) {
      list[idx] = updatedService;
      await logAuditAction('CONTRACT', 'Services', service.id, `Updated contract service: ${service.serviceName} (৳${finalAmount})`);
    } else {
      list.unshift(updatedService);
      await logAuditAction('CONTRACT', 'Services', service.id, `Created service contract: ${service.serviceName} (৳${finalAmount})`);
    }

    // Sync project contract and due totals
    const projectServices = list.filter((s) => s.projectId === service.projectId);
    const totalContract = projectServices.reduce((sum, s) => sum + s.finalContractAmount, 0);
    const totalPaid = projectServices.reduce((sum, s) => sum + s.paid, 0);

    const projectList = dbState.projects.map((p) => {
      if (p.id === service.projectId) {
        return {
          ...p,
          contractAmount: totalContract,
          paidAmount: totalPaid,
          dueAmount: Math.max(0, totalContract - totalPaid),
        };
      }
      return p;
    });

    await commitStateChange({
      ...dbState,
      services: list,
      projects: projectList,
    });
  };

  const deleteService = async (id: string) => {
    if (!dbState) return;
    const srv = dbState.services.find((s) => s.id === id);
    const updatedServices = dbState.services.filter((s) => s.id !== id);
    await logAuditAction('DELETE', 'Services', id, `Removed service ${srv?.serviceName}`);
    await commitStateChange({ ...dbState, services: updatedServices });
  };

  // PAYMENT SYSTEM (Auto updates project and records accounting transaction)
  const savePayment = async (payment: Payment) => {
    if (!dbState) return;
    const now = new Date().toISOString();
    const updatedPayment = {
      ...payment,
      companyId: payment.companyId || currentCompany.id,
      updatedAt: now,
      createdAt: payment.createdAt || now,
    };

    const paymentList = [...dbState.payments];
    const idx = paymentList.findIndex((p) => p.id === payment.id);
    if (idx >= 0) {
      paymentList[idx] = updatedPayment;
      await logAuditAction('PAYMENT', 'Payments', payment.id, `Updated payment voucher ${payment.receiptNo} of ৳${payment.amount}`);
    } else {
      paymentList.unshift(updatedPayment);
      await logAuditAction('PAYMENT', 'Payments', payment.id, `Recorded payment voucher ${payment.receiptNo} of ৳${payment.amount} from ${payment.clientName}`);
    }

    // Recalculate project paid/due
    const projectPayments = paymentList.filter((p) => p.projectId === payment.projectId);
    const totalProjectPaid = projectPayments.reduce((sum, p) => sum + p.amount, 0);

    const projectList = dbState.projects.map((p) => {
      if (p.id === payment.projectId) {
        return {
          ...p,
          paidAmount: totalProjectPaid,
          dueAmount: Math.max(0, p.contractAmount - totalProjectPaid),
        };
      }
      return p;
    });

    // Record accounting income transaction
    const transactionItem: Transaction = {
      id: `trx-pay-${payment.id}`,
      companyId: currentCompany.id,
      date: payment.date,
      type: 'Income',
      amount: payment.amount,
      category: 'Client Collection',
      clientId: payment.clientId,
      projectId: payment.projectId,
      person: payment.clientName,
      description: `Payment receipt #${payment.receiptNo} via ${payment.paymentMethod} (${payment.notes || 'Client Payment'})`,
      reference: payment.reference || payment.receiptNo,
      createdBy: currentUser.name,
      createdAt: now,
      updatedAt: now,
    };

    const trxList = [...dbState.transactions.filter((t) => t.id !== transactionItem.id), transactionItem];

    await commitStateChange({
      ...dbState,
      payments: paymentList,
      projects: projectList,
      transactions: trxList,
    });
  };

  const deletePayment = async (id: string) => {
    if (!dbState) return;
    const payment = dbState.payments.find((p) => p.id === id);
    const updatedPayments = dbState.payments.filter((p) => p.id !== id);
    
    // Recalculate project
    let projectList = dbState.projects;
    if (payment) {
      const remainingForProj = updatedPayments.filter((p) => p.projectId === payment.projectId);
      const totalPaid = remainingForProj.reduce((sum, p) => sum + p.amount, 0);
      projectList = dbState.projects.map((p) => {
        if (p.id === payment.projectId) {
          return {
            ...p,
            paidAmount: totalPaid,
            dueAmount: Math.max(0, p.contractAmount - totalPaid),
          };
        }
        return p;
      });
    }

    const updatedTrx = dbState.transactions.filter((t) => t.id !== `trx-pay-${id}`);
    await logAuditAction('DELETE', 'Payments', id, `Cancelled payment voucher ${payment?.receiptNo}`);
    await commitStateChange({
      ...dbState,
      payments: updatedPayments,
      projects: projectList,
      transactions: updatedTrx,
    });
  };

  // CLIENT COMMITMENTS
  const saveCommitment = async (commitment: BillCommitment) => {
    if (!dbState) return;
    const now = new Date().toISOString();
    // Auto status determination based on date and cleared status
    let status = commitment.status;
    const today = new Date().toISOString().slice(0, 10);
    if (status !== 'Cleared') {
      if (commitment.commitmentDate < today) {
        status = 'Overdue';
      } else if (commitment.commitmentDate === today) {
        status = 'Due Today';
      } else {
        status = 'Upcoming';
      }
    }

    const updated: BillCommitment = {
      ...commitment,
      companyId: commitment.companyId || currentCompany.id,
      status,
      updatedAt: now,
      createdAt: commitment.createdAt || now,
    };

    const list = [...dbState.commitments];
    const idx = list.findIndex((c) => c.id === commitment.id);
    if (idx >= 0) {
      list[idx] = updated;
      await logAuditAction('EDIT', 'Commitments', commitment.id, `Updated commitment of ৳${commitment.dueAmount} (${status})`);
    } else {
      list.unshift(updated);
      await logAuditAction('CREATE', 'Commitments', commitment.id, `Added payment commitment of ৳${commitment.dueAmount} due on ${commitment.commitmentDate}`);
    }

    // Auto notification if due or overdue
    let notificationsList = [...dbState.notifications];
    if (status === 'Due Today' || status === 'Overdue') {
      const notifItem: NotificationItem = {
        id: `notif-cmt-${commitment.id}-${Date.now()}`,
        companyId: currentCompany.id,
        type: status === 'Overdue' ? 'payment_overdue' : 'payment_due',
        title: status === 'Overdue' ? `Overdue Bill: ${commitment.clientName}` : `Bill Due Today: ${commitment.clientName}`,
        message: `Commitment of ৳${commitment.dueAmount.toLocaleString()} for project ${commitment.projectName} is ${status.toLowerCase()}.`,
        date: commitment.commitmentDate,
        read: false,
        linkTab: 'commitments',
        createdAt: now,
      };
      notificationsList = [notifItem, ...notificationsList];
    }

    await commitStateChange({ ...dbState, commitments: list, notifications: notificationsList });
  };

  const deleteCommitment = async (id: string) => {
    if (!dbState) return;
    const updated = {
      ...dbState,
      commitments: dbState.commitments.filter((c) => c.id !== id),
    };
    await logAuditAction('DELETE', 'Commitments', id, `Deleted commitment ${id}`);
    await commitStateChange(updated);
  };

  // FILE & DRAWING MANAGEMENT (Never overwrite historical versions, upload correction workflow, download & print history)
  const saveFile = async (file: ProjectFile) => {
    if (!dbState) return;
    const now = new Date().toISOString();
    const updatedFile = {
      ...file,
      companyId: file.companyId || currentCompany.id,
      updatedAt: now,
      createdAt: file.createdAt || now,
    };
    const list = [...dbState.files];
    const idx = list.findIndex((f) => f.id === file.id);
    if (idx >= 0) {
      list[idx] = updatedFile;
      await logAuditAction('EDIT', 'Files', file.id, `Updated drawing file ${file.fileName}`);
    } else {
      list.unshift(updatedFile);
      await logAuditAction('UPLOAD', 'Files', file.id, `Uploaded new ${file.category} drawing: ${file.fileName} [V01]`);
    }
    await commitStateChange({ ...dbState, files: list });
  };

  const addFileVersion = async (
    fileId: string,
    versionData: Omit<FileVersion, 'versionNumber'>
  ) => {
    if (!dbState) return;
    const now = new Date().toISOString();
    const file = dbState.files.find((f) => f.id === fileId);
    if (!file) return;

    const nextVerNumber = (file.versions?.length || 0) + 1;
    const nextVerCode = `V0${nextVerNumber}`;
    const newVersion: FileVersion = {
      ...versionData,
      versionNumber: nextVerNumber,
      versionLabel: `${nextVerCode} ${versionData.isFinal ? 'Final' : 'Correction'}`,
      uploadDate: now,
      uploadedBy: currentUser.name,
    };

    const updatedVersions = [...(file.versions || []), newVersion];
    const updatedFile: ProjectFile = {
      ...file,
      currentVersion: nextVerCode,
      status: versionData.isFinal ? 'Final' : 'Correction Required',
      versions: updatedVersions,
      updatedAt: now,
    };

    const filesList = dbState.files.map((f) => (f.id === fileId ? updatedFile : f));
    await logAuditAction('CORRECTION', 'Files', fileId, `Uploaded correction version ${nextVerCode} for ${file.fileName}. Note: ${versionData.correctionNote || 'Revision applied'}`);
    await commitStateChange({ ...dbState, files: filesList });
  };

  const markFileFinal = async (fileId: string, versionNumber: number) => {
    if (!dbState) return;
    const file = dbState.files.find((f) => f.id === fileId);
    if (!file) return;

    const updatedVersions = (file.versions || []).map((v) => ({
      ...v,
      isFinal: v.versionNumber === versionNumber,
      versionLabel: v.versionNumber === versionNumber ? `${v.versionLabel.replace(' Correction', '')} Final Approved` : v.versionLabel,
    }));

    const targetVer = updatedVersions.find((v) => v.versionNumber === versionNumber);
    const updatedFile: ProjectFile = {
      ...file,
      status: 'Final',
      currentVersion: targetVer ? `V0${targetVer.versionNumber}` : file.currentVersion,
      versions: updatedVersions,
      updatedAt: new Date().toISOString(),
    };

    const filesList = dbState.files.map((f) => (f.id === fileId ? updatedFile : f));
    await logAuditAction('EDIT', 'Files', fileId, `Marked version V0${versionNumber} as Final Approved for ${file.fileName}`);
    await commitStateChange({ ...dbState, files: filesList });
  };

  const deleteFile = async (id: string) => {
    if (!dbState) return;
    const file = dbState.files.find((f) => f.id === id);
    const updated = {
      ...dbState,
      files: dbState.files.filter((f) => f.id !== id),
    };
    await logAuditAction('DELETE', 'Files', id, `Deleted drawing archive ${file?.fileName}`);
    await commitStateChange(updated);
  };

  const logFileDownload = async (fileId: string, version: string, purpose?: string) => {
    if (!dbState) return;
    const file = dbState.files.find((f) => f.id === fileId);
    const downloadItem: FileDownloadHistory = {
      id: `dwn-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      companyId: currentCompany.id,
      fileId,
      fileName: file?.fileName || 'File',
      version,
      downloadedBy: currentUser.name,
      downloadedAt: new Date().toISOString(),
      purpose: purpose || 'Engineering review & field application',
    };
    await logAuditAction('DOWNLOAD', 'Files', fileId, `Downloaded ${file?.fileName} [${version}] by ${currentUser.name}`);
    await commitStateChange({
      ...dbState,
      downloads: [downloadItem, ...(dbState.downloads || [])],
    });
  };

  const logFilePrint = async (fileId: string, version: string, count: number = 1, purpose?: string) => {
    if (!dbState) return;
    const file = dbState.files.find((f) => f.id === fileId);
    const printItem: FilePrintHistory = {
      id: `prt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      companyId: currentCompany.id,
      fileId,
      fileName: file?.fileName || 'File',
      version,
      printedBy: currentUser.name,
      printedAt: new Date().toISOString(),
      printCount: count,
      purpose: purpose || 'Official blueprint transmittal for site',
    };
    await logAuditAction('PRINT', 'Files', fileId, `Printed ${count} copies of ${file?.fileName} [${version}]`);
    await commitStateChange({
      ...dbState,
      prints: [printItem, ...(dbState.prints || [])],
    });
  };

  // SITE VISITS & ALLOWANCES
  const saveSiteVisit = async (visit: SiteVisit) => {
    if (!dbState) return;
    const now = new Date().toISOString();
    const updatedVisit = {
      ...visit,
      companyId: visit.companyId || currentCompany.id,
      updatedAt: now,
      createdAt: visit.createdAt || now,
    };
    const list = [...dbState.siteVisits];
    const idx = list.findIndex((v) => v.id === visit.id);
    if (idx >= 0) {
      list[idx] = updatedVisit;
      await logAuditAction('EDIT', 'SiteVisits', visit.id, `Updated site inspection report for ${visit.projectName}`);
    } else {
      list.unshift(updatedVisit);
      await logAuditAction('CREATE', 'SiteVisits', visit.id, `Conducted site visit at ${visit.projectName} by ${visit.engineerName}`);
    }

    // Auto update project stage & progress if provided
    let projectList = dbState.projects;
    if (visit.currentWorkStage || visit.progressPercent) {
      projectList = projectList.map((p) => {
        if (p.id === visit.projectId) {
          return {
            ...p,
            progressPercent: visit.progressPercent || p.progressPercent,
          };
        }
        return p;
      });
    }

    await commitStateChange({
      ...dbState,
      siteVisits: list,
      projects: projectList,
    });
  };

  const deleteSiteVisit = async (id: string) => {
    if (!dbState) return;
    const updated = {
      ...dbState,
      siteVisits: dbState.siteVisits.filter((v) => v.id !== id),
    };
    await logAuditAction('DELETE', 'SiteVisits', id, `Deleted site visit record ${id}`);
    await commitStateChange(updated);
  };

  const saveAllowance = async (allowance: SiteVisitAllowance) => {
    if (!dbState) return;
    const now = new Date().toISOString();
    const updated = {
      ...allowance,
      companyId: allowance.companyId || currentCompany.id,
      updatedAt: now,
      createdAt: allowance.createdAt || now,
    };
    const list = [...dbState.allowances];
    const idx = list.findIndex((a) => a.id === allowance.id);
    if (idx >= 0) {
      list[idx] = updated;
    } else {
      list.unshift(updated);
    }
    await logAuditAction('EDIT', 'Allowances', allowance.id, `Recorded site allowance of ৳${allowance.amount} for ${allowance.engineerName}`);
    await commitStateChange({ ...dbState, allowances: list });
  };

  const deleteAllowance = async (id: string) => {
    if (!dbState) return;
    const updated = {
      ...dbState,
      allowances: dbState.allowances.filter((a) => a.id !== id),
    };
    await logAuditAction('DELETE', 'Allowances', id, `Removed site allowance ${id}`);
    await commitStateChange(updated);
  };

  // TEAM & STAFF CRUD
  const saveEmployee = async (emp: Employee) => {
    if (!dbState) return;
    const now = new Date().toISOString();
    const updated = {
      ...emp,
      companyId: emp.companyId || currentCompany.id,
      updatedAt: now,
      createdAt: emp.createdAt || now,
    };
    const list = [...dbState.employees];
    const idx = list.findIndex((e) => e.id === emp.id);
    if (idx >= 0) {
      list[idx] = updated;
      await logAuditAction('EDIT', 'Team', emp.id, `Updated team member profile: ${emp.name} (${emp.position})`);
    } else {
      list.unshift(updated);
      await logAuditAction('CREATE', 'Team', emp.id, `Added team member: ${emp.name} as ${emp.position}`);
    }
    await commitStateChange({ ...dbState, employees: list });
  };

  const deleteEmployee = async (id: string) => {
    if (!dbState) return;
    const emp = dbState.employees.find((e) => e.id === id);
    const updated = {
      ...dbState,
      employees: dbState.employees.filter((e) => e.id !== id),
    };
    await logAuditAction('DELETE', 'Team', id, `Removed staff member ${emp?.name}`);
    await commitStateChange(updated);
  };

  // CONTRACTORS & MIDDLEMEN
  const saveContractor = async (cnt: Contractor) => {
    if (!dbState) return;
    const now = new Date().toISOString();
    const due = Math.max(0, (cnt.contractAmount || 0) - (cnt.paid || 0));
    const updated = {
      ...cnt,
      companyId: cnt.companyId || currentCompany.id,
      due,
      updatedAt: now,
      createdAt: cnt.createdAt || now,
    };
    const list = [...dbState.contractors];
    const idx = list.findIndex((c) => c.id === cnt.id);
    if (idx >= 0) {
      list[idx] = updated;
      await logAuditAction('EDIT', 'Contractors', cnt.id, `Updated contractor ${cnt.name} (${cnt.trade})`);
    } else {
      list.unshift(updated);
      await logAuditAction('CREATE', 'Contractors', cnt.id, `Added contractor ${cnt.name} for ${cnt.trade} (৳${cnt.contractAmount})`);
    }
    await commitStateChange({ ...dbState, contractors: list });
  };

  const deleteContractor = async (id: string) => {
    if (!dbState) return;
    const cnt = dbState.contractors.find((c) => c.id === id);
    const updated = {
      ...dbState,
      contractors: dbState.contractors.filter((c) => c.id !== id),
    };
    await logAuditAction('DELETE', 'Contractors', id, `Removed contractor ${cnt?.name}`);
    await commitStateChange(updated);
  };

  const saveMiddleman = async (mid: Middleman) => {
    if (!dbState) return;
    const now = new Date().toISOString();
    const due = Math.max(0, (mid.commission || 0) - (mid.paid || 0));
    const updated = {
      ...mid,
      companyId: mid.companyId || currentCompany.id,
      due,
      updatedAt: now,
      createdAt: mid.createdAt || now,
    };
    const list = [...dbState.middlemen];
    const idx = list.findIndex((m) => m.id === mid.id);
    if (idx >= 0) {
      list[idx] = updated;
    } else {
      list.unshift(updated);
    }
    await logAuditAction('EDIT', 'Middlemen', mid.id, `Recorded referrer commission for ${mid.name}`);
    await commitStateChange({ ...dbState, middlemen: list });
  };

  const deleteMiddleman = async (id: string) => {
    if (!dbState) return;
    const updated = {
      ...dbState,
      middlemen: dbState.middlemen.filter((m) => m.id !== id),
    };
    await logAuditAction('DELETE', 'Middlemen', id, `Removed middleman ${id}`);
    await commitStateChange(updated);
  };

  // SOIL TEST INVESTIGATION
  const saveSoilTest = async (soil: SoilTest) => {
    if (!dbState) return;
    const now = new Date().toISOString();
    const updated = {
      ...soil,
      companyId: soil.companyId || currentCompany.id,
      updatedAt: now,
      createdAt: soil.createdAt || now,
    };
    const list = [...dbState.soilTests];
    const idx = list.findIndex((s) => s.id === soil.id);
    if (idx >= 0) {
      list[idx] = updated;
      await logAuditAction('EDIT', 'SoilTest', soil.id, `Updated geotechnical investigation report ${soil.testCode} (${soil.boreholeId})`);
    } else {
      list.unshift(updated);
      await logAuditAction('CREATE', 'SoilTest', soil.id, `Registered soil test investigation ${soil.testCode} [${soil.totalDepthFeet} ft depth, ${soil.boreholeId}]`);
    }
    await commitStateChange({ ...dbState, soilTests: list });
  };

  const deleteSoilTest = async (id: string) => {
    if (!dbState) return;
    const soil = dbState.soilTests.find((s) => s.id === id);
    const updated = {
      ...dbState,
      soilTests: dbState.soilTests.filter((s) => s.id !== id),
    };
    await logAuditAction('DELETE', 'SoilTest', id, `Deleted soil test report ${soil?.testCode}`);
    await commitStateChange(updated);
  };

  // EMPLOYEE SALARY (Auto calculate monthly salary: basic + bonus - advance - deduction - paid)
  const saveSalary = async (salary: EmployeeSalary) => {
    if (!dbState) return;
    const now = new Date().toISOString();
    const totalEarnings = (salary.basicSalary || 0) + (salary.bonus || 0);
    const totalDeductions = (salary.advance || 0) + (salary.deduction || 0) + (salary.paid || 0);
    const due = Math.max(0, totalEarnings - totalDeductions);

    const updated: EmployeeSalary = {
      ...salary,
      companyId: salary.companyId || currentCompany.id,
      due,
      updatedAt: now,
      createdAt: salary.createdAt || now,
    };

    const list = [...dbState.salaries];
    const idx = list.findIndex((s) => s.id === salary.id);
    if (idx >= 0) {
      list[idx] = updated;
    } else {
      list.unshift(updated);
    }

    // Auto accounting expense transaction if paid > 0
    let trxList = dbState.transactions;
    if (salary.paid > 0) {
      const trxId = `trx-sal-${salary.id}`;
      const trxItem: Transaction = {
        id: trxId,
        companyId: currentCompany.id,
        date: salary.paymentDate || new Date().toISOString().slice(0, 10),
        type: 'Expense',
        amount: salary.paid,
        category: 'Employee Salary',
        person: salary.employeeName,
        description: `Disbursed salary for month ${salary.month} to ${salary.employeeName}`,
        reference: `PAYROLL-${salary.month}`,
        createdBy: currentUser.name,
        createdAt: now,
        updatedAt: now,
      };
      trxList = [...trxList.filter((t) => t.id !== trxId), trxItem];
    }

    await logAuditAction('EXPENSE', 'Salary', salary.id, `Salary entry for ${salary.employeeName} (${salary.month}): Paid ৳${salary.paid}, Due ৳${due}`);
    await commitStateChange({ ...dbState, salaries: list, transactions: trxList });
  };

  const deleteSalary = async (id: string) => {
    if (!dbState) return;
    const updated = {
      ...dbState,
      salaries: dbState.salaries.filter((s) => s.id !== id),
      transactions: dbState.transactions.filter((t) => t.id !== `trx-sal-${id}`),
    };
    await logAuditAction('DELETE', 'Salary', id, `Removed salary entry ${id}`);
    await commitStateChange(updated);
  };

  // OFFICE EXPENSES
  const saveExpense = async (exp: OfficeExpense) => {
    if (!dbState) return;
    const now = new Date().toISOString();
    const updated: OfficeExpense = {
      ...exp,
      companyId: exp.companyId || currentCompany.id,
      updatedAt: now,
      createdAt: exp.createdAt || now,
    };
    const list = [...dbState.expenses];
    const idx = list.findIndex((e) => e.id === exp.id);
    if (idx >= 0) {
      list[idx] = updated;
    } else {
      list.unshift(updated);
    }

    const trxId = `trx-exp-${exp.id}`;
    const trxItem: Transaction = {
      id: trxId,
      companyId: currentCompany.id,
      date: exp.date,
      type: 'Expense',
      amount: exp.amount,
      category: exp.category,
      projectId: exp.projectId,
      person: exp.paidBy,
      description: exp.description,
      reference: exp.expenseCode,
      createdBy: currentUser.name,
      createdAt: now,
      updatedAt: now,
    };
    const trxList = [...dbState.transactions.filter((t) => t.id !== trxId), trxItem];

    await logAuditAction('EXPENSE', 'Expenses', exp.id, `Office expense recorded: ${exp.category} ৳${exp.amount}`);
    await commitStateChange({ ...dbState, expenses: list, transactions: trxList });
  };

  const deleteExpense = async (id: string) => {
    if (!dbState) return;
    const exp = dbState.expenses.find((e) => e.id === id);
    const updated = {
      ...dbState,
      expenses: dbState.expenses.filter((e) => e.id !== id),
      transactions: dbState.transactions.filter((t) => t.id !== `trx-exp-${id}`),
    };
    await logAuditAction('DELETE', 'Expenses', id, `Removed expense ${exp?.expenseCode}`);
    await commitStateChange(updated);
  };

  // ADVERTISEMENT EXPENSE (Separate dedicated tracking)
  const saveAdvertisement = async (ad: AdvertisementExpense) => {
    if (!dbState) return;
    const now = new Date().toISOString();
    const updated: AdvertisementExpense = {
      ...ad,
      companyId: ad.companyId || currentCompany.id,
      updatedAt: now,
      createdAt: ad.createdAt || now,
    };
    const list = [...dbState.advertisements];
    const idx = list.findIndex((a) => a.id === ad.id);
    if (idx >= 0) {
      list[idx] = updated;
    } else {
      list.unshift(updated);
    }

    const trxId = `trx-ad-${ad.id}`;
    const trxItem: Transaction = {
      id: trxId,
      companyId: currentCompany.id,
      date: ad.date,
      type: 'Expense',
      amount: ad.amount,
      category: 'Advertisement',
      projectId: ad.projectId,
      person: ad.paidBy,
      description: `[${ad.platform}] ${ad.campaign}`,
      reference: `AD-${ad.platform.toUpperCase()}`,
      createdBy: currentUser.name,
      createdAt: now,
      updatedAt: now,
    };
    const trxList = [...dbState.transactions.filter((t) => t.id !== trxId), trxItem];

    await logAuditAction('EXPENSE', 'Advertisement', ad.id, `Recorded ${ad.platform} Ad expense: ৳${ad.amount} (${ad.campaign})`);
    await commitStateChange({ ...dbState, advertisements: list, transactions: trxList });
  };

  const deleteAdvertisement = async (id: string) => {
    if (!dbState) return;
    const updated = {
      ...dbState,
      advertisements: dbState.advertisements.filter((a) => a.id !== id),
      transactions: dbState.transactions.filter((t) => t.id !== `trx-ad-${id}`),
    };
    await logAuditAction('DELETE', 'Advertisement', id, `Removed ad entry ${id}`);
    await commitStateChange(updated);
  };

  // BOKSIS ACCOUNT (Separate dedicated tracking)
  const saveBoksis = async (boksisItem: BoksisRecord) => {
    if (!dbState) return;
    const now = new Date().toISOString();
    const updated: BoksisRecord = {
      ...boksisItem,
      companyId: boksisItem.companyId || currentCompany.id,
      updatedAt: now,
      createdAt: boksisItem.createdAt || now,
    };
    const list = [...dbState.boksis];
    const idx = list.findIndex((b) => b.id === boksisItem.id);
    if (idx >= 0) {
      list[idx] = updated;
    } else {
      list.unshift(updated);
    }

    const trxId = `trx-bok-${boksisItem.id}`;
    const trxItem: Transaction = {
      id: trxId,
      companyId: currentCompany.id,
      date: boksisItem.date,
      type: 'Expense',
      amount: boksisItem.amount,
      category: 'Boksis Expense',
      projectId: boksisItem.projectId,
      person: boksisItem.recipient,
      description: `Boksis to ${boksisItem.recipient}: ${boksisItem.purpose}`,
      reference: 'BOKSIS-VOUCHER',
      createdBy: currentUser.name,
      createdAt: now,
      updatedAt: now,
    };
    const trxList = [...dbState.transactions.filter((t) => t.id !== trxId), trxItem];

    await logAuditAction('EXPENSE', 'Boksis', boksisItem.id, `Recorded Boksis: ৳${boksisItem.amount} to ${boksisItem.recipient} for ${boksisItem.purpose}`);
    await commitStateChange({ ...dbState, boksis: list, transactions: trxList });
  };

  const deleteBoksis = async (id: string) => {
    if (!dbState) return;
    const updated = {
      ...dbState,
      boksis: dbState.boksis.filter((b) => b.id !== id),
      transactions: dbState.transactions.filter((t) => t.id !== `trx-bok-${id}`),
    };
    await logAuditAction('DELETE', 'Boksis', id, `Deleted boksis entry ${id}`);
    await commitStateChange(updated);
  };

  // GENERAL TRANSACTIONS
  const saveTransaction = async (trx: Transaction) => {
    if (!dbState) return;
    const now = new Date().toISOString();
    const updated: Transaction = {
      ...trx,
      companyId: trx.companyId || currentCompany.id,
      updatedAt: now,
      createdAt: trx.createdAt || now,
    };
    const list = [...dbState.transactions];
    const idx = list.findIndex((t) => t.id === trx.id);
    if (idx >= 0) {
      list[idx] = updated;
    } else {
      list.unshift(updated);
    }
    await logAuditAction('EDIT', 'Accounting', trx.id, `Manual transaction recorded: ${trx.type} ৳${trx.amount} (${trx.category})`);
    await commitStateChange({ ...dbState, transactions: list });
  };

  const deleteTransaction = async (id: string) => {
    if (!dbState) return;
    const updated = {
      ...dbState,
      transactions: dbState.transactions.filter((t) => t.id !== id),
    };
    await logAuditAction('DELETE', 'Accounting', id, `Deleted transaction ${id}`);
    await commitStateChange(updated);
  };

  // NOTIFICATIONS
  const markNotificationRead = async (id: string) => {
    if (!dbState) return;
    const updatedNotifs = dbState.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    await commitStateChange({ ...dbState, notifications: updatedNotifs });
  };

  const clearAllNotifications = async () => {
    if (!dbState) return;
    const updatedNotifs = dbState.notifications.map((n) => ({ ...n, read: true }));
    await commitStateChange({ ...dbState, notifications: updatedNotifs });
  };

  // COMPANY / MULTI-TENANT ACTIONS
  // "company name and information custom edit option . admin panel control all company. admin sell company to use this soft. company can appoint user to manage. admin have all control. company have own."
  const updateCompanyProfile = async (comp: Company) => {
    if (!dbState) return;
    const now = new Date().toISOString();
    const updatedComp = {
      ...comp,
      updatedAt: now,
    };
    const list = dbState.companies.map((c) => (c.id === comp.id ? updatedComp : c));
    await logAuditAction('SETTINGS', 'Company', comp.id, `Updated company profile: ${comp.name}`);
    await commitStateChange({ ...dbState, companies: list });
  };

  const createCompany = async (comp: Company) => {
    if (!dbState) return;
    const now = new Date().toISOString();
    const newComp: Company = {
      ...comp,
      id: comp.id || `comp-${Date.now()}`,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };
    const list = [newComp, ...dbState.companies];
    await logAuditAction('CREATE', 'Company', newComp.id, `Super Admin provisioned new company tenant: ${comp.name} [${comp.plan}]`);
    await commitStateChange({ ...dbState, companies: list });
  };

  const toggleCompanyStatus = async (companyId: string) => {
    if (!dbState) return;
    const list = dbState.companies.map((c) => {
      if (c.id === companyId) {
        const nextStatus = c.status === 'active' ? ('suspended' as const) : ('active' as const);
        return { ...c, status: nextStatus, updatedAt: new Date().toISOString() };
      }
      return c;
    });
    await logAuditAction('EDIT', 'Company', companyId, `Super Admin toggled status for company ${companyId}`);
    await commitStateChange({ ...dbState, companies: list });
  };

  const switchCompany = (companyId: string) => {
    const comp = companies.find((c) => c.id === companyId);
    if (comp) {
      setCurrentCompany(comp);
      logAuditAction('LOGIN', 'Company', companyId, `Switched active company tenant to: ${comp.name}`);
    }
  };

  // BACKUP & RESTORE
  const exportDataJSON = async () => {
    return defaultStorage.exportBackup();
  };

  const importDataJSON = async (jsonString: string) => {
    const success = await defaultStorage.importBackup(jsonString);
    if (success) {
      const refreshed = await defaultStorage.getState();
      setDbState(refreshed);
      await logAuditAction('SETTINGS', 'Backup', 'all', 'Restored complete database state from backup JSON archive');
    }
    return success;
  };

  const syncGitHubVault = async () => {
    return defaultStorage.syncToRemote();
  };

  // CALCULATE DASHBOARD METRICS
  const dashboardMetrics: DashboardMetrics = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const thisMonthPrefix = now.toISOString().slice(0, 7); // "YYYY-MM"

    // Today's collection
    const todayCollection = payments
      .filter((p) => p.date === todayStr)
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    // This month income (all payments in this month)
    const thisMonthIncome = payments
      .filter((p) => p.date.startsWith(thisMonthPrefix))
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    // Expenses in this month
    const thisMonthExpensesOnly = expenses
      .filter((e) => e.date.startsWith(thisMonthPrefix))
      .reduce((sum, e) => sum + (e.amount || 0), 0);

    const thisMonthSalaryPaid = salaries
      .filter((s) => (s.paymentDate && s.paymentDate.startsWith(thisMonthPrefix)) || s.month === thisMonthPrefix)
      .reduce((sum, s) => sum + (s.paid || 0), 0);

    const thisMonthAdExpense = advertisements
      .filter((a) => a.date.startsWith(thisMonthPrefix))
      .reduce((sum, a) => sum + (a.amount || 0), 0);

    const thisMonthBoksis = boksis
      .filter((b) => b.date.startsWith(thisMonthPrefix))
      .reduce((sum, b) => sum + (b.amount || 0), 0);

    const thisMonthAllowance = allowances
      .filter((al) => al.status === 'Paid' && (al.date.startsWith(thisMonthPrefix) || al.month === thisMonthPrefix))
      .reduce((sum, al) => sum + (al.amount || 0), 0);

    const thisMonthExpense =
      thisMonthExpensesOnly +
      thisMonthSalaryPaid +
      thisMonthAdExpense +
      thisMonthBoksis +
      thisMonthAllowance;

    const thisMonthProfit = thisMonthIncome - thisMonthExpense;

    const totalContractValue = projects.reduce((sum, p) => sum + (p.contractAmount || 0), 0);
    const totalClientDue = projects.reduce((sum, p) => sum + (p.dueAmount || 0), 0);

    const activeProjectsCount = projects.filter(
      (p) => !['Completed', 'Cancelled', 'On Hold'].includes(p.status)
    ).length;

    const completedProjectsCount = projects.filter((p) => p.status === 'Completed').length;

    const todaySiteVisitsCount = siteVisits.filter((v) => v.visitDate === todayStr).length;

    const pendingCorrectionsCount = files.filter(
      (f) => f.status === 'Correction Required' || f.status === 'Under Review'
    ).length;

    const pendingPrintsCount = files.filter((f) => f.status === 'Final').length;

    const upcomingPaymentsAmount = commitments
      .filter((c) => c.status === 'Upcoming' || c.status === 'Due Today')
      .reduce((sum, c) => sum + (c.dueAmount || 0), 0);

    const overduePaymentsAmount = commitments
      .filter((c) => c.status === 'Overdue')
      .reduce((sum, c) => sum + (c.dueAmount || 0), 0);

    const salaryDueAmount = salaries.reduce((sum, s) => sum + (s.due || 0), 0);

    const siteAllowanceAmount = allowances
      .filter((a) => a.status === 'Unpaid')
      .reduce((sum, a) => sum + (a.amount || 0), 0);

    const adExpenseAmount = advertisements.reduce((sum, a) => sum + (a.amount || 0), 0);
    const officeExpenseAmount = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const boksisExpenseAmount = boksis.reduce((sum, b) => sum + (b.amount || 0), 0);

    return {
      todayCollection,
      thisMonthIncome,
      thisMonthExpense,
      thisMonthProfit,
      totalContractValue,
      totalClientDue,
      activeProjectsCount,
      completedProjectsCount,
      todaySiteVisitsCount,
      pendingCorrectionsCount,
      pendingPrintsCount,
      upcomingPaymentsAmount,
      overduePaymentsAmount,
      salaryDueAmount,
      siteAllowanceAmount,
      adExpenseAmount,
      officeExpenseAmount,
      boksisExpenseAmount,
    };
  }, [
    payments,
    expenses,
    salaries,
    advertisements,
    boksis,
    allowances,
    projects,
    siteVisits,
    files,
    commitments,
  ]);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        currentCompany,
        setCurrentCompany,
        switchCompany,
        companies,
        activeTab,
        setActiveTab,
        selectedProjectId,
        setSelectedProjectId,
        selectedClientId,
        setSelectedClientId,
        isGlobalSearchOpen,
        setIsGlobalSearchOpen,
        dateRangeMode,
        setDateRangeMode,
        customStartDate,
        setCustomStartDate,
        customEndDate,
        setCustomEndDate,
        clients,
        lands,
        projects,
        services,
        payments,
        commitments,
        files,
        downloads,
        prints,
        siteVisits,
        allowances,
        employees,
        contractors,
        middlemen,
        soilTests,
        salaries,
        expenses,
        advertisements,
        boksis,
        transactions,
        auditLogs,
        notifications,
        saveClient,
        deleteClient,
        saveProject,
        deleteProject,
        saveLand,
        deleteLand,
        saveService,
        deleteService,
        savePayment,
        deletePayment,
        saveCommitment,
        deleteCommitment,
        saveFile,
        addFileVersion,
        markFileFinal,
        deleteFile,
        logFileDownload,
        logFilePrint,
        saveSiteVisit,
        deleteSiteVisit,
        saveAllowance,
        deleteAllowance,
        saveEmployee,
        deleteEmployee,
        saveContractor,
        deleteContractor,
        saveMiddleman,
        deleteMiddleman,
        saveSoilTest,
        deleteSoilTest,
        saveSalary,
        deleteSalary,
        saveExpense,
        deleteExpense,
        saveAdvertisement,
        deleteAdvertisement,
        saveBoksis,
        deleteBoksis,
        saveTransaction,
        deleteTransaction,
        markNotificationRead,
        clearAllNotifications,
        logAuditAction,
        updateCompanyProfile,
        createCompany,
        toggleCompanyStatus,
        exportDataJSON,
        importDataJSON,
        syncGitHubVault,
        dashboardMetrics,
        unreadNotificationsCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
