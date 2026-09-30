import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2,
  Edit,
  Save,
  X,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BillCommitment, CommitmentStatus } from '../../types';

export const CommitmentManager: React.FC = () => {
  const {
    commitments,
    projects,
    clients,
    saveCommitment,
    deleteCommitment,
    currentCompany,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCommitment, setEditingCommitment] = useState<BillCommitment | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const sym = currentCompany.currencySymbol || '৳';

  const [formData, setFormData] = useState({
    projectId: projects[0]?.id || '',
    billAmount: 250000,
    dueAmount: 250000,
    commitmentDate: new Date().toISOString().slice(0, 10),
    description: 'Structural drawing vetting & 4th floor milestone payment',
    status: 'Upcoming' as CommitmentStatus,
    notes: '',
  });

  const handleOpenAdd = () => {
    setEditingCommitment(null);
    setFormData({
      projectId: projects[0]?.id || '',
      billAmount: 200000,
      dueAmount: 200000,
      commitmentDate: new Date().toISOString().slice(0, 10),
      description: 'Casting milestone release',
      status: 'Upcoming',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cmt: BillCommitment) => {
    setEditingCommitment(cmt);
    setFormData({
      projectId: cmt.projectId,
      billAmount: cmt.billAmount,
      dueAmount: cmt.dueAmount,
      commitmentDate: cmt.commitmentDate,
      description: cmt.description,
      status: cmt.status,
      notes: cmt.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === formData.projectId);
    const client = proj ? clients.find((c) => c.id === proj.clientId) : undefined;

    const payload: BillCommitment = {
      id: editingCommitment ? editingCommitment.id : `cmt-${Date.now()}`,
      companyId: currentCompany.id,
      clientId: client ? client.id : (proj ? proj.clientId : 'cli-001'),
      clientName: client ? client.name : (proj ? proj.clientName : 'Client'),
      projectId: formData.projectId,
      projectName: proj ? proj.name : 'Project',
      billAmount: Number(formData.billAmount) || 0,
      dueAmount: Number(formData.dueAmount) || 0,
      commitmentDate: formData.commitmentDate,
      description: formData.description.trim(),
      status: formData.status,
      notes: formData.notes.trim() || undefined,
      createdAt: editingCommitment ? editingCommitment.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveCommitment(payload);
    setIsModalOpen(false);
  };

  const filteredCommitments = commitments.filter((c) => {
    if (filterStatus === 'all') return true;
    return c.status === filterStatus;
  });

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl dark:text-white">
              Client Payment Commitment Tracker
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Automated detection for Upcoming, Due Today, and Overdue milestone collections
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-orange-500 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>New Bill Commitment</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        {[
          { id: 'all', label: `All (${commitments.length})` },
          { id: 'Due Today', label: 'Due Today', count: commitments.filter((c) => c.status === 'Due Today').length },
          { id: 'Overdue', label: 'Overdue', count: commitments.filter((c) => c.status === 'Overdue').length, alert: true },
          { id: 'Upcoming', label: 'Upcoming', count: commitments.filter((c) => c.status === 'Upcoming').length },
          { id: 'Cleared', label: 'Cleared', count: commitments.filter((c) => c.status === 'Cleared').length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              filterStatus === tab.id
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Commitments List */}
      <div className="space-y-3">
        {filteredCommitments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 py-12 text-center text-slate-400 dark:border-slate-800">
            <Clock className="mx-auto h-8 w-8 text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              No bill commitments found in &ldquo;{filterStatus}&rdquo; status.
            </p>
          </div>
        ) : (
          filteredCommitments.map((cmt) => (
            <div
              key={cmt.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      cmt.status === 'Overdue'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : cmt.status === 'Due Today'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : cmt.status === 'Cleared'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    }`}
                  >
                    {cmt.status}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {cmt.clientName}
                  </h3>
                  <span className="text-xs text-slate-400">• {cmt.projectName}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  {cmt.description}
                </p>

                <div className="mt-2 flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Promised Date: <strong>{cmt.commitmentDate}</strong></span>
                  </span>
                  {cmt.notes && <span>Note: {cmt.notes}</span>}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 sm:mt-0 sm:border-0 sm:pt-0 sm:flex-col sm:items-end">
                <div className="text-right">
                  <p className="text-base font-black text-rose-600 dark:text-rose-400">
                    {sym} {cmt.dueAmount.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-400">Bill: {sym} {cmt.billAmount.toLocaleString()}</p>
                </div>

                <div className="flex items-center gap-1 sm:mt-2">
                  {cmt.status !== 'Cleared' && (
                    <button
                      onClick={async () => {
                        await saveCommitment({ ...cmt, status: 'Cleared', dueAmount: 0 });
                      }}
                      className="rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300"
                    >
                      Mark Cleared
                    </button>
                  )}
                  <button
                    onClick={() => handleOpenEdit(cmt)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Edit Commitment"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => deleteCommitment(cmt.id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                    title="Delete Commitment"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold">
                {editingCommitment ? 'Edit Payment Commitment' : 'Add Client Payment Commitment'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Target Project
                </label>
                <select
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.clientName})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Bill Amount (৳)
                  </label>
                  <input
                    type="number"
                    value={formData.billAmount || ''}
                    onChange={(e) => setFormData({ ...formData, billAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Promised Due Amount (৳)
                  </label>
                  <input
                    type="number"
                    value={formData.dueAmount || ''}
                    onChange={(e) => setFormData({ ...formData, dueAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white text-rose-400 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Commitment Date
                  </label>
                  <input
                    type="date"
                    value={formData.commitmentDate}
                    onChange={(e) => setFormData({ ...formData, commitmentDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as CommitmentStatus })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Due Today">Due Today</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Cleared">Cleared</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Milestone Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. 6th floor casting milestone release"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Follow-up Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Client conversation, cheque promise details"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-orange-500"
                >
                  <Save className="h-4 w-4" />
                  Save Commitment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
