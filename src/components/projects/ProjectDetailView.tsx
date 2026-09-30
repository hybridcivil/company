import React, { useState } from 'react';
import {
  ArrowLeft,
  Building,
  User,
  MapPin,
  Calendar,
  Layers,
  HardHat,
  FileBox,
  Compass,
  CreditCard,
  Briefcase,
  History,
  CheckCircle2,
  DollarSign,
  Plus,
  Edit,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Project, ProjectStatus } from '../../types';
import { LandModal } from '../land/LandModal';

interface ProjectDetailViewProps {
  projectId: string;
  onBack: () => void;
  onEditProject: (project: Project) => void;
  onOpenNewContract: (projectId: string, clientId: string) => void;
  onOpenNewPayment: (projectId: string, clientId: string) => void;
  onOpenNewSiteVisit: (projectId: string, clientId: string) => void;
  onOpenNewFile: (projectId: string, clientId: string) => void;
  onOpenNewSoilTest: (projectId: string, clientId: string) => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  projectId,
  onBack,
  onEditProject,
  onOpenNewContract,
  onOpenNewPayment,
  onOpenNewSiteVisit,
  onOpenNewFile,
  onOpenNewSoilTest,
}) => {
  const {
    projects,
    clients,
    lands,
    services,
    payments,
    siteVisits,
    files,
    contractors,
    soilTests,
    transactions,
    auditLogs,
    currentCompany,
    saveProject,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'client'
    | 'land'
    | 'contract'
    | 'payment'
    | 'siteVisits'
    | 'team'
    | 'contractors'
    | 'files'
    | 'soilTest'
    | 'accounts'
    | 'history'
  >('overview');

  const [isLandModalOpen, setIsLandModalOpen] = useState(false);

  const project = projects.find((p) => p.id === projectId);
  if (!project) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Project not found.</p>
        <button onClick={onBack} className="mt-3 text-xs text-orange-500 underline">
          Return to Project List
        </button>
      </div>
    );
  }

  const sym = currentCompany.currencySymbol || '৳';
  const client = clients.find((c) => c.id === project.clientId);
  const projectLands = lands.filter((l) => l.projectId === project.id);
  const projectServices = services.filter((s) => s.projectId === project.id);
  const projectPayments = payments.filter((p) => p.projectId === project.id);
  const projectVisits = siteVisits.filter((v) => v.projectId === project.id);
  const projectFiles = files.filter((f) => f.projectId === project.id);
  const projectContractors = contractors.filter((c) => c.projectId === project.id);
  const projectSoilTests = soilTests.filter((s) => s.projectId === project.id);
  const projectTransactions = transactions.filter((t) => t.projectId === project.id);
  const projectAudits = auditLogs.filter(
    (a) => a.module === 'Projects' && a.recordId === project.id
  );

  const totalContract = project.contractAmount || 0;
  const totalPaid = project.paidAmount || 0;
  const totalDue = project.dueAmount || 0;

  const handleStageChange = async (nextStage: ProjectStatus) => {
    await saveProject({
      ...project,
      currentStage: nextStage,
      status: nextStage,
    });
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Back Button & Title */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>All Projects</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEditProject(project)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <Edit className="h-3.5 w-3.5" />
            <span>Edit Project</span>
          </button>
        </div>
      </div>

      {/* SECTION 39 MANDATORY TOP BANNER */}
      {/* "At the top show: Project name, Client, Location, Storey, Area, Foundation, Current stage, Progress, Contract, Paid, Due." */}
      <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-5 text-white shadow-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-orange-600 px-2 py-0.5 text-[11px] font-bold text-white">
                {project.projectCode}
              </span>
              <h1 className="text-xl font-extrabold sm:text-2xl">{project.name}</h1>
              <span className="rounded bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-orange-400 border border-slate-700">
                {project.projectType}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-orange-400" />
                <span>Client: <strong>{project.clientName}</strong></span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-orange-400" />
                <span>Location: {project.projectLocation}, {project.district}</span>
              </span>
            </div>
          </div>

          {/* Quick Stage Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Stage:</span>
            <select
              value={project.currentStage}
              onChange={(e) => handleStageChange(e.target.value as ProjectStatus)}
              className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-orange-400 focus:outline-none"
            >
              {[
                'Lead', 'Quotation', 'Contracted', 'Design', 'Approval',
                'Foundation', 'Structure', 'Brickwork', 'Plaster',
                'Finishing', 'Completed', 'On Hold', 'Cancelled',
              ].map((stg) => (
                <option key={stg} value={stg}>{stg}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Detailed Metrics Strip (Storey, Area, Foundation, Progress, Contract, Paid, Due) */}
        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-800/80 pt-4 sm:grid-cols-4 lg:grid-cols-7 text-xs">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Storey</span>
            <p className="text-sm font-bold text-white mt-0.5">{project.storeys} Storey</p>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Built Area</span>
            <p className="text-sm font-bold text-white mt-0.5">{project.areaSft.toLocaleString()} SFT</p>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Foundation</span>
            <p className="text-sm font-bold text-white mt-0.5">{project.foundationType}</p>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Progress</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-sm font-bold text-orange-400">{project.progressPercent}%</span>
              <div className="h-1.5 w-12 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: `${project.progressPercent}%` }}
                />
              </div>
            </div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Contract</span>
            <p className="text-sm font-bold text-white mt-0.5">{sym} {totalContract.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-emerald-400 text-[10px] uppercase font-semibold">Paid</span>
            <p className="text-sm font-bold text-emerald-400 mt-0.5">{sym} {totalPaid.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-rose-400 text-[10px] uppercase font-semibold">Due</span>
            <p className="text-sm font-bold text-rose-400 mt-0.5">{sym} {totalDue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* 12 MANDATORY TABS */}
      <div className="flex overflow-x-auto border-b border-slate-200 bg-white p-1.5 shadow-2xs scrollbar-none rounded-xl dark:border-slate-800 dark:bg-slate-900 gap-1">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'client', label: 'Client' },
          { id: 'land', label: `Land (${projectLands.length})` },
          { id: 'contract', label: `Contract (${projectServices.length})` },
          { id: 'payment', label: `Payment (${projectPayments.length})` },
          { id: 'siteVisits', label: `Site Visits (${projectVisits.length})` },
          { id: 'team', label: 'Team' },
          { id: 'contractors', label: `Contractors (${projectContractors.length})` },
          { id: 'files', label: `Files (${projectFiles.length})` },
          { id: 'soilTest', label: `Soil Test (${projectSoilTests.length})` },
          { id: 'accounts', label: `Accounts (${projectTransactions.length})` },
          { id: 'history', label: 'History' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-orange-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT PANELS */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1">
                  Structural Specifications
                </span>
                <p><strong>Storeys:</strong> {project.storeys} Floors</p>
                <p><strong>Total SFT:</strong> {project.areaSft.toLocaleString()} SFT</p>
                <p><strong>Substructure:</strong> {project.foundationType}</p>
                <p><strong>Land Area:</strong> {project.landAreaDecimal || 0} Decimal</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1">
                  Timeline &amp; Milestone Schedule
                </span>
                <p><strong>Start Date:</strong> {project.startDate || 'N/A'}</p>
                <p><strong>Target Delivery:</strong> {project.expectedCompletionDate || 'N/A'}</p>
                <p><strong>Current Stage:</strong> <span className="font-bold text-orange-600">{project.currentStage}</span></p>
                <p><strong>Work Completion:</strong> {project.progressPercent}%</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1">
                  Consultancy Financials
                </span>
                <p><strong>Contract Value:</strong> {sym} {totalContract.toLocaleString()}</p>
                <p><strong>Total Realized:</strong> <span className="text-emerald-600 font-bold">{sym} {totalPaid.toLocaleString()}</span></p>
                <p><strong>Outstanding Balance:</strong> <span className="text-rose-600 font-bold">{sym} {totalDue.toLocaleString()}</span></p>
              </div>
            </div>

            {project.notes && (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40 text-xs">
                <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1">
                  Project Brief &amp; Special Considerations
                </span>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{project.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* 2. CLIENT TAB */}
        {activeTab === 'client' && (
          <div className="space-y-4 text-xs">
            {client ? (
              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{client.name}</h3>
                  <span className="rounded bg-orange-100 px-2 py-0.5 font-bold text-orange-700 dark:bg-orange-950 dark:text-orange-400">
                    {client.clientCode}
                  </span>
                </div>
                <p><strong>Phone:</strong> {client.mobile} {client.alternativeMobile ? `| Alt: ${client.alternativeMobile}` : ''}</p>
                {client.email && <p><strong>Email:</strong> {client.email}</p>}
                <p><strong>Address:</strong> {client.address}</p>
                {client.fatherHusbandName && <p><strong>Father/Husband:</strong> {client.fatherHusbandName}</p>}
                {client.nid && <p><strong>NID:</strong> {client.nid}</p>}
                {client.notes && <p className="text-slate-500 italic mt-2">&ldquo;{client.notes}&rdquo;</p>}
              </div>
            ) : (
              <p className="text-slate-400">Client details not loaded.</p>
            )}
          </div>
        )}

        {/* 3. LAND TAB */}
        {activeTab === 'land' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider dark:text-slate-200">
                Land &amp; Boundary Survey Records
              </h4>
              <button
                onClick={() => setIsLandModalOpen(true)}
                className="flex items-center gap-1 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-500"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Land Record
              </button>
            </div>

            {projectLands.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No land records registered for this project yet. Click &quot;Add Land Record&quot; to input mouza, dag, and setbacks.
              </p>
            ) : (
              projectLands.map((l) => (
                <div key={l.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {l.landArea} ({l.decimal} Decimal)
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {l.landUse}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 text-[11px] text-slate-600 dark:text-slate-400">
                    <p><strong>Mouza:</strong> {l.mouza || 'N/A'}</p>
                    <p><strong>Khatian:</strong> {l.khatian || 'N/A'}</p>
                    <p><strong>Dag No:</strong> {l.dagNumber || 'N/A'}</p>
                    <p><strong>Road Width:</strong> {l.roadWidthFeet} ft</p>
                    <p><strong>Front Setback:</strong> {l.frontSetback}</p>
                    <p><strong>Side Setback:</strong> {l.sideSetback}</p>
                    <p><strong>Rear Setback:</strong> {l.rearSetback}</p>
                    <p><strong>Dimensions:</strong> {l.lengthFeet} ft x {l.widthFeet} ft</p>
                  </div>
                  {l.googleMapsLink && (
                    <a
                      href={l.googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-orange-600 hover:underline mt-1"
                    >
                      <ExternalLink className="h-3 w-3" /> View on Google Maps
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* 4. CONTRACT & SERVICES TAB */}
        {activeTab === 'contract' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider dark:text-slate-200">
                Service Contracts &amp; Scopes
              </h4>
              <button
                onClick={() => onOpenNewContract(project.id, project.clientId)}
                className="flex items-center gap-1 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-500"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Service Scope
              </button>
            </div>

            {projectServices.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No individual service contracts added.</p>
            ) : (
              <div className="space-y-2">
                {projectServices.map((s) => (
                  <div key={s.id} className="rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{s.serviceName}</span>
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {s.status}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">{s.quantityScope}</p>
                    <div className="mt-2 grid grid-cols-4 gap-2 border-t border-slate-100 pt-2 dark:border-slate-800 text-[11px]">
                      <div>Agreed: <strong>{sym} {s.agreedPrice.toLocaleString()}</strong></div>
                      <div>Discount: <strong>{sym} {s.discount.toLocaleString()}</strong></div>
                      <div>Final: <strong>{sym} {s.finalContractAmount.toLocaleString()}</strong></div>
                      <div>Due: <strong className="text-rose-600">{sym} {s.due.toLocaleString()}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. PAYMENTS TAB */}
        {activeTab === 'payment' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider dark:text-slate-200">
                Payment Vouchers &amp; Receipts
              </h4>
              <button
                onClick={() => onOpenNewPayment(project.id, project.clientId)}
                className="flex items-center gap-1 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-500"
              >
                <Plus className="h-3.5 w-3.5" />
                Record Payment
              </button>
            </div>

            {projectPayments.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No payment vouchers recorded for this project yet.</p>
            ) : (
              <div className="space-y-2">
                {projectPayments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-slate-800 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{p.receiptNo}</span>
                        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {p.paymentMethod}
                        </span>
                        <span className="text-slate-500">{p.date}</span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">Ref: {p.reference || 'N/A'} • {p.notes}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {sym} {p.amount.toLocaleString()}
                      </span>
                      <p className="text-[10px] text-slate-400">Received by: {p.receivedBy}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 6. SITE VISITS TAB */}
        {activeTab === 'siteVisits' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider dark:text-slate-200">
                Site Inspection Log &amp; Quality Checks
              </h4>
              <button
                onClick={() => onOpenNewSiteVisit(project.id, project.clientId)}
                className="flex items-center gap-1 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-500"
              >
                <Plus className="h-3.5 w-3.5" />
                Schedule Visit
              </button>
            </div>

            {projectVisits.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No site visits logged for this project yet.</p>
            ) : (
              <div className="space-y-3">
                {projectVisits.map((v) => (
                  <div key={v.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {v.visitDate} ({v.visitTime}) - Stage: {v.currentWorkStage}
                      </span>
                      <span className="text-slate-500">Engr: {v.engineerName}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300"><strong>Observations:</strong> {v.observation}</p>
                    {v.problems && <p className="text-rose-600"><strong>Problems:</strong> {v.problems}</p>}
                    {v.requiredAction && <p className="text-amber-600"><strong>Required Action:</strong> {v.requiredAction}</p>}
                    <p className="text-[11px] text-slate-400">Next visit scheduled: {v.nextVisitDate || 'TBD'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 7. TEAM TAB */}
        {activeTab === 'team' && (
          <div className="space-y-4 text-xs">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider dark:text-slate-200">
              Assigned Consulting Engineers &amp; Architect
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Principal Consultant</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {project.assignedEngineers?.managingDirector || currentCompany.managingDirector}
                </p>
                <p className="text-orange-500">{currentCompany.managingDirectorQualifications}</p>
              </div>

              <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Structural Engineer</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {project.assignedEngineers?.structuralEngineer || 'Not Assigned'}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Architectural Designer</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {project.assignedEngineers?.architect || 'Not Assigned'}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">CAD Detailing Engineer</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {project.assignedEngineers?.draftEngineer || 'Not Assigned'}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Site Quality Engineer</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {project.assignedEngineers?.siteEngineer || 'Not Assigned'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 8. CONTRACTORS TAB */}
        {activeTab === 'contractors' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider dark:text-slate-200">
              Construction Contractors &amp; Sub-Contractors
            </h4>
            {projectContractors.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No contractors registered for this project.</p>
            ) : (
              <div className="space-y-2">
                {projectContractors.map((c) => (
                  <div key={c.id} className="rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{c.name} ({c.companyName})</span>
                      <span className="rounded bg-orange-100 px-2 py-0.5 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                        {c.trade}
                      </span>
                    </div>
                    <p className="text-slate-500 mt-1">{c.workScope}</p>
                    <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 dark:border-slate-800">
                      <span>Contract: {sym} {c.contractAmount.toLocaleString()}</span>
                      <span>Paid: {sym} {c.paid.toLocaleString()}</span>
                      <span className="font-bold text-rose-600">Due: {sym} {c.due.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 9. FILES & DRAWINGS TAB */}
        {activeTab === 'files' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider dark:text-slate-200">
                Blueprints &amp; Project Revision Vault
              </h4>
              <button
                onClick={() => onOpenNewFile(project.id, project.clientId)}
                className="flex items-center gap-1 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-500"
              >
                <Plus className="h-3.5 w-3.5" />
                Upload Drawing
              </button>
            </div>

            {projectFiles.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No drawing files uploaded for this project.</p>
            ) : (
              <div className="space-y-2">
                {projectFiles.map((f) => (
                  <div key={f.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-slate-800 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{f.fileName}</span>
                        <span className="rounded bg-orange-100 px-1.5 py-0.5 font-bold text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                          {f.currentVersion}
                        </span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {f.category}
                        </span>
                      </div>
                      <p className="text-slate-500 mt-0.5">Status: {f.status} • {f.versions.length} revisions archived</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 10. SOIL TEST TAB */}
        {activeTab === 'soilTest' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider dark:text-slate-200">
                Geotechnical Soil Investigation (SPT)
              </h4>
              <button
                onClick={() => onOpenNewSoilTest(project.id, project.clientId)}
                className="flex items-center gap-1 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-500"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Soil Report
              </button>
            </div>

            {projectSoilTests.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No borehole investigation logged for this project.</p>
            ) : (
              <div className="space-y-3">
                {projectSoilTests.map((s) => (
                  <div key={s.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {s.testCode} ({s.boreholeId})
                      </span>
                      <span className="text-slate-500">{s.testDate}</span>
                    </div>
                    <p>Total Depth: <strong>{s.totalDepthFeet} ft</strong> • Groundwater Table: <strong>{s.groundwaterLevelFeet} ft</strong></p>
                    <div className="rounded-lg bg-orange-50 p-2.5 text-orange-950 dark:bg-orange-950/40 dark:text-orange-200">
                      <strong className="block text-[10px] uppercase font-bold text-orange-800 dark:text-orange-300">
                        Engineer Recommendation:
                      </strong>
                      <p className="mt-0.5">{s.recommendation.recommendedFoundation} at {s.recommendation.recommendedFoundingDepthFeet} ft founding depth.</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Bearing Capacity: {s.recommendation.allowableBearingCapacityKsf} Ksf • Approved by: {s.recommendation.approvedByEngineer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 11. ACCOUNTS TAB */}
        {activeTab === 'accounts' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider dark:text-slate-200">
              Project Financial Ledger &amp; Expenses
            </h4>
            {projectTransactions.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No financial transactions recorded.</p>
            ) : (
              <div className="space-y-2 text-xs">
                {projectTransactions.map((t) => (
                  <div key={t.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${t.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {t.type}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300">{t.category}</span>
                        <span className="text-slate-400">{t.date}</span>
                      </div>
                      <p className="text-slate-500 mt-0.5">{t.description}</p>
                    </div>
                    <span className={`font-bold text-sm ${t.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {sym} {t.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 12. HISTORY (AUDIT) TAB */}
        {activeTab === 'history' && (
          <div className="space-y-3 text-xs">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider dark:text-slate-200">
              Project Historical Activity &amp; Audit Trail
            </h4>
            {projectAudits.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No audit trail entries for this project.</p>
            ) : (
              <div className="space-y-2">
                {projectAudits.map((a) => (
                  <div key={a.id} className="rounded-xl border border-slate-100 p-3 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{a.action} by {a.user}</span>
                      <span className="text-slate-400 text-[10px]">{new Date(a.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">{a.details}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Land Record Modal */}
      <LandModal
        isOpen={isLandModalOpen}
        onClose={() => setIsLandModalOpen(false)}
        projectId={project.id}
        clientId={project.clientId}
      />
    </div>
  );
};
