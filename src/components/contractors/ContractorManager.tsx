import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Phone,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  Share2,
  X,
  Save,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Contractor, ContractorTrade, Middleman } from '../../types';

const TRADES: ContractorTrade[] = [
  'Civil',
  'Plumbing',
  'Electrical',
  'Tiles',
  'Paint',
  'False Ceiling',
  'Glass/Aluminium',
  'Fabrication/Steel',
  'Carpentry',
  'Other',
];

export const ContractorManager: React.FC = () => {
  const {
    contractors,
    middlemen,
    projects,
    clients,
    saveContractor,
    deleteContractor,
    saveMiddleman,
    deleteMiddleman,
    currentCompany,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'contractors' | 'middlemen'>('contractors');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isContractorModalOpen, setIsContractorModalOpen] = useState(false);
  const [contractorToEdit, setContractorToEdit] = useState<Contractor | null>(null);

  const [isMiddlemanModalOpen, setIsMiddlemanModalOpen] = useState(false);
  const [middlemanToEdit, setMiddlemanToEdit] = useState<Middleman | null>(null);

  const sym = currentCompany.currencySymbol || '৳';

  // Contractor Form State
  const [contractorForm, setContractorForm] = useState({
    name: '',
    companyName: '',
    mobile: '',
    trade: 'Civil' as ContractorTrade,
    projectId: projects[0]?.id || '',
    workScope: '',
    contractAmount: 5000000,
    paid: 3000000,
    startDate: new Date().toISOString().slice(0, 10),
    expectedCompletion: '',
    status: 'Active' as 'Active' | 'Completed' | 'Terminated' | 'Pending',
    notes: '',
  });

  // Middleman Form State
  const [middlemanForm, setMiddlemanForm] = useState({
    name: '',
    mobile: '',
    projectId: projects[0]?.id || '',
    clientId: clients[0]?.id || '',
    commission: 50000,
    commissionType: 'Fixed' as 'Percentage' | 'Fixed',
    paid: 30000,
    date: new Date().toISOString().slice(0, 10),
    notes: '',
  });

  const handleOpenContractorModal = (cnt?: Contractor) => {
    if (cnt) {
      setContractorToEdit(cnt);
      setContractorForm({
        name: cnt.name,
        companyName: cnt.companyName,
        mobile: cnt.mobile,
        trade: cnt.trade,
        projectId: cnt.projectId,
        workScope: cnt.workScope,
        contractAmount: cnt.contractAmount,
        paid: cnt.paid,
        startDate: cnt.startDate,
        expectedCompletion: cnt.expectedCompletion,
        status: cnt.status,
        notes: cnt.notes || '',
      });
    } else {
      setContractorToEdit(null);
      setContractorForm({
        name: '',
        companyName: '',
        mobile: '+880 1711-000000',
        trade: 'Civil',
        projectId: projects[0]?.id || '',
        workScope: 'Complete RCC structural framework & brickwork',
        contractAmount: 4500000,
        paid: 2000000,
        startDate: new Date().toISOString().slice(0, 10),
        expectedCompletion: '',
        status: 'Active',
        notes: '',
      });
    }
    setIsContractorModalOpen(true);
  };

  const handleContractorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === contractorForm.projectId);
    const payload: Contractor = {
      id: contractorToEdit ? contractorToEdit.id : `cnt-${Date.now()}`,
      companyId: currentCompany.id,
      name: contractorForm.name.trim(),
      companyName: contractorForm.companyName.trim(),
      mobile: contractorForm.mobile.trim(),
      trade: contractorForm.trade,
      projectId: contractorForm.projectId,
      projectName: proj ? proj.name : 'Project',
      workScope: contractorForm.workScope.trim(),
      contractAmount: Number(contractorForm.contractAmount) || 0,
      paid: Number(contractorForm.paid) || 0,
      due: Math.max(0, Number(contractorForm.contractAmount) - Number(contractorForm.paid)),
      startDate: contractorForm.startDate,
      expectedCompletion: contractorForm.expectedCompletion,
      status: contractorForm.status,
      notes: contractorForm.notes.trim() || undefined,
      createdAt: contractorToEdit ? contractorToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveContractor(payload);
    setIsContractorModalOpen(false);
  };

  const handleOpenMiddlemanModal = (mid?: Middleman) => {
    if (mid) {
      setMiddlemanToEdit(mid);
      setMiddlemanForm({
        name: mid.name,
        mobile: mid.mobile,
        projectId: mid.projectId,
        clientId: mid.clientId,
        commission: mid.commission,
        commissionType: mid.commissionType,
        paid: mid.paid,
        date: mid.date,
        notes: mid.notes || '',
      });
    } else {
      setMiddlemanToEdit(null);
      setMiddlemanForm({
        name: '',
        mobile: '+880 1711-000000',
        projectId: projects[0]?.id || '',
        clientId: clients[0]?.id || '',
        commission: 50000,
        commissionType: 'Fixed',
        paid: 20000,
        date: new Date().toISOString().slice(0, 10),
        notes: 'Client referral fee for structural design contract',
      });
    }
    setIsMiddlemanModalOpen(true);
  };

  const handleMiddlemanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === middlemanForm.projectId);
    const client = clients.find((c) => c.id === middlemanForm.clientId);
    const payload: Middleman = {
      id: middlemanToEdit ? middlemanToEdit.id : `mid-${Date.now()}`,
      companyId: currentCompany.id,
      name: middlemanForm.name.trim(),
      mobile: middlemanForm.mobile.trim(),
      projectId: middlemanForm.projectId,
      projectName: proj ? proj.name : 'Project',
      clientId: middlemanForm.clientId,
      clientName: client ? client.name : 'Client',
      commission: Number(middlemanForm.commission) || 0,
      commissionType: middlemanForm.commissionType,
      paid: Number(middlemanForm.paid) || 0,
      due: Math.max(0, Number(middlemanForm.commission) - Number(middlemanForm.paid)),
      date: middlemanForm.date,
      notes: middlemanForm.notes.trim() || undefined,
      createdAt: middlemanToEdit ? middlemanToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveMiddleman(payload);
    setIsMiddlemanModalOpen(false);
  };

  const filteredContractors = contractors.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.companyName.toLowerCase().includes(q) ||
      c.trade.toLowerCase().includes(q) ||
      c.projectName.toLowerCase().includes(q)
    );
  });

  const filteredMiddlemen = middlemen.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.clientName.toLowerCase().includes(q) ||
      m.projectName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5 pb-12">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl dark:text-white">
              Contractor &amp; Referral Partner Network
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Sections 18 &amp; 19: Trade contractors (Civil, Plumbing, Electrical, Tiles) &amp; project middleman commission tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'contractors' ? (
            <button
              onClick={() => handleOpenContractorModal()}
              className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-orange-500 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Add Contractor</span>
            </button>
          ) : (
            <button
              onClick={() => handleOpenMiddlemanModal()}
              className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-orange-500 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Add Referrer / Middleman</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('contractors')}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
            activeTab === 'contractors'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Trade Contractors ({contractors.length})
        </button>
        <button
          onClick={() => setActiveTab('middlemen')}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
            activeTab === 'middlemen'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Share2 className="h-3.5 w-3.5" />
          Middlemen &amp; Referrers ({middlemen.length})
        </button>
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by contractor name, firm, trade, referrer, or project..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* TAB 1: CONTRACTORS */}
      {activeTab === 'contractors' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredContractors.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 py-12 text-center text-slate-400 dark:border-slate-800">
              <Briefcase className="mx-auto h-8 w-8 text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No contractors found</p>
            </div>
          ) : (
            filteredContractors.map((c) => (
              <div
                key={c.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700 dark:bg-orange-950 dark:text-orange-400">
                      {c.trade}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {c.status}
                    </span>
                  </div>

                  <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                    {c.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {c.companyName}
                  </p>

                  <div className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    <p className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span>{c.mobile}</span>
                    </p>
                    <p className="text-slate-700 dark:text-slate-300">
                      Project: <strong>{c.projectName}</strong>
                    </p>
                    <p className="line-clamp-2 italic text-[11px] text-slate-500">
                      Scope: {c.workScope}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 dark:border-slate-800 text-[11px]">
                    <div>
                      <span className="text-[10px] text-slate-400">Contract</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{sym} {c.contractAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">Paid</span>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">{sym} {c.paid.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">Due</span>
                      <p className="font-bold text-rose-600 dark:text-rose-400">{sym} {c.due.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end gap-1 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <button
                    onClick={() => handleOpenContractorModal(c)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => deleteContractor(c.id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: MIDDLEMEN & REFERRERS */}
      {activeTab === 'middlemen' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMiddlemen.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 py-12 text-center text-slate-400 dark:border-slate-800">
              <Share2 className="mx-auto h-8 w-8 text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No referrers registered</p>
            </div>
          ) : (
            filteredMiddlemen.map((m) => (
              <div
                key={m.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                      Referrer Partner
                    </span>
                    <span className="text-[11px] text-slate-400">{m.date}</span>
                  </div>

                  <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                    {m.name}
                  </h3>
                  <p className="text-xs text-slate-500">{m.mobile}</p>

                  <div className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    <p>Referred Client: <strong>{m.clientName}</strong></p>
                    <p>Project: <strong>{m.projectName}</strong></p>
                    {m.notes && <p className="italic text-[11px] mt-1">&ldquo;{m.notes}&rdquo;</p>}
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 dark:border-slate-800 text-[11px]">
                    <div>
                      <span className="text-[10px] text-slate-400">Commission</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{sym} {m.commission.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">Paid</span>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">{sym} {m.paid.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">Due</span>
                      <p className="font-bold text-rose-600 dark:text-rose-400">{sym} {m.due.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end gap-1 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <button
                    onClick={() => handleOpenMiddlemanModal(m)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => deleteMiddleman(m.id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Contractor Modal */}
      {isContractorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl overflow-y-auto max-h-[92vh]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold">
                {contractorToEdit ? 'Edit Contractor Record' : 'Register Contractor (Section 18)'}
              </h3>
              <button
                onClick={() => setIsContractorModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleContractorSubmit} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Contractor Name</label>
                  <input
                    type="text"
                    required
                    value={contractorForm.name}
                    onChange={(e) => setContractorForm({ ...contractorForm, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Company / Firm</label>
                  <input
                    type="text"
                    required
                    value={contractorForm.companyName}
                    onChange={(e) => setContractorForm({ ...contractorForm, companyName: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Trade Discipline</label>
                  <select
                    value={contractorForm.trade}
                    onChange={(e) => setContractorForm({ ...contractorForm, trade: e.target.value as ContractorTrade })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                  >
                    {TRADES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Mobile Phone</label>
                  <input
                    type="text"
                    required
                    value={contractorForm.mobile}
                    onChange={(e) => setContractorForm({ ...contractorForm, mobile: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Project Site</label>
                <select
                  value={contractorForm.projectId}
                  onChange={(e) => setContractorForm({ ...contractorForm, projectId: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Scope of Work</label>
                <input
                  type="text"
                  value={contractorForm.workScope}
                  onChange={(e) => setContractorForm({ ...contractorForm, workScope: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Contract Amount (৳)</label>
                  <input
                    type="number"
                    value={contractorForm.contractAmount || ''}
                    onChange={(e) => setContractorForm({ ...contractorForm, contractAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Total Paid (৳)</label>
                  <input
                    type="number"
                    value={contractorForm.paid || ''}
                    onChange={(e) => setContractorForm({ ...contractorForm, paid: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setIsContractorModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-orange-500"
                >
                  <Save className="h-4 w-4" />
                  Save Contractor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Middleman Modal */}
      {isMiddlemanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl overflow-y-auto max-h-[92vh]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold">
                {middlemanToEdit ? 'Edit Middleman / Referrer' : 'Record Referrer Partner (Section 19)'}
              </h3>
              <button
                onClick={() => setIsMiddlemanModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleMiddlemanSubmit} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Referrer Name</label>
                  <input
                    type="text"
                    required
                    value={middlemanForm.name}
                    onChange={(e) => setMiddlemanForm({ ...middlemanForm, name: e.target.value })}
                    placeholder="Advocate Shafiul"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Mobile Phone</label>
                  <input
                    type="text"
                    required
                    value={middlemanForm.mobile}
                    onChange={(e) => setMiddlemanForm({ ...middlemanForm, mobile: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Referred Project</label>
                  <select
                    value={middlemanForm.projectId}
                    onChange={(e) => setMiddlemanForm({ ...middlemanForm, projectId: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Referred Client</label>
                  <select
                    value={middlemanForm.clientId}
                    onChange={(e) => setMiddlemanForm({ ...middlemanForm, clientId: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Commission Agreed (৳)</label>
                  <input
                    type="number"
                    value={middlemanForm.commission || ''}
                    onChange={(e) => setMiddlemanForm({ ...middlemanForm, commission: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Commission Paid (৳)</label>
                  <input
                    type="number"
                    value={middlemanForm.paid || ''}
                    onChange={(e) => setMiddlemanForm({ ...middlemanForm, paid: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Remarks &amp; Agreement</label>
                <input
                  type="text"
                  value={middlemanForm.notes}
                  onChange={(e) => setMiddlemanForm({ ...middlemanForm, notes: e.target.value })}
                  placeholder="e.g. 5% upon client second installment"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setIsMiddlemanModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-orange-500"
                >
                  <Save className="h-4 w-4" />
                  Save Referrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
