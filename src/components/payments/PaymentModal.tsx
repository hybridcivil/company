import React, { useState, useEffect } from 'react';
import { X, CreditCard, Save } from 'lucide-react';
import { Payment, PaymentMethod } from '../../types';
import { useApp } from '../../context/AppContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentToEdit?: Payment | null;
  projectId?: string;
  clientId?: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  'Cash',
  'Bank Transfer',
  'Cheque',
  'bKash',
  'Nagad',
  'Rocket',
];

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  paymentToEdit,
  projectId,
  clientId,
}) => {
  const { currentCompany, projects, clients, savePayment, payments, currentUser } = useApp();

  const [formData, setFormData] = useState({
    projectId: projectId || '',
    clientId: clientId || '',
    date: new Date().toISOString().slice(0, 10),
    amount: 100000,
    paymentMethod: 'Bank Transfer' as PaymentMethod,
    reference: '',
    receivedBy: currentUser.name,
    notes: '',
  });

  useEffect(() => {
    if (paymentToEdit) {
      setFormData({
        projectId: paymentToEdit.projectId,
        clientId: paymentToEdit.clientId,
        date: paymentToEdit.date,
        amount: paymentToEdit.amount,
        paymentMethod: paymentToEdit.paymentMethod,
        reference: paymentToEdit.reference || '',
        receivedBy: paymentToEdit.receivedBy || currentUser.name,
        notes: paymentToEdit.notes || '',
      });
    } else {
      const targetProj = projects.find((p) => p.id === projectId) || projects[0];
      setFormData({
        projectId: targetProj ? targetProj.id : '',
        clientId: targetProj ? targetProj.clientId : clients[0]?.id || '',
        date: new Date().toISOString().slice(0, 10),
        amount: 200000,
        paymentMethod: 'Bank Transfer',
        reference: 'DBBL / City Bank Transfer',
        receivedBy: currentUser.name,
        notes: 'Milestone casting clearance instalment',
      });
    }
  }, [paymentToEdit, projectId, clientId, isOpen, projects, clients, currentUser.name]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectId || formData.amount <= 0) return;

    const proj = projects.find((p) => p.id === formData.projectId);
    const client = clients.find((c) => c.id === formData.clientId) || (proj ? clients.find((c) => c.id === proj.clientId) : undefined);

    const nextReceiptNo = `HC-RCT-${new Date().getFullYear()}-${String(payments.length + 1).padStart(3, '0')}`;

    const payload: Payment = {
      id: paymentToEdit ? paymentToEdit.id : `pay-${Date.now()}`,
      companyId: currentCompany.id,
      receiptNo: paymentToEdit ? paymentToEdit.receiptNo : nextReceiptNo,
      clientId: client ? client.id : formData.clientId,
      clientName: client ? client.name : (proj ? proj.clientName : 'Client'),
      projectId: formData.projectId,
      projectName: proj ? proj.name : 'Project',
      date: formData.date,
      amount: Number(formData.amount) || 0,
      paymentMethod: formData.paymentMethod,
      reference: formData.reference.trim() || undefined,
      receivedBy: formData.receivedBy.trim(),
      notes: formData.notes.trim() || undefined,
      createdAt: paymentToEdit ? paymentToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await savePayment(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl overflow-y-auto max-h-[92vh]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white font-bold">
              <CreditCard className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {paymentToEdit ? 'Edit Payment Voucher' : 'Issue Money Receipt Voucher'}
              </h3>
              <p className="text-xs text-slate-400">
                Official client installment payment and receipt creation
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
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Select Project <span className="text-orange-500">*</span>
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
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-white"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.projectCode}) - Due: ৳{p.dueAmount.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Payment Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-white"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Amount Received (৳) <span className="text-orange-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                placeholder="250000"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-white font-bold text-emerald-400"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-white"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Reference Number */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Transaction / Cheque Ref No.
              </label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                placeholder="e.g. DBBL Trx #98124 / CHQ #89201"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-white"
              />
            </div>

            {/* Received By */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Received By Officer
              </label>
              <input
                type="text"
                value={formData.receivedBy}
                onChange={(e) => setFormData({ ...formData, receivedBy: e.target.value })}
                placeholder="Officer name"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-white"
              />
            </div>

            {/* Notes */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Receipt Remarks &amp; Milestone Purpose
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Payment purpose (e.g. 5th floor slab casting milestone)"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-white"
              />
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
              {paymentToEdit ? 'Save Changes' : 'Issue Voucher & Receipt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
