import React, { useState, useMemo } from 'react';
import {
  Compass,
  Plus,
  Search,
  Calendar,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  HardHat,
  Trash2,
  Edit,
  Clock,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SiteVisit, SiteVisitAllowance } from '../../types';
import { SiteVisitModal } from './SiteVisitModal';
import { SiteVisitAllowanceModal } from './SiteVisitAllowanceModal';

export const SiteVisitManager: React.FC = () => {
  const {
    siteVisits,
    allowances,
    projects,
    employees,
    deleteSiteVisit,
    deleteAllowance,
    saveAllowance,
    currentCompany,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'visits' | 'allowances'>('visits');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [selectedEngineerId, setSelectedEngineerId] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [visitToEdit, setVisitToEdit] = useState<SiteVisit | null>(null);

  const [isAllowanceModalOpen, setIsAllowanceModalOpen] = useState(false);
  const [allowanceToEdit, setAllowanceToEdit] = useState<SiteVisitAllowance | null>(null);

  const sym = currentCompany.currencySymbol || '৳';

  // Distinct months from allowances
  const availableMonths = useMemo(() => {
    return Array.from(new Set(allowances.map((a) => a.month).filter(Boolean)));
  }, [allowances]);

  // Filtered visits
  const filteredVisits = useMemo(() => {
    return siteVisits.filter((v) => {
      if (selectedProjectId !== 'all' && v.projectId !== selectedProjectId) return false;
      if (selectedEngineerId !== 'all' && v.engineerId !== selectedEngineerId) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          v.projectName.toLowerCase().includes(q) ||
          v.clientName.toLowerCase().includes(q) ||
          v.engineerName.toLowerCase().includes(q) ||
          v.observation.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [siteVisits, selectedProjectId, selectedEngineerId, searchQuery]);

  // Filtered allowances
  const filteredAllowances = useMemo(() => {
    return allowances.filter((a) => {
      if (selectedProjectId !== 'all' && a.projectId !== selectedProjectId) return false;
      if (selectedEngineerId !== 'all' && a.engineerId !== selectedEngineerId) return false;
      if (selectedMonth !== 'all' && a.month !== selectedMonth) return false;
      return true;
    });
  }, [allowances, selectedProjectId, selectedEngineerId, selectedMonth]);

  const totalAllowanceAmount = filteredAllowances.reduce((sum, a) => sum + a.amount, 0);
  const totalPaidAllowance = filteredAllowances.filter((a) => a.status === 'Paid').reduce((sum, a) => sum + a.amount, 0);
  const totalUnpaidAllowance = filteredAllowances.filter((a) => a.status === 'Unpaid').reduce((sum, a) => sum + a.amount, 0);

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl dark:text-white">
              Site Inspection &amp; Engineer Allowance Hub
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Sections 15 &amp; 16: Structural quality assurance, field reports &amp; conveyance allowance tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'visits' ? (
            <button
              onClick={() => {
                setVisitToEdit(null);
                setIsVisitModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-orange-500 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Log Site Inspection</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setAllowanceToEdit(null);
                setIsAllowanceModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-orange-500 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Record Allowance</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Switcher (Visits vs Allowances) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('visits')}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
            activeTab === 'visits'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Site Inspection Reports ({siteVisits.length})
        </button>
        <button
          onClick={() => setActiveTab('allowances')}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
            activeTab === 'allowances'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <DollarSign className="h-3.5 w-3.5" />
          Site Engineer Allowance ({allowances.length})
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        {activeTab === 'visits' && (
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search visits by project, engineer, or observations..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        )}

        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          <option value="all">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select
          value={selectedEngineerId}
          onChange={(e) => setSelectedEngineerId(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          <option value="all">All Engineers</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>

        {activeTab === 'allowances' && (
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="all">All Months</option>
            {availableMonths.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        )}
      </div>

      {/* TAB 1: SITE VISITS CARDS */}
      {activeTab === 'visits' && (
        <div className="space-y-3">
          {filteredVisits.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 py-12 text-center text-slate-400 dark:border-slate-800">
              <Compass className="mx-auto h-8 w-8 text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No site visits found</p>
            </div>
          ) : (
            filteredVisits.map((v) => (
              <div
                key={v.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {v.projectName}
                      </span>
                      <span className="rounded bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700 dark:bg-orange-950 dark:text-orange-400">
                        {v.currentWorkStage}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Client: {v.clientName} • Inspecting Engineer: <strong className="text-slate-700 dark:text-slate-300">{v.engineerName}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Calendar className="h-3.5 w-3.5" />
                      {v.visitDate} ({v.visitTime})
                    </span>
                    <button
                      onClick={() => {
                        setVisitToEdit(v);
                        setIsVisitModalOpen(true);
                      }}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteSiteVisit(v.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 text-xs text-slate-700 dark:text-slate-300 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/40">
                    <strong className="text-slate-500 uppercase text-[10px] block mb-1">
                      Observation &amp; Verification
                    </strong>
                    <p>{v.observation}</p>
                    <p className="text-[11px] text-slate-400 mt-2">
                      <strong>Site Condition:</strong> {v.siteCondition}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/40">
                    <strong className="text-slate-500 uppercase text-[10px] block mb-1">
                      Issues &amp; Action Plan
                    </strong>
                    {v.problems ? (
                      <p className="text-rose-600 font-semibold mb-1">Problem: {v.problems}</p>
                    ) : (
                      <p className="text-emerald-600 text-xs">No critical defects observed.</p>
                    )}
                    {v.requiredAction && (
                      <p className="text-amber-600 font-semibold">Action: {v.requiredAction}</p>
                    )}
                    {v.nextVisitDate && (
                      <p className="text-[11px] text-slate-400 mt-2">
                        Next scheduled inspection: <strong>{v.nextVisitDate}</strong>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: SITE ENGINEER ALLOWANCE (Section 16) */}
      {activeTab === 'allowances' && (
        <div className="space-y-4">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Total Allowance</span>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {sym} {totalAllowanceAmount.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-[10px] uppercase font-semibold text-emerald-500">Paid Disbursed</span>
              <p className="text-base font-bold text-emerald-500 mt-0.5">
                {sym} {totalPaidAllowance.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-[10px] uppercase font-semibold text-rose-500">Unpaid Due</span>
              <p className="text-base font-bold text-rose-500 mt-0.5">
                {sym} {totalUnpaidAllowance.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider dark:bg-slate-800/60 dark:text-slate-400">
                <tr>
                  <th className="px-3 py-2.5">Date</th>
                  <th className="px-3 py-2.5">Site Engineer</th>
                  <th className="px-3 py-2.5">Project</th>
                  <th className="px-3 py-2.5">Type</th>
                  <th className="px-3 py-2.5">Amount</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredAllowances.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-400">No allowance records found.</td>
                  </tr>
                ) : (
                  filteredAllowances.map((alw) => (
                    <tr key={alw.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="px-3 py-2.5 text-slate-500">{alw.date}</td>
                      <td className="px-3 py-2.5 font-bold text-slate-900 dark:text-white">{alw.engineerName}</td>
                      <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300">{alw.projectName}</td>
                      <td className="px-3 py-2.5">{alw.allowanceType}</td>
                      <td className="px-3 py-2.5 font-bold text-orange-600">{sym} {alw.amount.toLocaleString()}</td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            alw.status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {alw.status}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {alw.status === 'Unpaid' && (
                            <button
                              onClick={async () => {
                                await saveAllowance({
                                  ...alw,
                                  status: 'Paid',
                                  paidDate: new Date().toISOString().slice(0, 10),
                                });
                              }}
                              className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300"
                            >
                              Pay
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setAllowanceToEdit(alw);
                              setIsAllowanceModalOpen(true);
                            }}
                            className="p-1 text-slate-400 hover:text-slate-800"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deleteAllowance(alw.id)}
                            className="p-1 text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <SiteVisitModal
        isOpen={isVisitModalOpen}
        onClose={() => {
          setIsVisitModalOpen(false);
          setVisitToEdit(null);
        }}
        visitToEdit={visitToEdit}
      />

      <SiteVisitAllowanceModal
        isOpen={isAllowanceModalOpen}
        onClose={() => {
          setIsAllowanceModalOpen(false);
          setAllowanceToEdit(null);
        }}
        allowanceToEdit={allowanceToEdit}
      />
    </div>
  );
};
