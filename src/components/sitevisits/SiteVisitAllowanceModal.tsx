import React, { useState, useEffect } from 'react';
import { X, DollarSign, Save } from 'lucide-react';
import { SiteVisitAllowance } from '../../types';
import { useApp } from '../../context/AppContext';

interface SiteVisitAllowanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  allowanceToEdit?: SiteVisitAllowance | null;
}

export const SiteVisitAllowanceModal: React.FC<SiteVisitAllowanceModalProps> = ({
  isOpen,
  onClose,
  allowanceToEdit,
}) => {
  const { currentCompany, employees, projects, saveAllowance } = useApp();

  const engineers = employees.filter(
    (e) => e.role === 'Site Engineer' || e.role === 'Engineer' || e.role === 'Structural Engineer'
  );

  const [formData, setFormData] = useState({
    engineerId: engineers[0]?.id || '',
    engineerName: engineers[0]?.name || '',
    projectId: projects[0]?.id || '',
    projectName: projects[0]?.name || '',
    allowanceType: 'Per-visit' as 'Per-visit' | 'Monthly',
    amount: 1500,
    date: new Date().toISOString().slice(0, 10),
    month: new Date().toISOString().slice(0, 7),
    status: 'Unpaid' as 'Paid' | 'Unpaid',
    notes: '',
  });

  useEffect(() => {
    if (allowanceToEdit) {
      setFormData({
        engineerId: allowanceToEdit.engineerId,
        engineerName: allowanceToEdit.engineerName,
        projectId: allowanceToEdit.projectId,
        projectName: allowanceToEdit.projectName,
        allowanceType: allowanceToEdit.allowanceType,
        amount: allowanceToEdit.amount,
        date: allowanceToEdit.date,
        month: allowanceToEdit.month,
        status: allowanceToEdit.status,
        notes: allowanceToEdit.notes || '',
      });
    } else {
      const defaultEng = engineers[0];
      const defaultProj = projects[0];
      setFormData({
        engineerId: defaultEng ? defaultEng.id : '',
        engineerName: defaultEng ? defaultEng.name : '',
        projectId: defaultProj ? defaultProj.id : '',
        projectName: defaultProj ? defaultProj.name : '',
        allowanceType: 'Per-visit',
        amount: 1500,
        date: new Date().toISOString().slice(0, 10),
        month: new Date().toISOString().slice(0, 7),
        status: 'Unpaid',
        notes: '',
      });
    }
  }, [allowanceToEdit, isOpen, engineers, projects]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.engineerId || formData.amount <= 0) return;

    const payload: SiteVisitAllowance = {
      id: allowanceToEdit ? allowanceToEdit.id : `alw-${Date.now()}`,
      companyId: currentCompany.id,
      engineerId: formData.engineerId,
      engineerName: formData.engineerName,
      projectId: formData.projectId,
      projectName: formData.projectName,
      allowanceType: formData.allowanceType,
      amount: Number(formData.amount) || 0,
      date: formData.date,
      month: formData.month,
      status: formData.status,
      paidDate: formData.status === 'Paid' ? new Date().toISOString().slice(0, 10) : undefined,
      notes: formData.notes.trim() || undefined,
      createdAt: allowanceToEdit ? allowanceToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveAllowance(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white font-bold">
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {allowanceToEdit ? 'Edit Site Allowance' : 'Record Site Engineer Allowance'}
              </h3>
              <p className="text-xs text-slate-400">Section 16: Per-visit &amp; monthly conveyance records</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Site Engineer
            </label>
            <select
              value={formData.engineerId}
              onChange={(e) => {
                const eng = employees.find((em) => em.id === e.target.value);
                setFormData({
                  ...formData,
                  engineerId: e.target.value,
                  engineerName: eng ? eng.name : formData.engineerName,
                });
              }}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
            >
              {employees.map((e) => (
                <option key={e.id} value={e.id}>{e.name} ({e.position})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Project Site
            </label>
            <select
              value={formData.projectId}
              onChange={(e) => {
                const pr = projects.find((p) => p.id === e.target.value);
                setFormData({
                  ...formData,
                  projectId: e.target.value,
                  projectName: pr ? pr.name : formData.projectName,
                });
              }}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.projectLocation})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Allowance Type
              </label>
              <select
                value={formData.allowanceType}
                onChange={(e) => setFormData({ ...formData, allowanceType: e.target.value as 'Per-visit' | 'Monthly' })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              >
                <option value="Per-visit">Per-visit</option>
                <option value="Monthly">Monthly Allowance</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Amount (৳)
              </label>
              <input
                type="number"
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                placeholder="1500"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value, month: e.target.value.slice(0, 7) })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Disbursement Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Paid' | 'Unpaid' })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              >
                <option value="Unpaid">Unpaid (Pending)</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Remarks
            </label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Conveyance for evening casting inspection"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white"
            />
          </div>

          <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-orange-500"
            >
              <Save className="h-4 w-4" />
              Save Allowance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
