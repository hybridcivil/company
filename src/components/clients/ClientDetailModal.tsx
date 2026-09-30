import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FolderKanban,
  CreditCard,
  FileBox,
  Compass,
  Layers,
  Clock,
  DollarSign,
  Printer,
  FileCheck2,
  FileBadge,
} from 'lucide-react';
import { Client } from '../../types';
import { useApp } from '../../context/AppContext';

interface ClientDetailModalProps {
  client: Client | null;
  onClose: () => void;
  onEdit: (client: Client) => void;
  onSelectProject: (projectId: string) => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
  client,
  onClose,
  onEdit,
  onSelectProject,
}) => {
  const {
    currentCompany,
    projects,
    services,
    payments,
    commitments,
    files,
    siteVisits,
    soilTests,
    transactions,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'projects'
    | 'contracts'
    | 'payments'
    | 'commitments'
    | 'files'
    | 'siteVisits'
    | 'soilTests'
    | 'transactions'
    | 'notes'
  >('overview');

  if (!client) return null;

  const sym = currentCompany.currencySymbol || '৳';

  // Client relations
  const clientProjects = projects.filter((p) => p.clientId === client.id);
  const clientServices = services.filter((s) => s.clientId === client.id);
  const clientPayments = payments.filter((p) => p.clientId === client.id);
  const clientCommitments = commitments.filter((c) => c.clientId === client.id);
  const clientFiles = files.filter((f) => f.clientId === client.id);
  const clientVisits = siteVisits.filter((v) => v.clientId === client.id);
  const clientSoilTests = soilTests.filter((s) => s.clientId === client.id);
  const clientTransactions = transactions.filter((t) => t.clientId === client.id);

  const totalContract = clientProjects.reduce((sum, p) => sum + (p.contractAmount || 0), 0);
  const totalPaid = clientProjects.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
  const totalDue = clientProjects.reduce((sum, p) => sum + (p.dueAmount || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-5 backdrop-blur-xs">
      <div className="flex flex-col w-full max-w-4xl h-[92vh] rounded-2xl border border-slate-700 bg-slate-900 text-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-[#0F172A] px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 font-extrabold text-white shadow-sm">
              {client.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold sm:text-lg text-white">{client.name}</h2>
                <span className="rounded bg-orange-500/20 px-2 py-0.5 text-xs font-bold text-orange-400">
                  {client.clientCode}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Registered: {new Date(client.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(client)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
            >
              Edit Profile
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Financial Summary Strip */}
        <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950/60 p-3 text-center sm:px-6">
          <div>
            <p className="text-[11px] font-semibold text-slate-400">Total Contract Value</p>
            <p className="text-base font-bold text-white sm:text-lg">
              {sym} {totalContract.toLocaleString()}
            </p>
          </div>
          <div className="border-x border-slate-800">
            <p className="text-[11px] font-semibold text-emerald-400">Total Paid (Receipts)</p>
            <p className="text-base font-bold text-emerald-400 sm:text-lg">
              {sym} {totalPaid.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-rose-400">Total Outstanding Due</p>
            <p className="text-base font-bold text-rose-400 sm:text-lg">
              {sym} {totalDue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Scrollable Horizontal Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-800 bg-slate-900/90 px-4 py-2 scrollbar-none gap-1 shrink-0">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'projects', label: `Projects (${clientProjects.length})` },
            { id: 'contracts', label: `Contracts (${clientServices.length})` },
            { id: 'payments', label: `Payments (${clientPayments.length})` },
            { id: 'commitments', label: `Commitments (${clientCommitments.length})` },
            { id: 'files', label: `Drawings (${clientFiles.length})` },
            { id: 'siteVisits', label: `Site Visits (${clientVisits.length})` },
            { id: 'soilTests', label: `Soil Tests (${clientSoilTests.length})` },
            { id: 'transactions', label: `Ledger (${clientTransactions.length})` },
            { id: 'notes', label: 'Notes & Info' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-orange-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4 space-y-2">
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block">
                    Contact &amp; Identification
                  </span>
                  <div className="text-xs space-y-1.5 text-slate-300">
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span>Primary: <strong className="text-white">{client.mobile}</strong></span>
                    </p>
                    {client.alternativeMobile && (
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span>Alt: {client.alternativeMobile}</span>
                      </p>
                    )}
                    {client.email && (
                      <p className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span>{client.email}</span>
                      </p>
                    )}
                    {client.fatherHusbandName && (
                      <p className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <span>Father/Husband: {client.fatherHusbandName}</span>
                      </p>
                    )}
                    {client.nid && (
                      <p className="flex items-center gap-2">
                        <FileBadge className="h-4 w-4 text-slate-400" />
                        <span>NID: {client.nid}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4 space-y-2">
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block">
                    Address &amp; Referrals
                  </span>
                  <div className="text-xs space-y-1.5 text-slate-300">
                    <p className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>{client.address}</span>
                    </p>
                    {client.referenceInfo && (
                      <p className="mt-2 text-[11px] text-slate-400">
                        <strong className="text-slate-300">Reference:</strong> {client.referenceInfo}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Projects Quick Preview */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Commissioned Projects
                </h4>
                {clientProjects.length === 0 ? (
                  <p className="text-xs text-slate-500 py-3">No projects assigned yet.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {clientProjects.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onSelectProject(p.id);
                          onClose();
                        }}
                        className="cursor-pointer rounded-xl border border-slate-800 bg-slate-800/60 p-3 hover:border-orange-500 transition"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">{p.name}</span>
                          <span className="rounded bg-orange-600/20 px-1.5 py-0.5 text-[10px] font-bold text-orange-400">
                            {p.currentStage}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {p.storeys} Storey • {p.foundationType} • {p.areaSft.toLocaleString()} SFT
                        </p>
                        <div className="mt-2 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Progress: {p.progressPercent}%</span>
                          <span className="font-semibold text-rose-400">Due: {sym} {p.dueAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-3">
              {clientProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectProject(p.id);
                    onClose();
                  }}
                  className="cursor-pointer rounded-xl border border-slate-800 bg-slate-800/50 p-4 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{p.name}</h4>
                      <p className="text-xs text-slate-400">
                        {p.projectCode} • {p.projectLocation}
                      </p>
                    </div>
                    <span className="rounded-md bg-orange-600 px-2 py-0.5 text-xs font-bold text-white">
                      {p.currentStage}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-800 pt-3 text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px]">Contract</span>
                      <p className="font-bold text-white">{sym} {p.contractAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px]">Paid</span>
                      <p className="font-bold text-emerald-400">{sym} {p.paidAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px]">Due</span>
                      <p className="font-bold text-rose-400">{sym} {p.dueAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: CONTRACTS & SERVICES */}
          {activeTab === 'contracts' && (
            <div className="space-y-2">
              {clientServices.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No service contracts logged.</p>
              ) : (
                clientServices.map((s) => (
                  <div key={s.id} className="rounded-xl border border-slate-800 bg-slate-800/40 p-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{s.serviceName}</span>
                      <span className="rounded bg-slate-700 px-2 py-0.5 text-[10px] text-slate-300">
                        {s.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5">{s.quantityScope}</p>
                    <div className="mt-2 grid grid-cols-4 gap-2 text-[11px] border-t border-slate-800/60 pt-2">
                      <div>
                        <span className="text-slate-500">Agreed:</span> {sym} {s.agreedPrice.toLocaleString()}
                      </div>
                      <div>
                        <span className="text-slate-500">Discount:</span> {sym} {s.discount.toLocaleString()}
                      </div>
                      <div>
                        <span className="text-slate-500">Final:</span> {sym} {s.finalContractAmount.toLocaleString()}
                      </div>
                      <div>
                        <span className="text-slate-500">Due:</span> <strong className="text-rose-400">{sym} {s.due.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="space-y-2">
              {clientPayments.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No payment vouchers found.</p>
              ) : (
                clientPayments.map((pay) => (
                  <div key={pay.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-800/40 p-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{pay.receiptNo}</span>
                        <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-400">
                          {pay.paymentMethod}
                        </span>
                        <span className="text-slate-400">{pay.date}</span>
                      </div>
                      <p className="text-slate-400 mt-0.5">Project: {pay.projectName} • Ref: {pay.reference || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-emerald-400">
                        {sym} {pay.amount.toLocaleString()}
                      </span>
                      <p className="text-[10px] text-slate-500">Rec: {pay.receivedBy}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 5: COMMITMENTS */}
          {activeTab === 'commitments' && (
            <div className="space-y-2">
              {clientCommitments.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No payment commitments.</p>
              ) : (
                clientCommitments.map((cmt) => (
                  <div key={cmt.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-800/40 p-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{cmt.projectName}</span>
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          cmt.status === 'Overdue' ? 'bg-rose-900/60 text-rose-300' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {cmt.status}
                        </span>
                      </div>
                      <p className="text-slate-400 mt-0.5">{cmt.description} • Due: {cmt.commitmentDate}</p>
                    </div>
                    <span className="font-bold text-rose-400 text-sm">
                      {sym} {cmt.dueAmount.toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 6: FILES */}
          {activeTab === 'files' && (
            <div className="space-y-2">
              {clientFiles.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No project files uploaded.</p>
              ) : (
                clientFiles.map((f) => (
                  <div key={f.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-800/40 p-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{f.fileName}</span>
                        <span className="rounded bg-orange-600/20 px-1.5 py-0.5 text-[10px] font-bold text-orange-400">
                          {f.currentVersion}
                        </span>
                        <span className="rounded bg-slate-700 px-1.5 py-0.5 text-[10px] text-slate-300">
                          {f.category}
                        </span>
                      </div>
                      <p className="text-slate-400 mt-0.5">Project: {f.projectName} • Status: {f.status}</p>
                    </div>
                    <span className="text-[11px] text-slate-400">{f.versions.length} versions</span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 7: SITE VISITS */}
          {activeTab === 'siteVisits' && (
            <div className="space-y-2">
              {clientVisits.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No site visit logs.</p>
              ) : (
                clientVisits.map((v) => (
                  <div key={v.id} className="rounded-xl border border-slate-800 bg-slate-800/40 p-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{v.projectName}</span>
                      <span className="text-slate-400">{v.visitDate} ({v.visitTime})</span>
                    </div>
                    <p className="text-slate-300 mt-1">Engineer: {v.engineerName} • Stage: {v.currentWorkStage}</p>
                    <p className="text-slate-400 italic mt-0.5">&ldquo;{v.observation}&rdquo;</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 8: SOIL TESTS */}
          {activeTab === 'soilTests' && (
            <div className="space-y-2">
              {clientSoilTests.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No geotechnical tests recorded.</p>
              ) : (
                clientSoilTests.map((s) => (
                  <div key={s.id} className="rounded-xl border border-slate-800 bg-slate-800/40 p-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{s.testCode} ({s.boreholeId})</span>
                      <span className="text-slate-400">{s.testDate}</span>
                    </div>
                    <p className="text-slate-300 mt-0.5">Depth: {s.totalDepthFeet} ft • GWT: {s.groundwaterLevelFeet} ft</p>
                    <p className="text-orange-400 mt-1 font-semibold">
                      Recommendation: {s.recommendation.recommendedFoundation}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 9: TRANSACTIONS LEDGER */}
          {activeTab === 'transactions' && (
            <div className="space-y-2">
              {clientTransactions.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No accounting transactions.</p>
              ) : (
                clientTransactions.map((t) => (
                  <div key={t.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-800/40 p-3 text-xs">
                    <div>
                      <span className="font-bold text-white">{t.category}</span>
                      <p className="text-slate-400">{t.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-400">{sym} {t.amount.toLocaleString()}</span>
                      <p className="text-[10px] text-slate-500">{t.date}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 10: NOTES */}
          {activeTab === 'notes' && (
            <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4 text-xs text-slate-300 space-y-2">
              <span className="font-bold text-orange-400 uppercase tracking-wider block">
                Internal Client Notes
              </span>
              <p className="whitespace-pre-wrap leading-relaxed">
                {client.notes || 'No specific notes recorded for this client.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
