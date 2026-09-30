import React, { useState } from 'react';
import {
  FileCheck2,
  Printer,
  Download,
  Users,
  FolderKanban,
  CreditCard,
  AlertCircle,
  Calculator,
  Compass,
  Briefcase,
  Layers,
  FileBox,
  HardHat,
  FileText,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportsManager: React.FC = () => {
  const {
    currentCompany,
    clients,
    projects,
    payments,
    expenses,
    salaries,
    siteVisits,
    contractors,
    soilTests,
    files,
    prints,
  } = useApp();

  const [activeReport, setActiveReport] = useState<string>('client-due');
  const sym = currentCompany.currencySymbol || '৳';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="no-print flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl dark:text-white">
              Official Engineering Reports &amp; Statements Hub
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Section 33: Print-ready certified statements with Hybrid Civil executive letterhead
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-orange-500 active:scale-95"
        >
          <Printer className="h-4 w-4" />
          <span>Print Current Statement</span>
        </button>
      </div>

      {/* Report Switcher Carousel (no-print) */}
      <div className="no-print flex overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xs dark:border-slate-800 dark:bg-slate-900 scrollbar-none gap-1.5">
        {[
          { id: 'client-due', label: 'Due Statement', icon: AlertCircle },
          { id: 'project-dossier', label: 'Project Portfolio', icon: FolderKanban },
          { id: 'payment-statement', label: 'Payment Ledger', icon: CreditCard },
          { id: 'client-directory', label: 'Client Directory', icon: Users },
          { id: 'salary-sheet', label: 'Salary Sheet', icon: HardHat },
          { id: 'site-visits', label: 'Site Inspection Log', icon: Compass },
          { id: 'contractor-statement', label: 'Contractor Ledger', icon: Briefcase },
          { id: 'soil-registry', label: 'Soil Investigation', icon: Layers },
          { id: 'drawing-prints', label: 'Drawing Transmittals', icon: FileBox },
        ].map((rep) => {
          const Icon = rep.icon;
          const isActive = activeReport === rep.id;
          return (
            <button
              key={rep.id}
              onClick={() => setActiveReport(rep.id)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold whitespace-nowrap transition ${
                isActive
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{rep.label}</span>
            </button>
          );
        })}
      </div>

      {/* PRINTABLE REPORT CONTAINER */}
      <div className="print-page rounded-2xl border-2 border-slate-900 bg-white p-6 sm:p-8 text-slate-900 shadow-md">
        {/* Official Header */}
        <div className="border-b-2 border-slate-900 pb-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 font-black text-white text-base">
              HC
            </div>
            <h1 className="text-2xl font-black uppercase text-slate-950">
              {currentCompany.name}
            </h1>
          </div>
          <p className="text-xs font-bold text-orange-600 uppercase tracking-widest">
            {currentCompany.slogan}
          </p>
          <p className="text-[11px] text-slate-600 mt-0.5">{currentCompany.address}</p>
          <p className="text-[10px] text-slate-500">
            Managing Director: {currentCompany.managingDirector} ({currentCompany.managingDirectorQualifications}) • Phone: {currentCompany.phone}
          </p>
        </div>

        {/* Statement Title Bar */}
        <div className="my-4 flex items-center justify-between border-b border-slate-300 pb-2">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-950">
              {activeReport === 'client-due' && 'Official Client Outstanding Due Statement'}
              {activeReport === 'project-dossier' && 'Comprehensive Project Portfolio & Stage Statement'}
              {activeReport === 'payment-statement' && 'Chronological Money Receipt & Payment Ledger'}
              {activeReport === 'client-directory' && 'Client & Landowner Master Register'}
              {activeReport === 'salary-sheet' && 'Consulting Engineering Personnel Salary Sheet'}
              {activeReport === 'site-visits' && 'Field Site Inspection & Quality Audit Log'}
              {activeReport === 'contractor-statement' && 'Construction Trade Contractor Account Summary'}
              {activeReport === 'soil-registry' && 'Geotechnical Soil Investigation Register'}
              {activeReport === 'drawing-prints' && 'Drawing Blueprint Print & Transmittal Record'}
            </h2>
            <p className="text-[10px] text-slate-500">Generated on {new Date().toLocaleString()}</p>
          </div>
          <div className="text-right text-[10px]">
            <p><strong>Currency:</strong> Bangladeshi Taka ({sym})</p>
            <p><strong>System Auth:</strong> Verified</p>
          </div>
        </div>

        {/* 1. DUE STATEMENT */}
        {activeReport === 'client-due' && (
          <div className="space-y-4">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 font-bold uppercase text-[10px]">
                <tr className="border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300">Project Code</th>
                  <th className="p-2 border-r border-slate-300">Project Name</th>
                  <th className="p-2 border-r border-slate-300">Client Name</th>
                  <th className="p-2 border-r border-slate-300">Contract (৳)</th>
                  <th className="p-2 border-r border-slate-300">Paid (৳)</th>
                  <th className="p-2 text-right">Due Balance (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {projects.map((p) => (
                  <tr key={p.id}>
                    <td className="p-2 border-r border-slate-300 font-mono font-bold text-orange-600">{p.projectCode}</td>
                    <td className="p-2 border-r border-slate-300 font-bold">{p.name}</td>
                    <td className="p-2 border-r border-slate-300">{p.clientName}</td>
                    <td className="p-2 border-r border-slate-300">{p.contractAmount.toLocaleString()}</td>
                    <td className="p-2 border-r border-slate-300 text-emerald-600 font-semibold">{p.paidAmount.toLocaleString()}</td>
                    <td className="p-2 text-right font-black text-rose-600">{p.dueAmount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-900">
                <tr>
                  <td colSpan={3} className="p-2 text-right uppercase">Total Portfolio Summary:</td>
                  <td className="p-2">{projects.reduce((s, p) => s + p.contractAmount, 0).toLocaleString()}</td>
                  <td className="p-2 text-emerald-700">{projects.reduce((s, p) => s + p.paidAmount, 0).toLocaleString()}</td>
                  <td className="p-2 text-right text-rose-700">{projects.reduce((s, p) => s + p.dueAmount, 0).toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* 2. PROJECT DOSSIER */}
        {activeReport === 'project-dossier' && (
          <div className="space-y-3">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 font-bold uppercase text-[10px]">
                <tr className="border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300">Code</th>
                  <th className="p-2 border-r border-slate-300">Project Title</th>
                  <th className="p-2 border-r border-slate-300">Storeys</th>
                  <th className="p-2 border-r border-slate-300">Foundation</th>
                  <th className="p-2 border-r border-slate-300">Area (SFT)</th>
                  <th className="p-2 border-r border-slate-300">Stage</th>
                  <th className="p-2 text-right">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {projects.map((p) => (
                  <tr key={p.id}>
                    <td className="p-2 border-r border-slate-300 font-mono font-bold text-orange-600">{p.projectCode}</td>
                    <td className="p-2 border-r border-slate-300 font-bold">{p.name}</td>
                    <td className="p-2 border-r border-slate-300">{p.storeys} Storey</td>
                    <td className="p-2 border-r border-slate-300">{p.foundationType}</td>
                    <td className="p-2 border-r border-slate-300">{p.areaSft.toLocaleString()}</td>
                    <td className="p-2 border-r border-slate-300 font-semibold">{p.currentStage}</td>
                    <td className="p-2 text-right font-bold">{p.progressPercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. PAYMENT STATEMENT */}
        {activeReport === 'payment-statement' && (
          <div className="space-y-3">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 font-bold uppercase text-[10px]">
                <tr className="border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300">Date</th>
                  <th className="p-2 border-r border-slate-300">Receipt No</th>
                  <th className="p-2 border-r border-slate-300">Client</th>
                  <th className="p-2 border-r border-slate-300">Project</th>
                  <th className="p-2 border-r border-slate-300">Method</th>
                  <th className="p-2 text-right">Amount (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="p-2 border-r border-slate-300">{p.date}</td>
                    <td className="p-2 border-r border-slate-300 font-mono font-bold text-orange-600">{p.receiptNo}</td>
                    <td className="p-2 border-r border-slate-300 font-semibold">{p.clientName}</td>
                    <td className="p-2 border-r border-slate-300">{p.projectName}</td>
                    <td className="p-2 border-r border-slate-300">{p.paymentMethod}</td>
                    <td className="p-2 text-right font-bold text-emerald-600">{p.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-900">
                <tr>
                  <td colSpan={5} className="p-2 text-right uppercase">Total Collections:</td>
                  <td className="p-2 text-right font-black text-emerald-700">
                    {payments.reduce((s, p) => s + p.amount, 0).toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* 4. CLIENT DIRECTORY */}
        {activeReport === 'client-directory' && (
          <div className="space-y-3">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 font-bold uppercase text-[10px]">
                <tr className="border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300">Code</th>
                  <th className="p-2 border-r border-slate-300">Client Name</th>
                  <th className="p-2 border-r border-slate-300">Mobile Phone</th>
                  <th className="p-2 border-r border-slate-300">Address</th>
                  <th className="p-2">NID / Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {clients.map((c) => (
                  <tr key={c.id}>
                    <td className="p-2 border-r border-slate-300 font-mono font-bold text-orange-600">{c.clientCode}</td>
                    <td className="p-2 border-r border-slate-300 font-bold">{c.name}</td>
                    <td className="p-2 border-r border-slate-300">{c.mobile}</td>
                    <td className="p-2 border-r border-slate-300">{c.address}</td>
                    <td className="p-2">{c.nid || c.referenceInfo || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. SALARY SHEET */}
        {activeReport === 'salary-sheet' && (
          <div className="space-y-3">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 font-bold uppercase text-[10px]">
                <tr className="border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300">Month</th>
                  <th className="p-2 border-r border-slate-300">Staff Member</th>
                  <th className="p-2 border-r border-slate-300">Basic (৳)</th>
                  <th className="p-2 border-r border-slate-300">Bonus (৳)</th>
                  <th className="p-2 border-r border-slate-300">Disbursed (৳)</th>
                  <th className="p-2 text-right">Due (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {salaries.map((s) => (
                  <tr key={s.id}>
                    <td className="p-2 border-r border-slate-300 font-bold text-orange-600">{s.month}</td>
                    <td className="p-2 border-r border-slate-300 font-semibold">{s.employeeName}</td>
                    <td className="p-2 border-r border-slate-300">{s.basicSalary.toLocaleString()}</td>
                    <td className="p-2 border-r border-slate-300">{s.bonus ? s.bonus.toLocaleString() : '-'}</td>
                    <td className="p-2 border-r border-slate-300 font-bold text-emerald-600">{s.paid.toLocaleString()}</td>
                    <td className="p-2 text-right font-bold text-rose-600">{s.due.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 6. SITE VISITS */}
        {activeReport === 'site-visits' && (
          <div className="space-y-3">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 font-bold uppercase text-[10px]">
                <tr className="border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300">Date</th>
                  <th className="p-2 border-r border-slate-300">Project</th>
                  <th className="p-2 border-r border-slate-300">Engineer</th>
                  <th className="p-2 border-r border-slate-300">Work Stage</th>
                  <th className="p-2">Observation Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {siteVisits.map((v) => (
                  <tr key={v.id}>
                    <td className="p-2 border-r border-slate-300">{v.visitDate}</td>
                    <td className="p-2 border-r border-slate-300 font-bold">{v.projectName}</td>
                    <td className="p-2 border-r border-slate-300 font-semibold">{v.engineerName}</td>
                    <td className="p-2 border-r border-slate-300">{v.currentWorkStage}</td>
                    <td className="p-2 italic text-slate-700">{v.observation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 7. CONTRACTOR STATEMENT */}
        {activeReport === 'contractor-statement' && (
          <div className="space-y-3">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 font-bold uppercase text-[10px]">
                <tr className="border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300">Contractor Name</th>
                  <th className="p-2 border-r border-slate-300">Company</th>
                  <th className="p-2 border-r border-slate-300">Trade</th>
                  <th className="p-2 border-r border-slate-300">Contract (৳)</th>
                  <th className="p-2 border-r border-slate-300">Paid (৳)</th>
                  <th className="p-2 text-right">Due (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {contractors.map((c) => (
                  <tr key={c.id}>
                    <td className="p-2 border-r border-slate-300 font-bold">{c.name}</td>
                    <td className="p-2 border-r border-slate-300">{c.companyName}</td>
                    <td className="p-2 border-r border-slate-300 font-semibold text-orange-600">{c.trade}</td>
                    <td className="p-2 border-r border-slate-300">{c.contractAmount.toLocaleString()}</td>
                    <td className="p-2 border-r border-slate-300 text-emerald-600">{c.paid.toLocaleString()}</td>
                    <td className="p-2 text-right font-bold text-rose-600">{c.due.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 8. SOIL REGISTRY */}
        {activeReport === 'soil-registry' && (
          <div className="space-y-3">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 font-bold uppercase text-[10px]">
                <tr className="border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300">Test Code</th>
                  <th className="p-2 border-r border-slate-300">Project</th>
                  <th className="p-2 border-r border-slate-300">Borehole</th>
                  <th className="p-2 border-r border-slate-300">Depth</th>
                  <th className="p-2">Engineer Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {soilTests.map((s) => (
                  <tr key={s.id}>
                    <td className="p-2 border-r border-slate-300 font-mono font-bold text-orange-600">{s.testCode}</td>
                    <td className="p-2 border-r border-slate-300 font-bold">{s.projectName}</td>
                    <td className="p-2 border-r border-slate-300">{s.boreholeId}</td>
                    <td className="p-2 border-r border-slate-300">{s.totalDepthFeet} ft</td>
                    <td className="p-2 font-semibold text-slate-800">{s.recommendation.recommendedFoundation} at {s.recommendation.recommendedFoundingDepthFeet} ft</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 9. DRAWING PRINTS */}
        {activeReport === 'drawing-prints' && (
          <div className="space-y-3">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 font-bold uppercase text-[10px]">
                <tr className="border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300">Date</th>
                  <th className="p-2 border-r border-slate-300">Drawing File</th>
                  <th className="p-2 border-r border-slate-300">Version</th>
                  <th className="p-2 border-r border-slate-300">Printed By</th>
                  <th className="p-2 border-r border-slate-300">Copies</th>
                  <th className="p-2">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {prints.map((pr) => (
                  <tr key={pr.id}>
                    <td className="p-2 border-r border-slate-300">{new Date(pr.printedAt).toLocaleDateString()}</td>
                    <td className="p-2 border-r border-slate-300 font-bold">{pr.fileName}</td>
                    <td className="p-2 border-r border-slate-300 font-bold text-orange-600">{pr.version}</td>
                    <td className="p-2 border-r border-slate-300">{pr.printedBy}</td>
                    <td className="p-2 border-r border-slate-300 font-bold">{pr.printCount}</td>
                    <td className="p-2 text-slate-600">{pr.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Signature Area on Print */}
        <div className="mt-14 grid grid-cols-3 gap-6 pt-6 text-[11px] text-center border-t border-slate-300">
          <div>
            <div className="border-t border-slate-900 pt-1 font-semibold">
              Prepared by Billing Officer
            </div>
          </div>
          <div>
            <div className="border-t border-slate-900 pt-1 font-semibold">
              Senior Structural Engineer
            </div>
          </div>
          <div>
            <p className="font-bold text-slate-950">{currentCompany.managingDirector}</p>
            <div className="border-t border-slate-900 pt-1 font-bold text-slate-950">
              Managing Director
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
