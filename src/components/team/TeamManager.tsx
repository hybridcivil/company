import React, { useState } from 'react';
import {
  HardHat,
  Plus,
  Search,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  UserCheck,
  Edit,
  Trash2,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Employee, EmployeeSalary } from '../../types';
import { EmployeeModal } from './EmployeeModal';
import { SalaryModal } from './SalaryModal';

export const TeamManager: React.FC = () => {
  const {
    employees,
    salaries,
    projects,
    deleteEmployee,
    deleteSalary,
    currentCompany,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'team' | 'salaries'>('team');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  // Modals state
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);

  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
  const [salaryToEdit, setSalaryToEdit] = useState<EmployeeSalary | null>(null);

  const sym = currentCompany.currencySymbol || '৳';

  const distinctMonths = Array.from(new Set(salaries.map((s) => s.month).filter(Boolean)));

  const filteredEmployees = employees.filter((e) => {
    if (selectedRole !== 'all' && e.role !== selectedRole) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        e.name.toLowerCase().includes(q) ||
        e.position.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.mobile.includes(q)
      );
    }
    return true;
  });

  const filteredSalaries = salaries.filter((s) => {
    if (selectedMonth !== 'all' && s.month !== selectedMonth) return false;
    return true;
  });

  const totalPayrollPaid = filteredSalaries.reduce((sum, s) => sum + s.paid, 0);
  const totalPayrollDue = filteredSalaries.reduce((sum, s) => sum + s.due, 0);

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <HardHat className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl dark:text-white">
              Consulting Engineers &amp; Payroll Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Sections 17 &amp; 24: Engineering personnel records, project assignments, and monthly salary disbursement
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'team' ? (
            <button
              onClick={() => {
                setEmployeeToEdit(null);
                setIsEmployeeModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-orange-500 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Add Team Member</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setSalaryToEdit(null);
                setIsSalaryModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-orange-500 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Disburse Salary</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('team')}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
            activeTab === 'team'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Staff &amp; Engineers ({employees.length})
        </button>
        <button
          onClick={() => setActiveTab('salaries')}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
            activeTab === 'salaries'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <DollarSign className="h-3.5 w-3.5" />
          Monthly Salary Sheet ({salaries.length})
        </button>
      </div>

      {/* SUBTAB 1: TEAM MEMBERS GRID */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs md:flex-row md:items-center md:justify-between dark:border-slate-800 dark:bg-slate-900">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff by name, title, role, or phone..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="all">All Roles</option>
              <option value="Managing Director">Managing Director</option>
              <option value="Structural Engineer">Structural Engineer</option>
              <option value="Architect">Architect</option>
              <option value="Site Engineer">Site Engineer</option>
              <option value="Draft Engineer">Draft Engineer</option>
              <option value="Accountant">Accountant</option>
              <option value="Staff">Office Staff</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEmployees.map((emp) => {
              const assignedCount = projects.filter((p) => {
                const eng = p.assignedEngineers;
                return (
                  eng?.managingDirector === emp.name ||
                  eng?.structuralEngineer === emp.name ||
                  eng?.architect === emp.name ||
                  eng?.draftEngineer === emp.name ||
                  eng?.siteEngineer === emp.name
                );
              }).length;

              return (
                <div
                  key={emp.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700 dark:bg-orange-950 dark:text-orange-400">
                        {emp.role}
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        {emp.status}
                      </span>
                    </div>

                    <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                      {emp.name}
                    </h3>
                    <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                      {emp.position}
                    </p>

                    <div className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                      <p className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        <span>{emp.mobile}</span>
                      </p>
                      {emp.email && (
                        <p className="flex items-center gap-2 truncate">
                          <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{emp.email}</span>
                        </p>
                      )}
                      <p className="flex items-center gap-2">
                        <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                        <span>Assigned Projects: <strong>{assignedCount}</strong></span>
                      </p>
                    </div>

                    {emp.notes && (
                      <p className="mt-2 text-[11px] text-slate-500 italic line-clamp-2">
                        {emp.notes}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400">Monthly Salary</span>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {sym} {emp.salary.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEmployeeToEdit(emp);
                          setIsEmployeeModalOpen(true);
                        }}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Edit Profile"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => deleteEmployee(emp.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600"
                        title="Delete Profile"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 2: SALARIES & PAYROLL */}
      {activeTab === 'salaries' && (
        <div className="space-y-4">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Total Disbursed</span>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {sym} {totalPayrollPaid.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-[10px] uppercase font-semibold text-rose-500">Total Salary Due</span>
              <p className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                {sym} {totalPayrollDue.toLocaleString()}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1 flex items-center justify-end">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                <option value="all">All Payroll Months</option>
                {distinctMonths.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Salaries Table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider dark:bg-slate-800/60 dark:text-slate-400">
                <tr>
                  <th className="px-3 py-2.5">Month</th>
                  <th className="px-3 py-2.5">Staff Name</th>
                  <th className="px-3 py-2.5">Basic</th>
                  <th className="px-3 py-2.5">Bonus</th>
                  <th className="px-3 py-2.5">Advance</th>
                  <th className="px-3 py-2.5">Paid</th>
                  <th className="px-3 py-2.5">Due</th>
                  <th className="px-3 py-2.5">Date</th>
                  <th className="px-3 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredSalaries.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-6 text-center text-slate-400">No salary records for selected period.</td>
                  </tr>
                ) : (
                  filteredSalaries.map((sal) => (
                    <tr key={sal.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="px-3 py-2.5 font-bold text-orange-600">{sal.month}</td>
                      <td className="px-3 py-2.5 font-bold text-slate-900 dark:text-white">{sal.employeeName}</td>
                      <td className="px-3 py-2.5">{sym} {sal.basicSalary.toLocaleString()}</td>
                      <td className="px-3 py-2.5">{sal.bonus ? `${sym} ${sal.bonus.toLocaleString()}` : '-'}</td>
                      <td className="px-3 py-2.5">{sal.advance ? `${sym} ${sal.advance.toLocaleString()}` : '-'}</td>
                      <td className="px-3 py-2.5 font-bold text-emerald-600">{sym} {sal.paid.toLocaleString()}</td>
                      <td className="px-3 py-2.5 font-bold text-rose-600">{sym} {sal.due.toLocaleString()}</td>
                      <td className="px-3 py-2.5 text-slate-500">{sal.paymentDate || 'Pending'}</td>
                      <td className="px-3 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setSalaryToEdit(sal);
                              setIsSalaryModalOpen(true);
                            }}
                            className="p-1 text-slate-400 hover:text-slate-800"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deleteSalary(sal.id)}
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
      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => {
          setIsEmployeeModalOpen(false);
          setEmployeeToEdit(null);
        }}
        employeeToEdit={employeeToEdit}
      />

      <SalaryModal
        isOpen={isSalaryModalOpen}
        onClose={() => {
          setIsSalaryModalOpen(false);
          setSalaryToEdit(null);
        }}
        salaryToEdit={salaryToEdit}
      />
    </div>
  );
};
