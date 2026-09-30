export type UserRole =
  | 'Super Admin'
  | 'Managing Director'
  | 'Accountant'
  | 'Engineer'
  | 'Draft Engineer'
  | 'Structural Engineer'
  | 'Architect'
  | 'Site Engineer'
  | 'Staff';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  token?: string;
}

export interface Company {
  id: string;
  name: string;
  slogan: string;
  managingDirector: string;
  managingDirectorQualifications: string;
  email: string;
  phone: string;
  alternativePhone?: string;
  address: string;
  logoUrl?: string;
  dapRegNo?: string;
  tradeLicense?: string;
  bankDetails?: string;
  currencySymbol: string;
  status: 'active' | 'suspended';
  plan: 'Trial' | 'Professional' | 'Enterprise';
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  companyId: string;
  clientCode: string;
  name: string;
  fatherHusbandName: string;
  mobile: string;
  alternativeMobile?: string;
  email?: string;
  address: string;
  nid?: string;
  referenceInfo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LandInfo {
  id: string;
  companyId: string;
  projectId: string;
  clientId: string;
  landArea: string; // e.g. "5 Katha"
  decimal: number;
  lengthFeet: number;
  widthFeet: number;
  mouza: string;
  khatian: string;
  dagNumber: string;
  roadWidthFeet: number;
  frontSetback: string;
  sideSetback: string;
  rearSetback: string;
  landUse: string; // e.g. "Residential", "Commercial"
  location: string;
  googleMapsLink?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus =
  | 'Lead'
  | 'Quotation'
  | 'Contracted'
  | 'Design'
  | 'Approval'
  | 'Foundation'
  | 'Structure'
  | 'Brickwork'
  | 'Plaster'
  | 'Finishing'
  | 'Completed'
  | 'On Hold'
  | 'Cancelled';

export type FoundationType =
  | 'Isolated Footing'
  | 'Combined Footing'
  | 'Raft Foundation'
  | 'Pile Foundation'
  | 'Deep Pier'
  | 'Other';

export interface Project {
  id: string;
  companyId: string;
  projectCode: string;
  name: string;
  clientId: string;
  clientName: string;
  projectLocation: string;
  district: string;
  upazila: string;
  areaSft: number;
  landAreaDecimal?: number;
  storeys: number; // e.g. 1, 2, 3, 5, 7, 10
  foundationType: FoundationType;
  projectType: 'Residential' | 'Commercial' | 'Mixed-Use' | 'Industrial' | 'Institutional';
  startDate: string;
  expectedCompletionDate: string;
  currentStage: ProjectStatus;
  progressPercent: number;
  status: ProjectStatus;
  notes?: string;
  assignedEngineers?: {
    managingDirector?: string;
    structuralEngineer?: string;
    architect?: string;
    draftEngineer?: string;
    siteEngineer?: string;
  };
  contractAmount: number;
  paidAmount: number;
  dueAmount: number;
  createdAt: string;
  updatedAt: string;
}

export type ServiceType =
  | 'Architectural Design'
  | 'Structural Design'
  | 'Electrical Design'
  | 'Plumbing Design'
  | '3D Model'
  | 'Soil Test'
  | 'Municipality Approval Drawing'
  | 'Construction'
  | 'Construction Supervision'
  | 'Digital Survey'
  | 'BOQ/Estimate'
  | 'Other';

export interface ServiceContract {
  id: string;
  companyId: string;
  projectId: string;
  clientId: string;
  serviceName: ServiceType;
  rate: number;
  quantityScope: string;
  agreedPrice: number;
  discount: number;
  finalContractAmount: number; // calculated: agreedPrice - discount
  advance: number;
  paid: number;
  due: number; // calculated: finalContractAmount - paid
  status: 'Pending' | 'In Progress' | 'Delivered' | 'Approved' | 'Completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'Cheque' | 'bKash' | 'Nagad' | 'Rocket';

export interface Payment {
  id: string;
  companyId: string;
  receiptNo: string;
  clientId: string;
  clientName: string;
  projectId: string;
  projectName: string;
  date: string;
  amount: number;
  paymentMethod: PaymentMethod;
  reference?: string;
  receivedBy: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type CommitmentStatus = 'Upcoming' | 'Due Today' | 'Overdue' | 'Cleared';

export interface BillCommitment {
  id: string;
  companyId: string;
  clientId: string;
  clientName: string;
  projectId: string;
  projectName: string;
  billAmount: number;
  dueAmount: number;
  commitmentDate: string;
  description: string;
  status: CommitmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type FileCategory =
  | 'Architectural'
  | 'Structural'
  | 'Electrical'
  | 'Plumbing'
  | 'Soil Report'
  | 'BOQ'
  | 'Estimate'
  | 'Municipality Approval'
  | '3D'
  | 'Site Photo'
  | 'Other';

export interface FileVersion {
  versionNumber: number; // 1, 2, 3...
  versionLabel: string; // V01 Original, V02 Correction, V03 Final
  uploadDate: string;
  uploadedBy: string;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  description?: string;
  correctionNote?: string;
  isFinal: boolean;
}

export interface ProjectFile {
  id: string;
  companyId: string;
  fileCode: string;
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  category: FileCategory;
  fileName: string;
  currentVersion: string; // e.g. "V02"
  versions: FileVersion[];
  status: 'Draft' | 'Under Review' | 'Correction Required' | 'Approved' | 'Final';
  createdAt: string;
  updatedAt: string;
}

export interface FileDownloadHistory {
  id: string;
  companyId: string;
  fileId: string;
  fileName: string;
  version: string;
  downloadedBy: string;
  downloadedAt: string;
  purpose?: string;
}

export interface FilePrintHistory {
  id: string;
  companyId: string;
  fileId: string;
  fileName: string;
  version: string;
  printedBy: string;
  printedAt: string;
  printCount: number;
  purpose?: string;
  notes?: string;
}

export interface SiteVisit {
  id: string;
  companyId: string;
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  visitDate: string;
  visitTime: string;
  engineerId: string;
  engineerName: string;
  currentWorkStage: string;
  progressPercent: number;
  siteCondition: string;
  observation: string;
  problems?: string;
  requiredAction?: string;
  nextVisitDate?: string;
  visitCharge: number;
  paid: number;
  due: number;
  photos: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteVisitAllowance {
  id: string;
  companyId: string;
  engineerId: string;
  engineerName: string;
  projectId: string;
  projectName: string;
  visitId?: string;
  allowanceType: 'Per-visit' | 'Monthly';
  amount: number;
  date: string;
  month: string; // "YYYY-MM"
  status: 'Paid' | 'Unpaid';
  paidDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  companyId: string;
  name: string;
  position: string;
  role: UserRole;
  mobile: string;
  email: string;
  joiningDate: string;
  salary: number;
  status: 'Active' | 'On Leave' | 'Inactive';
  assignedProjects?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ContractorTrade =
  | 'Civil'
  | 'Plumbing'
  | 'Electrical'
  | 'Tiles'
  | 'Paint'
  | 'False Ceiling'
  | 'Glass/Aluminium'
  | 'Fabrication/Steel'
  | 'Carpentry'
  | 'Other';

export interface Contractor {
  id: string;
  companyId: string;
  name: string;
  mobile: string;
  companyName: string;
  trade: ContractorTrade;
  projectId: string;
  projectName: string;
  workScope: string;
  contractAmount: number;
  paid: number;
  due: number;
  startDate: string;
  expectedCompletion: string;
  status: 'Active' | 'Completed' | 'Terminated' | 'Pending';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Middleman {
  id: string;
  companyId: string;
  name: string;
  mobile: string;
  clientId: string;
  clientName: string;
  projectId: string;
  projectName: string;
  commission: number;
  commissionType: 'Percentage' | 'Fixed';
  paid: number;
  due: number;
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SPTRecord {
  depthFeet: number;
  sampleNumber: string;
  blows: string; // e.g. "3-5-6"
  nValue: number; // e.g. 11
  soilDescription: string; // e.g. "Light grey medium dense silty fine sand"
  sampleType: 'Split Spoon' | 'Shelby Tube' | 'Grab' | 'Core';
  remarks?: string;
}

export interface SoilRecommendation {
  recommendedFoundation: string;
  recommendedFoundingDepthFeet: number;
  allowableBearingCapacityKsf: number; // kips/sqft or tons/sqft
  groundwaterConsideration: string;
  settlementConsideration: string;
  soilImprovement?: string;
  specialNotes?: string;
  approvedByEngineer: string;
  approvalDate: string;
}

export interface SoilTest {
  id: string;
  companyId: string;
  testCode: string;
  clientId: string;
  clientName: string;
  projectId: string;
  projectName: string;
  location: string;
  boreholeId: string; // e.g. "BH-01"
  groundLevelFeet: number;
  groundwaterLevelFeet: number;
  totalDepthFeet: number;
  testDate: string;
  laboratory: string;
  engineerName: string;
  notes?: string;
  sptTable: SPTRecord[];
  recommendation: SoilRecommendation;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeSalary {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  month: string; // "YYYY-MM"
  basicSalary: number;
  advance: number;
  deduction: number;
  bonus: number;
  paid: number;
  due: number; // (basicSalary + bonus) - (advance + deduction + paid)
  paymentDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type OfficeExpenseCategory =
  | 'Office Rent'
  | 'Electricity'
  | 'Internet'
  | 'Mobile'
  | 'Printing'
  | 'Stationery'
  | 'Computer/Equipment'
  | 'Tea/Food'
  | 'Transport'
  | 'Repair'
  | 'Maintenance'
  | 'Advertisement'
  | 'Boksis'
  | 'Site Engineer Allowance'
  | 'Other';

export interface OfficeExpense {
  id: string;
  companyId: string;
  expenseCode: string;
  date: string;
  category: OfficeExpenseCategory;
  amount: number;
  projectId?: string;
  projectName?: string;
  paidBy: string;
  description: string;
  receiptUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type AdPlatform = 'Facebook' | 'Google' | 'YouTube' | 'Print' | 'Banner' | 'Other';

export interface AdvertisementExpense {
  id: string;
  companyId: string;
  date: string;
  platform: AdPlatform;
  campaign: string;
  amount: number;
  projectId?: string;
  projectName?: string;
  paidBy: string;
  notes?: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoksisRecord {
  id: string;
  companyId: string;
  date: string;
  projectId?: string;
  projectName?: string;
  clientId?: string;
  clientName?: string;
  recipient: string; // e.g. "Site Guard", "Municipality peon", "Delivery boy"
  purpose: string;
  amount: number;
  paidBy: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  companyId: string;
  date: string;
  type: 'Income' | 'Expense' | 'Transfer' | 'Adjustment';
  amount: number;
  category: string;
  clientId?: string;
  projectId?: string;
  person: string;
  description: string;
  reference?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  companyId: string;
  user: string;
  action: 'LOGIN' | 'CREATE' | 'EDIT' | 'DELETE' | 'UPLOAD' | 'DOWNLOAD' | 'CORRECTION' | 'PRINT' | 'PAYMENT' | 'EXPENSE' | 'CONTRACT' | 'SETTINGS';
  module: string;
  recordId: string;
  details: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  companyId: string;
  type: 'payment_due' | 'payment_overdue' | 'visit_due' | 'salary_due' | 'correction_pending' | 'project_deadline' | 'other';
  title: string;
  message: string;
  date: string;
  read: boolean;
  linkTab?: string;
  createdAt: string;
}

export interface DashboardMetrics {
  todayCollection: number;
  thisMonthIncome: number;
  thisMonthExpense: number;
  thisMonthProfit: number;
  totalContractValue: number;
  totalClientDue: number;
  activeProjectsCount: number;
  completedProjectsCount: number;
  todaySiteVisitsCount: number;
  pendingCorrectionsCount: number;
  pendingPrintsCount: number;
  upcomingPaymentsAmount: number;
  overduePaymentsAmount: number;
  salaryDueAmount: number;
  siteAllowanceAmount: number;
  adExpenseAmount: number;
  officeExpenseAmount: number;
  boksisExpenseAmount: number;
}
