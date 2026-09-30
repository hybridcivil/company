import React, { useState } from 'react';
import {
  X,
  FileBox,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  User,
  FileText,
  Upload,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { ProjectFile, FileVersion } from '../../types';
import { useApp } from '../../context/AppContext';

interface FileVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: ProjectFile | null;
  onOpenCorrection: (file: ProjectFile) => void;
  onOpenPrintSlip: (file: ProjectFile, version: string) => void;
}

export const FileVersionModal: React.FC<FileVersionModalProps> = ({
  isOpen,
  onClose,
  file,
  onOpenCorrection,
  onOpenPrintSlip,
}) => {
  const { markFileFinal, logFileDownload } = useApp();
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  if (!isOpen || !file) return null;

  const handleDownload = async (v: FileVersion) => {
    await logFileDownload(file.id, v.versionLabel, 'Engineer CAD inspection and review');
    setDownloadNotice(`Simulated download started for ${v.fileName} [${v.versionLabel}]. Download logged to audit registry.`);
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  const handleSetFinal = async (vNumber: number) => {
    await markFileFinal(file.id, vNumber);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white font-bold">
              <FileBox className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">Drawing Version Timeline</h3>
              <p className="text-xs text-slate-400">
                Project File Detail: {file.fileCode}
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

        {/* File Overview Card (Section 41) */}
        <div className="my-4 rounded-xl border border-slate-800 bg-slate-800/40 p-4 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <span className="rounded bg-orange-500/20 px-2 py-0.5 text-[10px] font-bold text-orange-400">
                {file.category} Drawing
              </span>
              <h4 className="text-base font-bold text-white mt-1">{file.fileName}</h4>
              <p className="text-xs text-slate-400 mt-0.5">Project: {file.projectName}</p>
            </div>
            <div className="text-right">
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-white border border-slate-700">
                Latest: {file.currentVersion}
              </span>
              <p className="text-[10px] text-emerald-400 font-semibold mt-1">Status: {file.status}</p>
            </div>
          </div>

          {/* Quick Action Buttons for latest version */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
            <button
              onClick={() => {
                const latest = file.versions[file.versions.length - 1];
                if (latest) handleDownload(latest);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-500 shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              Download Latest ({file.currentVersion})
            </button>

            <button
              onClick={() => onOpenCorrection(file)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white"
            >
              <Upload className="h-3.5 w-3.5 text-orange-400" />
              Upload Correction
            </button>

            <button
              onClick={() => onOpenPrintSlip(file, file.currentVersion)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white"
            >
              <Printer className="h-3.5 w-3.5" />
              Print Drawing Slip
            </button>
          </div>
        </div>

        {downloadNotice && (
          <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/40 p-3 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{downloadNotice}</span>
          </div>
        )}

        {/* Complete Version History Timeline (Section 11 & 12) */}
        <div className="space-y-3 mt-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Version Audit Registry ({file.versions?.length || 0} Revisions)
          </h4>

          <div className="space-y-3">
            {[...(file.versions || [])].reverse().map((ver, idx) => (
              <div
                key={ver.versionNumber}
                className={`relative rounded-xl border p-4 transition ${
                  ver.isFinal
                    ? 'border-emerald-500/40 bg-emerald-950/20'
                    : idx === 0
                    ? 'border-orange-500/40 bg-orange-950/15'
                    : 'border-slate-800 bg-slate-800/40'
                }`}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-extrabold ${
                        ver.isFinal
                          ? 'bg-emerald-500 text-white'
                          : 'bg-orange-600 text-white'
                      }`}
                    >
                      {ver.versionLabel}
                    </span>
                    <span className="text-xs font-bold text-white">{ver.fileName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({ver.fileSize})</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {!ver.isFinal && (
                      <button
                        onClick={() => handleSetFinal(ver.versionNumber)}
                        className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] font-semibold text-slate-300 hover:text-white"
                        title="Mark this revision as Final Approved"
                      >
                        Set as Final
                      </button>
                    )}
                    <button
                      onClick={() => handleDownload(ver)}
                      className="flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-orange-400 hover:bg-slate-700"
                    >
                      <Download className="h-3 w-3" /> Download
                    </button>
                    <button
                      onClick={() => onOpenPrintSlip(file, ver.versionLabel)}
                      className="rounded-lg p-1.5 text-slate-400 hover:text-white"
                      title="Print this version"
                    >
                      <Printer className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {ver.correctionNote && (
                  <div className="mt-2.5 rounded-lg border border-slate-700/60 bg-slate-900/60 p-2.5 text-xs">
                    <strong className="text-orange-400 text-[11px] block mb-0.5">
                      Correction Note:
                    </strong>
                    <p className="text-slate-300 italic">{ver.correctionNote}</p>
                  </div>
                )}

                {ver.description && (
                  <p className="text-xs text-slate-400 mt-2">{ver.description}</p>
                )}

                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/60 pt-2">
                  <span>Uploaded by: <strong className="text-slate-300">{ver.uploadedBy}</strong></span>
                  <span>{new Date(ver.uploadDate).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
