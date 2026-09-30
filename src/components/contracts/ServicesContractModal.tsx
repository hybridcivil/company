import React, { useState, useEffect } from 'react';
import { X, Layers, Save, Calculator } from 'lucide-react';
import { ServiceContract, ServiceType } from '../../types';
import { useApp } from '../../context/AppContext';

interface ServicesContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceToEdit?: ServiceContract | null;
  projectId?: string;
  clientId?: string;
}

const SERVICE_TYPES: ServiceType[] = [
  'Architectural Design',
  'Structural Design',
  'Electrical Design',
  'Plumbing Design',
  '3D Model',
  'Soil Test',
  'Municipality Approval Drawing',
  'Construction',
  'Construction Supervision',
  'Digital Survey',
  'BOQ/Estimate',
  'Other',
];

export const ServicesContractModal: React.FC<ServicesContractModalProps> = ({
  isOpen,
  onClose,
  serviceToEdit,
  projectId,
  clientId,
}) => {
  const { currentCompany, projects, clients, saveService } = useApp();

  const [formData, setFormData] = useState({
    projectId: projectId || '',
    clientId: clientId || '',
    serviceName: 'Structural Design' as ServiceType,
    rate: 25,
    quantityScope: '20,000 SFT (BNBC 2020 Compliance Detailing)',
    agreedPrice: 500000,
    discount: 25000,
    advance: 150000,
    paid: 150000,
    status: 'In Progress' as 'Pending' | 'In Progress' | 'Delivered' | 'Approved' | 'Completed',
    notes: '',
  });

  useEffect(() => {
    if (serviceToEdit) {
      setFormData({
        projectId: serviceToEdit.projectId,
        clientId: serviceToEdit.clientId,
        serviceName: serviceToEdit.serviceName,
        rate: serviceToEdit.rate,
        quantityScope: serviceToEdit.quantityScope,
        agreedPrice: serviceToEdit.agreedPrice,
        discount: serviceToEdit.discount,
        advance: serviceToEdit.advance,
        paid: serviceToEdit.paid,
        status: serviceToEdit.status,
        notes: serviceToEdit.notes || '',
      });
    } else {
      setFormData({
        projectId: projectId || projects[0]?.id || '',
        clientId: clientId || clients[0]?.id || '',
        serviceName: 'Structural Design',
        rate: 30,
        quantityScope: 'Complete high-rise framing and foundation analysis',
        agreedPrice: 600000,
        discount: 20000,
        advance: 200000,
        paid: 200000,
        status: 'In Progress',
        notes: '',
      });
    }
  }, [serviceToEdit, projectId, clientId, isOpen, projects, clients]);

  if (!isOpen) return null;

  // Auto Calculations (Section 8)
  const finalContractAmount = Math.max(0, formData.agreedPrice - formData.discount);
  const calculatedDue = Math.max(0, finalContractAmount - formData.paid);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectId || !formData.clientId) return;

    const payload: ServiceContract = {
      id: serviceToEdit ? serviceToEdit.id : `srv-${Date.now()}`,
      companyId: currentCompany.id,
      projectId: formData.projectId,
      clientId: formData.clientId,
      serviceName: formData.serviceName,
      rate: Number(formData.rate) || 0,
      quantityScope: formData.quantityScope.trim(),
      agreedPrice: Number(formData.agreedPrice) || 0,
      discount: Number(formData.discount) || 0,
      finalContractAmount,
      advance: Number(formData.advance) || 0,
      paid: Number(formData.paid) || 0,
      due: calculatedDue,
      status: formData.status,
      notes: formData.notes.trim() || undefined,
      createdAt: serviceToEdit ? serviceToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveService(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl overflow-y-auto max-h-[92vh]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white font-bold">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {serviceToEdit ? 'Edit Service Contract' : 'Add Service & Consultancy Scope'}
              </h3>
              <p className="text-xs text-slate-400">
                Automatic contract calculations &amp; due accounting
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {/* Project Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Project Target
              </label>
              <select
                value={formData.projectId}
                onChange={(e) => {
                  const p = projects.find((pr) => pr.id === e.target.value);
                  setFormData({
                    ...formData,
                    projectId: e.target.value,
                    clientId: p ? p.clientId : formData.clientId,
                  });
                }}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.projectCode})</option>
                ))}
              </select>
            </div>

            {/* Service Type */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Engineering Service Discipline
              </label>
              <select
                value={formData.serviceName}
                onChange={(e) => setFormData({ ...formData, serviceName: e.target.value as ServiceType })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              >
                {SERVICE_TYPES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Scope / Quantity */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Quantity &amp; Technical Scope Description
              </label>
              <input
                type="text"
                value={formData.quantityScope}
                onChange={(e) => setFormData({ ...formData, quantityScope: e.target.value })}
                placeholder="e.g. 28,500 SFT ETABS Analysis & Detailing"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white"
              />
            </div>

            {/* Rate & Agreed Price */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Rate (৳ / SFT or Lumpsum)
              </label>
              <input
                type="number"
                value={formData.rate || ''}
                onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) || 0 })}
                placeholder="30"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Agreed Gross Price (৳)
              </label>
              <input
                type="number"
                value={formData.agreedPrice || ''}
                onChange={(e) => setFormData({ ...formData, agreedPrice: parseFloat(e.target.value) || 0 })}
                placeholder="600000"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            {/* Discount & Advance */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Discount Given (৳)
              </label>
              <input
                type="number"
                value={formData.discount || ''}
                onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Advance Paid (৳)
              </label>
              <input
                type="number"
                value={formData.advance || ''}
                onChange={(e) => setFormData({ ...formData, advance: parseFloat(e.target.value) || 0 })}
                placeholder="200000"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Total Paid To Date (৳)
              </label>
              <input
                type="number"
                value={formData.paid || ''}
                onChange={(e) => setFormData({ ...formData, paid: parseFloat(e.target.value) || 0 })}
                placeholder="200000"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Delivery Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as typeof formData.status })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Delivered">Delivered</option>
                <option value="Approved">Approved</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Section 8 Automatic Calculation Card */}
          <div className="rounded-xl border border-orange-500/30 bg-orange-950/20 p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400">
              <Calculator className="h-4 w-4" />
              <span>Automated Financial Computation (BNBC Standard)</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs pt-1 sm:grid-cols-3">
              <div>
                <span className="text-slate-400 text-[11px]">Final Contract Amount:</span>
                <p className="text-sm font-bold text-white mt-0.5">৳ {finalContractAmount.toLocaleString()}</p>
                <span className="text-[10px] text-slate-500">Agreed - Discount</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Total Paid:</span>
                <p className="text-sm font-bold text-emerald-400 mt-0.5">৳ {formData.paid.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-rose-400 text-[11px] font-semibold">Remaining Due:</span>
                <p className="text-base font-black text-rose-400 mt-0.5">৳ {calculatedDue.toLocaleString()}</p>
                <span className="text-[10px] text-slate-500">Contract - Total Paid</span>
              </div>
            </div>
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
              className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-orange-500 active:scale-95"
            >
              <Save className="h-4 w-4" />
              Save Service Contract
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
