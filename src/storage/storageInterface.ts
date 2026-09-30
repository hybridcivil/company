import {
  Company,
  Client,
  LandInfo,
  Project,
  ServiceContract,
  Payment,
  BillCommitment,
  ProjectFile,
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
} from '../types';

export interface AppDatabaseState {
  companies: Company[];
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
}

export interface IStorageDriver {
  init(): Promise<void>;
  getState(): Promise<AppDatabaseState>;
  saveState(state: AppDatabaseState): Promise<void>;
  
  // Specific entity operations
  saveRecord<T extends { id: string }>(collection: keyof AppDatabaseState, item: T): Promise<T>;
  deleteRecord(collection: keyof AppDatabaseState, id: string): Promise<boolean>;
  
  // Audit log
  logAudit(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void>;

  // Backup & Restore
  exportBackup(): Promise<string>;
  importBackup(jsonString: string): Promise<boolean>;

  // Sync to Remote / GitHub API
  syncToRemote?(): Promise<{ success: boolean; message: string }>;
}
