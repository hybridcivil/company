import React, { useState, useEffect } from 'react';
import { X, HardHat, Save } from 'lucide-react';
import { Employee, UserRole } from '../../types';
import { useApp } from '../../context/AppContext';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeToEdit?: Employee | null;
}

const ROLES: UserRole[] = [
  'Managing Director',
  'Structural Engineer',
  'Architect',
  'Site Engineer',
  'Draft Engineer',
  'Engineer',
  'Accountant',
  'Staff',
];

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  employeeToEdit,
}) => {
  const { currentCompany, saveEmployee, projects } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    role: 'Structural Engineer' as UserRole,
    mobile: '',
    email: '',
    joiningDate: new Date().toISOString().slice(0, 10),
    salary: 50000,
    status: 'Active' as 'Active' | 'On Leave' | 'Inactive',
    notes: '',
  });

  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        name: employeeToEdit.name,
        position: employeeToEdit.position,
        role: employeeToEdit.role,
        mobile: employeeToEdit.mobile,
        email: employeeToEdit.email,
        joiningDate: employeeToEdit.joiningDate,
        salary: employeeToEdit.salary,
        status: employeeToEdit.status,
        notes: employeeToEdit.notes || '',
      });
    } else {
      setFormData({
        name: '',
        position: 'Structural Engineer',
        role: 'Structural Engineer',
        mobile: '+880 1711-000000',
        email: '',
        joiningDate: new Date().toISOString().slice(0, 10),
        salary: 55000,
        status: 'Active',
        notes: '',
      });
    }
  }, [employeeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.mobile.trim()) return;

    const payload: Employee = {
      id: employeeToEdit ? employeeToEdit.id : `emp-${Date.now()}`,
      companyId: currentCompany.id,
      name: formData.name.trim(),
      position: formData.position.trim(),
      role: formData.role,
      mobile: formData.mobile.trim(),
      email: formData.email.trim(),
      joiningDate: formData.joiningDate,
      salary: Number(formData.salary) || 0,
      status: formData.status,
      notes: formData.notes.trim() || undefined,
      createdAt: employeeToEdit ? employeeToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveEmployee(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl overflow-y-auto max-h-[92vh]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white font-bold">
              <HardHat className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {employeeToEdit ? 'Edit Team Member' : 'Add Engineer / Staff Profile'}
              </h3>
              <p className="text-xs text-slate-400">Section 17: Engineering consultancy team management</p>
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
              Full Name <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Engr. Tanjil Hossain"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Designation Title
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="Senior Structural Engineer"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                System Role Assignment
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Mobile Number <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="+880 1711-..."
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="engineer@hybridcivil.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Joining Date
              </label>
              <input
                type="date"
                value={formData.joiningDate}
                onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Basic Monthly Salary (৳)
              </label>
              <input
                type="number"
                value={formData.salary || ''}
                onChange={(e) => setFormData({ ...formData, salary: parseFloat(e.target.value) || 0 })}
                placeholder="60000"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Active Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as typeof formData.status })}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
            >
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Qualifications &amp; Experience Notes
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="B.Sc Engr (Civil), ETABS certification, years of experience..."
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
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
