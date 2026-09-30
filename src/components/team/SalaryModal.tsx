import React, { useState, useEffect } from 'react';
import { X, DollarSign, Save, Calculator } from 'lucide-react';
import { EmployeeSalary } from '../../types';
import { useApp } from '../../context/AppContext';

interface SalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  salaryToEdit?: EmployeeSalary | null;
}

export const SalaryModal: React.FC<SalaryModalProps> = ({
  isOpen,
  onClose,
  salaryToEdit,
}) => {
  const { currentCompany, employees, saveSalary } = useApp();

  const [formData, setFormData] = useState({
    employeeId: employees[0]?.id || '',
    month: new Date().toISOString().slice(0, 7),
    basicSalary: 60000,
    advance: 0,
    deduction: 0,
    bonus: 0,
    paid: 60000,
    paymentDate: new Date().toISOString().slice(0, 10),
    notes: '',
  });

  useEffect(() => {
    if (salaryToEdit) {
      setFormData({
        employeeId: salaryToEdit.employeeId,
        month: salaryToEdit.month,
        basicSalary: salaryToEdit.basicSalary,
        advance: salaryToEdit.advance,
        deduction: salaryToEdit.deduction,
        bonus: salaryToEdit.bonus,
        paid: salaryToEdit.paid,
        paymentDate: salaryToEdit.paymentDate || '',
        notes: salaryToEdit.notes || '',
      });
    } else {
      const defaultEmp = employees[0];
      setFormData({
        employeeId: defaultEmp ? defaultEmp.id : '',
        month: new Date().toISOString().slice(0, 7),
        basicSalary: defaultEmp ? defaultEmp.salary : 50000,
        advance: 0,
        deduction: 0,
        bonus: 0,
        paid: defaultEmp ? defaultEmp.salary : 50000,
        paymentDate: new Date().toISOString().slice(0, 10),
        notes: '',
      });
    }
  }, [salaryToEdit, isOpen, employees]);

  if (!isOpen) return null;

  // Auto Calculation (Section 24)
  const totalEarned = (formData.basicSalary || 0) + (formData.bonus || 0);
  const totalDeducted = (formData.advance || 0) + (formData.deduction || 0) + (formData.paid || 0);
  const calculatedDue = Math.max(0, totalEarned - totalDeducted);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeId) return;

    const emp = employees.find((e) => e.id === formData.employeeId);
    const payload: EmployeeSalary = {
      id: salaryToEdit ? salaryToEdit.id : `sal-${Date.now()}`,
      companyId: currentCompany.id,
      employeeId: formData.employeeId,
      employeeName: emp ? emp.name : 'Employee',
      month: formData.month,
      basicSalary: Number(formData.basicSalary) || 0,
      advance: Number(formData.advance) || 0,
      deduction: Number(formData.deduction) || 0,
      bonus: Number(formData.bonus) || 0,
      paid: Number(formData.paid) || 0,
      due: calculatedDue,
      paymentDate: formData.paymentDate || undefined,
      notes: formData.notes.trim() || undefined,
      createdAt: salaryToEdit ? salaryToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveSalary(payload);
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
                {salaryToEdit ? 'Edit Salary Record' : 'Disburse Employee Salary (Section 24)'}
              </h3>
              <p className="text-xs text-slate-400">Monthly payroll entry with advance &amp; bonus tracking</p>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Employee
              </label>
              <select
                value={formData.employeeId}
                onChange={(e) => {
                  const emp = employees.find((em) => em.id === e.target.value);
                  setFormData({
                    ...formData,
                    employeeId: e.target.value,
                    basicSalary: emp ? emp.salary : formData.basicSalary,
                    paid: emp ? emp.salary : formData.paid,
                  });
                }}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              >
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Salary Month (YYYY-MM)
              </label>
              <input
                type="month"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Basic Salary (৳)
              </label>
              <input
                type="number"
                value={formData.basicSalary || ''}
                onChange={(e) => setFormData({ ...formData, basicSalary: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Bonus (৳)
              </label>
              <input
                type="number"
                value={formData.bonus || ''}
                onChange={(e) => setFormData({ ...formData, bonus: parseFloat(e.target.value) || 0 })}
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
                placeholder="0"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Deductions (৳)
              </label>
              <input
                type="number"
                value={formData.deduction || ''}
                onChange={(e) => setFormData({ ...formData, deduction: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Disbursed Now (৳)
              </label>
              <input
                type="number"
                value={formData.paid || ''}
                onChange={(e) => setFormData({ ...formData, paid: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-bold text-emerald-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Payment Date
              </label>
              <input
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Section 24 Automated Due Calculation Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-800/60 p-3 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Net Payable (Basic + Bonus):</span>
              <span className="font-bold text-white">৳ {totalEarned.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Disbursed + Advances:</span>
              <span className="font-bold text-emerald-400">৳ {totalDeducted.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs border-t border-slate-700/60 pt-1">
              <span className="font-bold text-rose-400">Remaining Salary Due:</span>
              <span className="font-black text-rose-400 text-sm">৳ {calculatedDue.toLocaleString()}</span>
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
              className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-orange-500"
            >
              <Save className="h-4 w-4" />
              Save Salary Disbursement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
