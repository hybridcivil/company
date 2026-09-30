import React, { useState } from 'react';
import { X, Printer, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ProjectFile } from '../../types';
import { useApp } from '../../context/AppContext';

interface FilePrintReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: ProjectFile | null;
  versionLabel: string;
}

export const FilePrintReceiptModal: React.FC<FilePrintReceiptModalProps> = ({
  isOpen,
  onClose,
  file,
  versionLabel,
}) => {
  const { currentCompany, logFilePrint, currentUser } = useApp();
  const [printCount, setPrintCount] = useState(2);
  const [purpose, setPurpose] = useState('Site Execution Blueprint Set & Client Record');
  const [isLogged, setIsLogged] = useState(false);

  if (!isOpen || !file) return null;

  const handlePrint = async () => {
    await logFilePrint(file.id, versionLabel, printCount, purpose);
    setIsLogged(true);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl border border-slate-700 bg-white p-6 text-slate-900 shadow-2xl overflow-y-auto max-h-[92vh] print:p-0 print:border-none print:shadow-none print:w-full">
        {/* Modal Controls */}
        <div className="no-print flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="rounded bg-orange-100 p-1.5 text-orange-700">
              <Printer className="h-4 w-4" />
            </span>
            <span className="text-sm font-bold text-slate-900">Drawing Blueprint Transmittal Slip</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-500 shadow-sm"
            >
              <Printer className="h-4 w-4" />
              Print &amp; Log History
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Input Parameters (no-print) */}
        <div className="no-print mb-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-xs border border-slate-200">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Print Copies</label>
            <input
              type="number"
              min="1"
              max="50"
              value={printCount}
              onChange={(e) => setPrintCount(parseInt(e.target.value) || 1)}
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Issue Purpose</label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5"
            />
          </div>
        </div>

        {/* PRINTABLE TRANSMITTAL SHEET */}
        <div className="print-page border-2 border-slate-900 p-6 rounded-xl text-xs space-y-4">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-3 text-center">
            <h2 className="text-lg font-black uppercase text-slate-950">
              {currentCompany.name}
            </h2>
            <p className="text-[11px] font-bold text-orange-600 uppercase">
              Official Engineering Drawing Transmittal &amp; Release Slip
            </p>
            <p className="text-[10px] text-slate-600 mt-0.5">{currentCompany.address}</p>
          </div>

          <div className="flex items-center justify-between border-b border-slate-300 pb-2">
            <div>
              <p><strong>Drawing Code:</strong> <span className="font-mono">{file.fileCode}</span></p>
              <p><strong>Release Version:</strong> <span className="font-bold text-orange-600">{versionLabel}</span></p>
            </div>
            <div className="text-right">
              <p><strong>Print Date:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>Copies Released:</strong> {printCount} Blueprint Sets</p>
            </div>
          </div>

          <div className="space-y-2 border-b border-slate-300 pb-3">
            <p><strong>Project Name:</strong> {file.projectName}</p>
            <p><strong>Client / Owner:</strong> {file.clientName}</p>
            <p><strong>Drawing Title:</strong> {file.fileName}</p>
            <p><strong>Discipline:</strong> {file.category} Engineering</p>
            <p><strong>Purpose of Issue:</strong> {purpose}</p>
          </div>

          <div className="rounded-lg bg-slate-100 p-3 text-[11px] text-slate-700 space-y-1">
            <p className="font-bold text-slate-900">Engineering Notice:</p>
            <p>
              This drawing is released under the structural authority of Hybrid Civil Engineering &amp; Consultancy. Verify all site dimensions before execution. In case of discrepancy, contact Principal Consultant Engr. Ashraf immediately.
            </p>
          </div>

          {/* Signatures */}
          <div className="mt-8 flex items-end justify-between pt-6 text-[11px]">
            <div className="text-center">
              <p className="font-bold">{currentUser.name}</p>
              <div className="w-36 border-t border-slate-900 pt-1 font-semibold">
                Printed &amp; Released By
              </div>
            </div>

            <div className="text-center">
              <p className="font-bold">{currentCompany.managingDirector}</p>
              <div className="w-40 border-t border-slate-900 pt-1 font-semibold">
                Principal Consultant
              </div>
            </div>

            <div className="text-center">
              <div className="w-36 border-t border-slate-900 pt-1 font-semibold">
                Site Receiver Signature
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
