import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  User,
  KeyRound,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole, UserSession } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_USERS: { name: string; email: string; role: UserRole; title: string }[] = [
  {
    name: 'Engr. Ashraf',
    email: 'ashraf@hybridcivil.com',
    role: 'Managing Director',
    title: 'Managing Director & Principal Consultant (Full Management)',
  },
  {
    name: 'System Super Admin',
    email: 'superadmin@hybridcivil.com',
    role: 'Super Admin',
    title: 'Master Admin (Control All Companies & Software Tenants)',
  },
  {
    name: 'Engr. Tanjil Hossain',
    email: 'tanjil.structural@hybridcivil.com',
    role: 'Structural Engineer',
    title: 'Senior Structural Engineer (Analysis, Design, Vetting)',
  },
  {
    name: 'Ar. Samira Chowdhury',
    email: 'samira.arch@hybridcivil.com',
    role: 'Architect',
    title: 'Senior Architect (Layouts, 3D, Approvals)',
  },
  {
    name: 'Engr. Rashedul Karim',
    email: 'rashedul.site@hybridcivil.com',
    role: 'Site Engineer',
    title: 'Site Engineer (Quality Inspections, Site Visits, Field Allowances)',
  },
  {
    name: 'Md. Kamrul Hasan',
    email: 'kamrul.cad@hybridcivil.com',
    role: 'Draft Engineer',
    title: 'CAD Draft Engineer (AutoCAD & Drawings Revision)',
  },
  {
    name: 'Farhana Haque',
    email: 'accounts@hybridcivil.com',
    role: 'Accountant',
    title: 'Accountant (Collections, Expenses, Boksis, Salaries)',
  },
  {
    name: 'Sumon Mia',
    email: 'staff@hybridcivil.com',
    role: 'Staff',
    title: 'Office Support Staff (Document dispatch & Logistics)',
  },
];

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, setCurrentUser, currentCompany, logAuditAction } = useApp();
  const [selectedUser, setSelectedUser] = useState<UserSession>({
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role,
    companyId: currentCompany.id,
  });

  if (!isOpen) return null;

  const handleSelectPreset = (u: typeof PRESET_USERS[0]) => {
    setSelectedUser({
      id: `usr-${u.role.toLowerCase().replace(/\s+/g, '-')}`,
      name: u.name,
      email: u.email,
      role: u.role,
      companyId: currentCompany.id,
    });
  };

  const handleConfirmLogin = async () => {
    setCurrentUser(selectedUser);
    await logAuditAction(
      'LOGIN',
      'Auth',
      selectedUser.id,
      `User ${selectedUser.name} signed in with role [${selectedUser.role}]`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white font-bold">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">Role &amp; Authentication Control</h3>
              <p className="text-xs text-slate-400">Switch role to test multi-role permissions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current User Card */}
        <div className="my-4 rounded-xl border border-slate-700 bg-slate-800/80 p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Currently Logged In As
            </span>
            <p className="text-sm font-bold text-white mt-0.5">{currentUser.name}</p>
            <p className="text-xs text-orange-400 font-medium">{currentUser.role} • {currentUser.email}</p>
          </div>
          <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Active Session
          </span>
        </div>

        {/* Preset Role Selection */}
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
            Select Role Identity to Test Permissions:
          </label>
          <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
            {PRESET_USERS.map((u) => {
              const isSelected = selectedUser.role === u.role && selectedUser.name === u.name;
              return (
                <div
                  key={u.role + u.name}
                  onClick={() => handleSelectPreset(u)}
                  className={`flex cursor-pointer items-start justify-between rounded-xl border p-2.5 transition ${
                    isSelected
                      ? 'border-orange-500 bg-orange-500/10 text-white'
                      : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{u.name}</span>
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-orange-400">
                        {u.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{u.title}</p>
                  </div>
                  {isSelected && <CheckCircle2 className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-800 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmLogin}
            className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-orange-500 active:scale-95"
          >
            <ShieldCheck className="h-4 w-4" />
            Switch to {selectedUser.name} ({selectedUser.role})
          </button>
        </div>
      </div>
    </div>
  );
};
