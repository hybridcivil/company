import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Briefcase,
  AlertCircle,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  FileBox,
  Compass,
  CreditCard,
  Building,
  UserCheck,
  Megaphone,
  Gift,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  BarChart3,
  PieChart,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DashboardView: React.FC = () => {
  const {
    currentCompany,
    dashboardMetrics,
    dateRangeMode,
    setDateRangeMode,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    projects,
    commitments,
    siteVisits,
    files,
    setActiveTab,
    setSelectedProjectId,
  } = useApp();

  const sym = currentCompany.currencySymbol || '৳';

  // Group projects by status for distribution chart
  const statusCounts = projects.reduce((acc, p) => {
    acc[p.currentStage] = (acc[p.currentStage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const overdueList = commitments.filter((c) => c.status === 'Overdue');
  const todayDueList = commitments.filter((c) => c.status === 'Due Today');
  const todayVisits = siteVisits.filter(
    (v) => v.visitDate === new Date().toISOString().slice(0, 10)
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Date Filter Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5 md:flex-row md:items-center md:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">
              Operations Intelligence
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl dark:text-white">
            Executive Engineering Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {currentCompany.name} • Principal Consultant: {currentCompany.managingDirector}
          </p>
        </div>

        {/* Date Filter Controls */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-950">
          {(['today', 'week', 'month', 'custom'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setDateRangeMode(mode)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition ${
                dateRangeMode === mode
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {mode === 'today'
                ? 'Today'
                : mode === 'week'
                ? 'This Week'
                : mode === 'month'
                ? 'This Month'
                : 'Custom'}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date Range Picker if selected */}
      {dateRangeMode === 'custom' && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-orange-200 bg-orange-50/50 p-3 text-xs dark:border-orange-950 dark:bg-orange-950/20">
          <span className="font-semibold text-orange-900 dark:text-orange-200">Custom Range:</span>
          <div className="flex items-center gap-2">
            <label className="text-slate-600 dark:text-slate-400">From:</label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-slate-600 dark:text-slate-400">To:</label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
        </div>
      )}

      {/* CORE FINANCIAL KPIS: 4 High-Impact Hero Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Today's Collection */}
        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-4 shadow-xs dark:border-emerald-950 dark:from-emerald-950/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Today&apos;s Collection
            </span>
            <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {sym} {dashboardMetrics.todayCollection.toLocaleString()}
          </p>
          <div className="mt-1 flex items-center text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <ArrowUpRight className="mr-0.5 h-3.5 w-3.5" />
            <span>Instant Liquid Inflow</span>
          </div>
        </div>

        {/* This Month Income */}
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent p-4 shadow-xs dark:border-blue-950 dark:from-blue-950/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
              This Month Income
            </span>
            <div className="rounded-lg bg-blue-500/20 p-2 text-blue-600 dark:text-blue-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {sym} {dashboardMetrics.thisMonthIncome.toLocaleString()}
          </p>
          <div className="mt-1 flex items-center text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
            <span>Verified Milestone Collections</span>
          </div>
        </div>

        {/* This Month Expense */}
        <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent p-4 shadow-xs dark:border-rose-950 dark:from-rose-950/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
              This Month Expense
            </span>
            <div className="rounded-lg bg-rose-500/20 p-2 text-rose-600 dark:text-rose-400">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {sym} {dashboardMetrics.thisMonthExpense.toLocaleString()}
          </p>
          <div className="mt-1 flex items-center text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
            <span>Rent, Salaries, Ads, Boksis, Operations</span>
          </div>
        </div>

        {/* This Month Profit */}
        <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-500/15 via-orange-500/5 to-transparent p-4 shadow-xs dark:border-orange-950 dark:from-orange-950/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wider">
              This Month Net Profit
            </span>
            <div className="rounded-lg bg-orange-500/20 p-2 text-orange-600 dark:text-orange-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className={`mt-2 text-2xl font-black ${
            dashboardMetrics.thisMonthProfit >= 0 ? 'text-orange-600 dark:text-orange-400' : 'text-rose-600'
          }`}>
            {sym} {dashboardMetrics.thisMonthProfit.toLocaleString()}
          </p>
          <div className="mt-1 flex items-center text-[11px] text-orange-600 dark:text-orange-400 font-semibold">
            <span>Formula: Income - Total Expenses</span>
          </div>
        </div>
      </div>

      {/* SECOND ROW: Project Portfolio & Due Balances */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {/* Total Contract Value */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Total Contracts
          </span>
          <p className="text-lg font-bold text-slate-900 dark:text-white mt-1 truncate">
            {sym} {dashboardMetrics.totalContractValue.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400">All signed scopes</span>
        </div>

        {/* Total Client Due */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            Total Client Due
          </span>
          <p className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-1 truncate">
            {sym} {dashboardMetrics.totalClientDue.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400">Receivable balance</span>
        </div>

        {/* Active Projects */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Active Projects
          </span>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
            {dashboardMetrics.activeProjectsCount}
          </p>
          <span className="text-[10px] text-slate-400">In design/construction</span>
        </div>

        {/* Completed Projects */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Completed
          </span>
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {dashboardMetrics.completedProjectsCount}
          </p>
          <span className="text-[10px] text-slate-400">Handed over</span>
        </div>

        {/* Today's Site Visits */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Today Site Visits
          </span>
          <p className="text-lg font-bold text-orange-600 dark:text-orange-400 mt-1">
            {dashboardMetrics.todaySiteVisitsCount}
          </p>
          <span className="text-[10px] text-slate-400">Field inspections</span>
        </div>

        {/* Pending Corrections */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
            Pending Corrections
          </span>
          <p className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-1">
            {dashboardMetrics.pendingCorrectionsCount}
          </p>
          <span className="text-[10px] text-slate-400">CAD revisions queue</span>
        </div>
      </div>

      {/* THIRD ROW: Specialized Cost Breakdown (Salary Due, Allowance, Ads, Office, Boksis, Overdue) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {/* Upcoming Client Payments */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3 dark:border-blue-950 dark:bg-blue-950/20">
          <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300">
            Upcoming Payments
          </span>
          <p className="text-base font-bold text-slate-900 dark:text-white mt-1 truncate">
            {sym} {dashboardMetrics.upcomingPaymentsAmount.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500">Scheduled milestones</span>
        </div>

        {/* Overdue Client Payments */}
        <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-3 dark:border-rose-950 dark:bg-rose-950/30">
          <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Overdue Payments
          </span>
          <p className="text-base font-bold text-rose-600 dark:text-rose-400 mt-1 truncate">
            {sym} {dashboardMetrics.overduePaymentsAmount.toLocaleString()}
          </p>
          <span className="text-[10px] text-rose-600/80">Requires client follow-up</span>
        </div>

        {/* Employee Salary Due */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Salary Due
          </span>
          <p className="text-base font-bold text-slate-900 dark:text-white mt-1 truncate">
            {sym} {dashboardMetrics.salaryDueAmount.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400">Pending payroll balance</span>
        </div>

        {/* Site Engineer Allowance */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Site Allowance Unpaid
          </span>
          <p className="text-base font-bold text-slate-900 dark:text-white mt-1 truncate">
            {sym} {dashboardMetrics.siteAllowanceAmount.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400">Conveyance & inspection</span>
        </div>

        {/* Advertisement Expense */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Megaphone className="h-3 w-3 text-orange-500" /> Ad Expense
          </span>
          <p className="text-base font-bold text-slate-900 dark:text-white mt-1 truncate">
            {sym} {dashboardMetrics.adExpenseAmount.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400">FB, Google, Prints</span>
        </div>

        {/* Boksis Expense */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Gift className="h-3 w-3 text-amber-500" /> Boksis Account
          </span>
          <p className="text-base font-bold text-slate-900 dark:text-white mt-1 truncate">
            {sym} {dashboardMetrics.boksisExpenseAmount.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400">Field & office gratuity</span>
        </div>
      </div>

      {/* INTERACTIVE CHARTS & VISUALIZATIONS SECTION */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Monthly Financial Trend Visualizer */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-orange-600" />
                Financial Performance Overview
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Income vs Expense vs Net Profit Comparison
              </p>
            </div>
            <button
              onClick={() => setActiveTab('accounts')}
              className="text-xs font-semibold text-orange-600 hover:underline flex items-center gap-1"
            >
              Full Ledger <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* SVG Bar Visualizer */}
          <div className="mt-6 space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-blue-600 dark:text-blue-400">Monthly Income Collection</span>
                <span className="font-bold text-slate-900 dark:text-white">{sym} {dashboardMetrics.thisMonthIncome.toLocaleString()}</span>
              </div>
              <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(10, (dashboardMetrics.thisMonthIncome / Math.max(dashboardMetrics.thisMonthIncome, dashboardMetrics.thisMonthExpense, 1)) * 100))}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-rose-600 dark:text-rose-400">Total Monthly Expenditures</span>
                <span className="font-bold text-slate-900 dark:text-white">{sym} {dashboardMetrics.thisMonthExpense.toLocaleString()}</span>
              </div>
              <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-rose-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(10, (dashboardMetrics.thisMonthExpense / Math.max(dashboardMetrics.thisMonthIncome, dashboardMetrics.thisMonthExpense, 1)) * 100))}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-orange-600 dark:text-orange-400">Net Operational Profit</span>
                <span className="font-bold text-slate-900 dark:text-white">{sym} {dashboardMetrics.thisMonthProfit.toLocaleString()}</span>
              </div>
              <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-orange-600 transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(10, (Math.max(0, dashboardMetrics.thisMonthProfit) / Math.max(dashboardMetrics.thisMonthIncome, 1)) * 100))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <div className="text-center">
              <p className="text-xs text-slate-400">Office Expense</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {sym} {dashboardMetrics.officeExpenseAmount.toLocaleString()}
              </p>
            </div>
            <div className="text-center border-x border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-400">Ads Spending</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {sym} {dashboardMetrics.adExpenseAmount.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-400">Boksis Total</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {sym} {dashboardMetrics.boksisExpenseAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Project Construction Stages Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PieChart className="h-4 w-4 text-orange-600" />
                Active Construction Stages
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Current structural progress
              </p>
            </div>
            <button
              onClick={() => setActiveTab('projects')}
              className="text-xs font-semibold text-orange-600 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="mt-4 space-y-2.5">
            {Object.entries(statusCounts).length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No projects recorded yet</p>
            ) : (
              Object.entries(statusCounts).map(([stage, count]) => (
                <div key={stage} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">{stage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                      {count} {count === 1 ? 'proj' : 'projs'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* FOURTH ROW: Urgent Attention Alerts (Overdue Bills & Today's Site Visits) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Overdue & Due Commitments Alert Card */}
        <div className="rounded-2xl border border-rose-200 bg-rose-50/30 p-5 shadow-xs dark:border-rose-950 dark:bg-rose-950/20">
          <div className="flex items-center justify-between border-b border-rose-200 pb-3 dark:border-rose-900/40">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-rose-600 p-1.5 text-white">
                <AlertCircle className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-rose-950 dark:text-rose-200">
                  Critical Bill Commitments ({overdueList.length + todayDueList.length})
                </h4>
                <p className="text-xs text-rose-700/80 dark:text-rose-400">
                  Action required for cash flow continuity
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('commitments')}
              className="text-xs font-bold text-rose-700 hover:underline dark:text-rose-300"
            >
              Manage
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {overdueList.length === 0 && todayDueList.length === 0 ? (
              <div className="py-6 text-center text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> All client commitments are up to date!
              </div>
            ) : (
              [...todayDueList, ...overdueList].slice(0, 4).map((cmt) => (
                <div
                  key={cmt.id}
                  className="flex items-center justify-between rounded-xl bg-white p-3 shadow-2xs border border-rose-100 dark:bg-slate-900 dark:border-slate-800"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {cmt.clientName}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          cmt.status === 'Overdue'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {cmt.status} ({cmt.commitmentDate})
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {cmt.projectName}: {cmt.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-rose-600 dark:text-rose-400">
                      {sym} {cmt.dueAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Today's Site Inspections */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-orange-600 p-1.5 text-white">
                <Compass className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Today&apos;s Engineering Site Visits ({todayVisits.length})
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  On-site quality checking &amp; reinforcement verification
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('siteVisits')}
              className="text-xs font-bold text-orange-600 hover:underline"
            >
              Visits Log
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {todayVisits.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No site visits logged for today yet.
              </div>
            ) : (
              todayVisits.map((v) => (
                <div
                  key={v.id}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {v.projectName}
                    </span>
                    <span className="rounded bg-orange-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-orange-600 dark:text-orange-400">
                      {v.visitTime}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                    Engineer: <strong className="text-slate-800 dark:text-slate-200">{v.engineerName}</strong> • Stage: {v.currentWorkStage}
                  </p>
                  <p className="text-[11px] text-slate-500 italic mt-0.5 truncate">
                    &ldquo;{v.observation}&rdquo;
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
