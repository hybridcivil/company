import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Plus,
  Search,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Gift,
  Megaphone,
  Briefcase,
  Printer,
  Trash2,
  FileText,
  PieChart,
  ArrowRight,
  X,
  Save,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  OfficeExpense,
  OfficeExpenseCategory,
  AdvertisementExpense,
  AdPlatform,
  BoksisRecord,
  Transaction,
} from '../../types';

const EXPENSE_CATEGORIES: OfficeExpenseCategory[] = [
  'Office Rent',
  'Electricity',
  'Internet',
  'Mobile',
  'Printing',
  'Stationery',
  'Computer/Equipment',
  'Tea/Food',
  'Transport',
  'Repair',
  'Maintenance',
  'Advertisement',
  'Boksis',
  'Site Engineer Allowance',
  'Other',
];

const AD_PLATFORMS: AdPlatform[] = ['Facebook', 'Google', 'YouTube', 'Print', 'Banner', 'Other'];

export const AccountingManager: React.FC = () => {
  const {
    expenses,
    advertisements,
    boksis,
    transactions,
    payments,
    salaries,
    allowances,
    contractors,
    projects,
    clients,
    saveExpense,
    deleteExpense,
    saveAdvertisement,
    deleteAdvertisement,
    saveBoksis,
    deleteBoksis,
    currentCompany,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'monthly' | 'search' | 'profit' | 'office' | 'ads' | 'boksis' | 'transactions'
  >('monthly');

  const sym = currentCompany.currencySymbol || '৳';

  // State for Month Selection in Section 29
  const [selectedMonth, setSelectedMonth] = useState<string>(() => new Date().toISOString().slice(0, 7));

  // State for Date-range Search in Section 30
  const [fromDate, setFromDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  });
  const [toDate, setToDate] = useState<string>(() => new Date().toISOString().slice(0, 10));

  // Modals state
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [isBoksisModalOpen, setIsBoksisModalOpen] = useState(false);

  // Forms
  const [expenseForm, setExpenseForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    category: 'Printing' as OfficeExpenseCategory,
    amount: 5000,
    projectId: '',
    paidBy: currentUser.name,
    description: '',
    notes: '',
  });

  const [adForm, setAdForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    platform: 'Facebook' as AdPlatform,
    campaign: 'Building Design & Soil Test Campaign',
    amount: 10000,
    projectId: '',
    paidBy: currentUser.name,
    notes: '',
  });

  const [boksisForm, setBoksisForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    projectId: '',
    recipient: 'Site Gate Guard / Field Labor',
    purpose: 'Night slab casting refreshment boksis',
    amount: 1000,
    paidBy: currentUser.name,
    notes: '',
  });

  // SECTION 29: MONTHLY REPORT CALCULATIONS
  const monthlyData = useMemo(() => {
    const month = selectedMonth;

    // Income
    const clientCollection = payments
      .filter((p) => p.date.startsWith(month))
      .reduce((sum, p) => sum + p.amount, 0);

    const otherIncome = transactions
      .filter((t) => t.date.startsWith(month) && t.type === 'Income' && t.category !== 'Client Collection')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalIncome = clientCollection + otherIncome;

    // Expenses
    const salaryExpense = salaries
      .filter((s) => (s.paymentDate && s.paymentDate.startsWith(month)) || s.month === month)
      .reduce((sum, s) => sum + s.paid, 0);

    const officeExpense = expenses
      .filter((e) => e.date.startsWith(month))
      .reduce((sum, e) => sum + e.amount, 0);

    const adExpense = advertisements
      .filter((a) => a.date.startsWith(month))
      .reduce((sum, a) => sum + a.amount, 0);

    const boksisExpense = boksis
      .filter((b) => b.date.startsWith(month))
      .reduce((sum, b) => sum + b.amount, 0);

    const allowanceExpense = allowances
      .filter((al) => al.status === 'Paid' && (al.date.startsWith(month) || al.month === month))
      .reduce((sum, al) => sum + al.amount, 0);

    const totalExpense = salaryExpense + officeExpense + adExpense + boksisExpense + allowanceExpense;
    const netProfit = totalIncome - totalExpense;

    return {
      totalIncome,
      clientCollection,
      otherIncome,
      totalExpense,
      salaryExpense,
      officeExpense,
      adExpense,
      boksisExpense,
      allowanceExpense,
      netProfit,
    };
  }, [selectedMonth, payments, transactions, salaries, expenses, advertisements, boksis, allowances]);

  // SECTION 30: DATE RANGE SEARCH DATA
  const dateRangeData = useMemo(() => {
    const inRange = (d: string) => d >= fromDate && d <= toDate;

    const rPayments = payments.filter((p) => inRange(p.date));
    const rExpenses = expenses.filter((e) => inRange(e.date));
    const rSalaries = salaries.filter((s) => s.paymentDate && inRange(s.paymentDate));
    const rAds = advertisements.filter((a) => inRange(a.date));
    const rBoksis = boksis.filter((b) => inRange(b.date));
    const rAllowances = allowances.filter((al) => inRange(al.date) && al.status === 'Paid');

    const totalIncome = rPayments.reduce((s, p) => s + p.amount, 0);
    const totalExpenses =
      rExpenses.reduce((s, e) => s + e.amount, 0) +
      rSalaries.reduce((s, sa) => s + sa.paid, 0) +
      rAds.reduce((s, a) => s + a.amount, 0) +
      rBoksis.reduce((s, b) => s + b.amount, 0) +
      rAllowances.reduce((s, al) => s + al.amount, 0);

    const netProfit = totalIncome - totalExpenses;

    return {
      rPayments,
      rExpenses,
      rSalaries,
      rAds,
      rBoksis,
      rAllowances,
      totalIncome,
      totalExpenses,
      netProfit,
    };
  }, [fromDate, toDate, payments, expenses, salaries, advertisements, boksis, allowances]);

  // SECTION 31: PROJECT-WISE PROFIT ANALYSIS (Project Income - Project Expenses = Project Net Profit)
  const projectProfits = useMemo(() => {
    return projects.map((p) => {
      // Income collected for this project
      const projIncome = payments
        .filter((pay) => pay.projectId === p.id)
        .reduce((sum, pay) => sum + pay.amount, 0);

      // Project-specific direct expenses (Expenses tagged to project, project-specific Boksis, and site allowances)
      const directExpenses = expenses
        .filter((e) => e.projectId === p.id)
        .reduce((sum, e) => sum + e.amount, 0);

      const directBoksis = boksis
        .filter((b) => b.projectId === p.id)
        .reduce((sum, b) => sum + b.amount, 0);

      const directAllowances = allowances
        .filter((al) => al.projectId === p.id && al.status === 'Paid')
        .reduce((sum, al) => sum + al.amount, 0);

      const directAds = advertisements
        .filter((a) => a.projectId === p.id)
        .reduce((sum, a) => sum + a.amount, 0);

      const totalProjectExpense = directExpenses + directBoksis + directAllowances + directAds;
      const netProjectProfit = projIncome - totalProjectExpense;

      return {
        project: p,
        income: projIncome,
        expenses: totalProjectExpense,
        profit: netProjectProfit,
        margin: projIncome > 0 ? ((netProjectProfit / projIncome) * 100).toFixed(1) : '0',
      };
    });
  }, [projects, payments, expenses, boksis, allowances, advertisements]);

  // Handlers for Add Modals
  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === expenseForm.projectId);
    const code = `HC-EXP-${String(expenses.length + 1).padStart(3, '0')}`;
    await saveExpense({
      id: `exp-${Date.now()}`,
      companyId: currentCompany.id,
      expenseCode: code,
      date: expenseForm.date,
      category: expenseForm.category,
      amount: Number(expenseForm.amount) || 0,
      projectId: expenseForm.projectId || undefined,
      projectName: proj ? proj.name : undefined,
      paidBy: expenseForm.paidBy.trim(),
      description: expenseForm.description.trim() || `${expenseForm.category} payment`,
      notes: expenseForm.notes.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsExpenseModalOpen(false);
  };

  const handleAdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === adForm.projectId);
    await saveAdvertisement({
      id: `adv-${Date.now()}`,
      companyId: currentCompany.id,
      date: adForm.date,
      platform: adForm.platform,
      campaign: adForm.campaign.trim(),
      amount: Number(adForm.amount) || 0,
      projectId: adForm.projectId || undefined,
      projectName: proj ? proj.name : undefined,
      paidBy: adForm.paidBy.trim(),
      notes: adForm.notes.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsAdModalOpen(false);
  };

  const handleBoksisSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === boksisForm.projectId);
    await saveBoksis({
      id: `bok-${Date.now()}`,
      companyId: currentCompany.id,
      date: boksisForm.date,
      projectId: boksisForm.projectId || undefined,
      projectName: proj ? proj.name : undefined,
      recipient: boksisForm.recipient.trim(),
      purpose: boksisForm.purpose.trim(),
      amount: Number(boksisForm.amount) || 0,
      paidBy: boksisForm.paidBy.trim(),
      notes: boksisForm.notes.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsBoksisModalOpen(false);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl dark:text-white">
              Accounting &amp; Profit Intelligence
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Sections 25–31: Monthly balance sheets, date-range search, project profit, and dedicated Boksis tracking
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-white hover:bg-slate-700"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Office Expense</span>
          </button>
          <button
            onClick={() => setIsAdModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-white hover:bg-slate-700"
          >
            <Megaphone className="h-3.5 w-3.5 text-orange-400" />
            <span>+ Ad Spend</span>
          </button>
          <button
            onClick={() => setIsBoksisModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-orange-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-orange-500 shadow-sm"
          >
            <Gift className="h-3.5 w-3.5" />
            <span>+ Boksis Entry</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200 pb-2 dark:border-slate-800 scrollbar-none gap-1">
        {[
          { id: 'monthly', label: 'Monthly Account (S29)' },
          { id: 'search', label: 'Date-Range Search (S30)' },
          { id: 'profit', label: 'Profit Analysis (S31)' },
          { id: 'office', label: `Office Expenses (${expenses.length})` },
          { id: 'ads', label: `Advertisement (${advertisements.length})` },
          { id: 'boksis', label: `Boksis Account (${boksis.length})` },
          { id: 'transactions', label: `All Transactions (${transactions.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: MONTHLY ACCOUNT (SECTION 29) */}
      {activeTab === 'monthly' && (
        <div className="space-y-5">
          {/* Month Selector Bar */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Monthly Profit &amp; Loss Statement
              </span>
              <p className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                Formula: NET PROFIT = TOTAL INCOME - TOTAL EXPENSE
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500">Select Month:</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Big KPI Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4 shadow-xs dark:border-blue-950 dark:bg-blue-950/20">
              <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">
                Total Month Income
              </span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {sym} {monthlyData.totalIncome.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Client Collection: {sym} {monthlyData.clientCollection.toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-4 shadow-xs dark:border-rose-950 dark:bg-rose-950/20">
              <span className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase">
                Total Month Expense
              </span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {sym} {monthlyData.totalExpense.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Rent, Salary, Ads, Boksis, Allowance
              </p>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-4 shadow-xs dark:border-orange-950 dark:bg-orange-950/30">
              <span className="text-xs font-bold text-orange-700 dark:text-orange-400 uppercase">
                Net Monthly Profit
              </span>
              <p className={`text-2xl font-black mt-1 ${
                monthlyData.netProfit >= 0 ? 'text-orange-600 dark:text-orange-400' : 'text-rose-600'
              }`}>
                {sym} {monthlyData.netProfit.toLocaleString()}
              </p>
              <p className="text-[11px] text-orange-600/80 font-semibold mt-1">
                Net Margin: {monthlyData.totalIncome > 0 ? ((monthlyData.netProfit / monthlyData.totalIncome) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>

          {/* Itemized Breakdown Table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Section 29 Monthly Expense Breakdown: {selectedMonth}
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 text-xs">
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/40">
                <span className="text-slate-400 block text-[10px]">Employee Salaries</span>
                <p className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                  {sym} {monthlyData.salaryExpense.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/40">
                <span className="text-slate-400 block text-[10px]">Office Expenses</span>
                <p className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                  {sym} {monthlyData.officeExpense.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/40">
                <span className="text-slate-400 block text-[10px]">Advertisement</span>
                <p className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                  {sym} {monthlyData.adExpense.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/40">
                <span className="text-slate-400 block text-[10px]">Boksis Total</span>
                <p className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                  {sym} {monthlyData.boksisExpense.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/40">
                <span className="text-slate-400 block text-[10px]">Site Allowances</span>
                <p className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                  {sym} {monthlyData.allowanceExpense.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DATE-RANGE ACCOUNT SEARCH (SECTION 30) */}
      {activeTab === 'search' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="font-bold text-slate-800 dark:text-white">Custom Range Search:</span>
              <div className="flex items-center gap-1.5">
                <label className="text-slate-400">From:</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <label className="text-slate-400">To:</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-500 shadow-sm"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Date Statement</span>
            </button>
          </div>

          {/* Quick Result Totals */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-[10px] uppercase font-semibold text-blue-500">Period Income</span>
              <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {sym} {dateRangeData.totalIncome.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-[10px] uppercase font-semibold text-rose-500">Period Expenses</span>
              <p className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                {sym} {dateRangeData.totalExpenses.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-[10px] uppercase font-semibold text-orange-500">Net Balance</span>
              <p className={`text-lg font-bold mt-0.5 ${
                dateRangeData.netProfit >= 0 ? 'text-orange-600 dark:text-orange-400' : 'text-rose-600'
              }`}>
                {sym} {dateRangeData.netProfit.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Itemized Table of Period Payments */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-x-auto">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 dark:text-slate-200">
              Client Payment Collections in Range ({dateRangeData.rPayments.length})
            </h4>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase dark:bg-slate-800/60 dark:text-slate-400">
                <tr>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Receipt No</th>
                  <th className="px-3 py-2">Client</th>
                  <th className="px-3 py-2">Project</th>
                  <th className="px-3 py-2">Method</th>
                  <th className="px-3 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {dateRangeData.rPayments.map((p) => (
                  <tr key={p.id}>
                    <td className="px-3 py-2 text-slate-500">{p.date}</td>
                    <td className="px-3 py-2 font-mono font-bold text-orange-600">{p.receiptNo}</td>
                    <td className="px-3 py-2 font-semibold text-slate-800 dark:text-slate-200">{p.clientName}</td>
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{p.projectName}</td>
                    <td className="px-3 py-2">{p.paymentMethod}</td>
                    <td className="px-3 py-2 text-right font-bold text-emerald-600">{sym} {p.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PROJECT PROFIT ANALYSIS (SECTION 31) */}
      {activeTab === 'profit' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Section 31 Project-wise Profitability Engine
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Strict Rule: Project Income - Project Specific Expenses = Project Net Profit (Zero Double Counting)
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projectProfits.map((item) => (
              <div
                key={item.project.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700 dark:bg-orange-950 dark:text-orange-400">
                    {item.project.projectCode}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Margin: {item.margin}%
                  </span>
                </div>

                <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                  {item.project.name}
                </h3>
                <p className="text-xs text-slate-500">Client: {item.project.clientName}</p>

                <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Project Income Realized:</span>
                    <strong className="text-emerald-600">{sym} {item.income.toLocaleString()}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Direct Project Expenses:</span>
                    <strong className="text-rose-600">{sym} {item.expenses.toLocaleString()}</strong>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2 dark:border-slate-800">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Project Net Profit:</span>
                    <strong className={`font-black text-sm ${item.profit >= 0 ? 'text-orange-600' : 'text-rose-600'}`}>
                      {sym} {item.profit.toLocaleString()}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: OFFICE EXPENSES (SECTION 25) */}
      {activeTab === 'office' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider dark:bg-slate-800/60 dark:text-slate-400">
              <tr>
                <th className="px-3 py-2.5">Date</th>
                <th className="px-3 py-2.5">Code</th>
                <th className="px-3 py-2.5">Category</th>
                <th className="px-3 py-2.5">Description</th>
                <th className="px-3 py-2.5">Paid By</th>
                <th className="px-3 py-2.5 text-right">Amount</th>
                <th className="px-3 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {expenses.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="px-3 py-2.5 text-slate-500">{e.date}</td>
                  <td className="px-3 py-2.5 font-mono text-orange-600 font-bold">{e.expenseCode}</td>
                  <td className="px-3 py-2.5"><span className="rounded bg-slate-100 px-2 py-0.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">{e.category}</span></td>
                  <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300">{e.description}</td>
                  <td className="px-3 py-2.5">{e.paidBy}</td>
                  <td className="px-3 py-2.5 text-right font-bold text-rose-600">{sym} {e.amount.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-right">
                    <button
                      onClick={() => deleteExpense(e.id)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 5: ADVERTISEMENT EXPENSES (SECTION 26) */}
      {activeTab === 'ads' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {AD_PLATFORMS.slice(0, 4).map((plat) => {
              const spent = advertisements
                .filter((a) => a.platform === plat)
                .reduce((s, a) => s + a.amount, 0);
              return (
                <div key={plat} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">{plat} Ads</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {sym} {spent.toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase dark:bg-slate-800/60 dark:text-slate-400">
                <tr>
                  <th className="px-3 py-2.5">Date</th>
                  <th className="px-3 py-2.5">Platform</th>
                  <th className="px-3 py-2.5">Campaign Name</th>
                  <th className="px-3 py-2.5">Paid By</th>
                  <th className="px-3 py-2.5 text-right">Amount</th>
                  <th className="px-3 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {advertisements.map((a) => (
                  <tr key={a.id}>
                    <td className="px-3 py-2.5 text-slate-500">{a.date}</td>
                    <td className="px-3 py-2.5"><span className="rounded bg-blue-100 px-2 py-0.5 text-blue-700 font-bold dark:bg-blue-950 dark:text-blue-400">{a.platform}</span></td>
                    <td className="px-3 py-2.5 font-medium text-slate-800 dark:text-slate-200">{a.campaign}</td>
                    <td className="px-3 py-2.5">{a.paidBy}</td>
                    <td className="px-3 py-2.5 text-right font-bold text-rose-600">{sym} {a.amount.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right">
                      <button onClick={() => deleteAdvertisement(a.id)} className="p-1 text-slate-400 hover:text-rose-600">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: BOKSIS ACCOUNT (SECTION 27) */}
      {activeTab === 'boksis' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider dark:text-slate-200">
              Section 27 Dedicated Boksis &amp; Gratuity Account
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Transparent tracking of site guard, municipality peon, and logistics tokens
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase dark:bg-slate-800/60 dark:text-slate-400">
                <tr>
                  <th className="px-3 py-2.5">Date</th>
                  <th className="px-3 py-2.5">Recipient</th>
                  <th className="px-3 py-2.5">Purpose / Cause</th>
                  <th className="px-3 py-2.5">Project</th>
                  <th className="px-3 py-2.5">Paid By</th>
                  <th className="px-3 py-2.5 text-right">Amount</th>
                  <th className="px-3 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {boksis.map((b) => (
                  <tr key={b.id}>
                    <td className="px-3 py-2.5 text-slate-500">{b.date}</td>
                    <td className="px-3 py-2.5 font-bold text-slate-900 dark:text-white">{b.recipient}</td>
                    <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300">{b.purpose}</td>
                    <td className="px-3 py-2.5 text-slate-500">{b.projectName || 'General Office'}</td>
                    <td className="px-3 py-2.5">{b.paidBy}</td>
                    <td className="px-3 py-2.5 text-right font-bold text-amber-600">{sym} {b.amount.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right">
                      <button onClick={() => deleteBoksis(b.id)} className="p-1 text-slate-400 hover:text-rose-600">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: ALL TRANSACTIONS LEDGER (SECTION 28) */}
      {activeTab === 'transactions' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase dark:bg-slate-800/60 dark:text-slate-400">
              <tr>
                <th className="px-3 py-2.5">Date</th>
                <th className="px-3 py-2.5">Type</th>
                <th className="px-3 py-2.5">Category</th>
                <th className="px-3 py-2.5">Description</th>
                <th className="px-3 py-2.5">Party / Person</th>
                <th className="px-3 py-2.5">Ref</th>
                <th className="px-3 py-2.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td className="px-3 py-2.5 text-slate-500">{t.date}</td>
                  <td className="px-3 py-2.5">
                    <span className={`font-bold ${t.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-medium">{t.category}</td>
                  <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300">{t.description}</td>
                  <td className="px-3 py-2.5">{t.person}</td>
                  <td className="px-3 py-2.5 font-mono text-slate-400">{t.reference || '-'}</td>
                  <td className={`px-3 py-2.5 text-right font-bold ${t.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {sym} {t.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Office Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold">Record Office Expense (Section 25)</h3>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleExpenseSubmit} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Expense Category</label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value as OfficeExpenseCategory })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                  >
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Amount (৳)</label>
                  <input
                    type="number"
                    value={expenseForm.amount || ''}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Date</label>
                  <input
                    type="date"
                    value={expenseForm.date}
                    onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Paid By</label>
                  <input
                    type="text"
                    value={expenseForm.paidBy}
                    onChange={(e) => setExpenseForm({ ...expenseForm, paidBy: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Linked Project (Optional)</label>
                <select
                  value={expenseForm.projectId}
                  onChange={(e) => setExpenseForm({ ...expenseForm, projectId: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                >
                  <option value="">General Office / Overhead</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Description</label>
                <input
                  type="text"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  placeholder="e.g. Office tea and stationery supplies"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-800 pt-4">
                <button type="button" onClick={() => setIsExpenseModalOpen(false)} className="px-4 py-2 text-xs text-slate-400">Cancel</button>
                <button type="submit" className="rounded-lg bg-orange-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-orange-500">Save Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ad Expense Modal */}
      {isAdModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold">Record Advertisement Spend (Section 26)</h3>
              <button onClick={() => setIsAdModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAdSubmit} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Platform</label>
                  <select
                    value={adForm.platform}
                    onChange={(e) => setAdForm({ ...adForm, platform: e.target.value as AdPlatform })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                  >
                    {AD_PLATFORMS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Spend Amount (৳)</label>
                  <input
                    type="number"
                    value={adForm.amount || ''}
                    onChange={(e) => setAdForm({ ...adForm, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Campaign Title</label>
                <input
                  type="text"
                  value={adForm.campaign}
                  onChange={(e) => setAdForm({ ...adForm, campaign: e.target.value })}
                  placeholder="e.g. Facebook Dhanmondi Landowners Campaign"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-800 pt-4">
                <button type="button" onClick={() => setIsAdModalOpen(false)} className="px-4 py-2 text-xs text-slate-400">Cancel</button>
                <button type="submit" className="rounded-lg bg-orange-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-orange-500">Save Ad Spend</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Boksis Modal */}
      {isBoksisModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold">Record Boksis Gratuity (Section 27)</h3>
              <button onClick={() => setIsBoksisModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleBoksisSubmit} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Recipient</label>
                  <input
                    type="text"
                    value={boksisForm.recipient}
                    onChange={(e) => setBoksisForm({ ...boksisForm, recipient: e.target.value })}
                    placeholder="Site Guard / Municipality Peon"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Boksis Amount (৳)</label>
                  <input
                    type="number"
                    value={boksisForm.amount || ''}
                    onChange={(e) => setBoksisForm({ ...boksisForm, amount: parseFloat(e.target.value) || 0 })}
                    placeholder="1000"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Purpose</label>
                <input
                  type="text"
                  value={boksisForm.purpose}
                  onChange={(e) => setBoksisForm({ ...boksisForm, purpose: e.target.value })}
                  placeholder="Night slab casting hospitality"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Project (Optional)</label>
                <select
                  value={boksisForm.projectId}
                  onChange={(e) => setBoksisForm({ ...boksisForm, projectId: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                >
                  <option value="">General Office / Municipality</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-800 pt-4">
                <button type="button" onClick={() => setIsBoksisModalOpen(false)} className="px-4 py-2 text-xs text-slate-400">Cancel</button>
                <button type="submit" className="rounded-lg bg-orange-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-orange-500">Save Boksis</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
