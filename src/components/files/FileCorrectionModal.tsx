import React, { useState } from 'react';
import { X, FileUp, Save, History, AlertCircle } from 'lucide-react';
import { ProjectFile } from '../../types';
import { useApp } from '../../context/AppContext';

interface FileCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: ProjectFile | null;
}

export const FileCorrectionModal: React.FC<FileCorrectionModalProps> = ({
  isOpen,
  onClose,
  file,
}) => {
  const { addFileVersion, currentUser } = useApp();

  const [correctionNote, setCorrectionNote] = useState('');
  const [description, setDescription] = useState('');
  const [correctedFileName, setCorrectedFileName] = useState('');
  const [fileSize, setFileSize] = useState('5.4 MB');
  const [isFinal, setIsFinal] = useState(false);

  if (!isOpen || !file) return null;

  const nextVerNum = (file.versions?.length || 0) + 1;
  const nextVerLabel = `V0${nextVerNum}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionNote.trim()) return;

    await addFileVersion(file.id, {
      versionLabel: `${nextVerLabel} ${isFinal ? 'Final Approved' : 'Correction'}`,
      uploadDate: new Date().toISOString(),
      uploadedBy: currentUser.name,
      fileUrl: `/drawings/corrected-${nextVerLabel.toLowerCase()}.dwg`,
      fileName: correctedFileName.trim() || `${file.fileName.replace(/\.[^/.]+$/, '')}_${nextVerLabel}.dwg`,
      fileSize: fileSize.trim() || '5.2 MB',
      description: description.trim() || `Applied design corrections: ${correctionNote}`,
      correctionNote: correctionNote.trim(),
      isFinal,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl overflow-y-auto max-h-[92vh]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white font-bold">
              <FileUp className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">Upload Drawing Correction</h3>
              <p className="text-xs text-slate-400">Step 4 &amp; 5: Auto version incrementing workflow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Existing File Info */}
        <div className="my-4 rounded-xl border border-slate-800 bg-slate-800/40 p-3.5 space-y-1 text-xs">
          <p className="text-slate-400">Current Active File:</p>
          <p className="text-sm font-bold text-white">{file.fileName}</p>
          <div className="flex items-center gap-2 pt-1 text-[11px]">
            <span className="text-slate-400">Current: <strong className="text-orange-400">{file.currentVersion}</strong></span>
            <span className="text-slate-400">Next Generated Version: <strong className="text-emerald-400">{nextVerLabel}</strong></span>
            <span className="text-slate-400">• {file.category}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Corrected File Name
            </label>
            <input
              type="text"
              value={correctedFileName}
              onChange={(e) => setCorrectedFileName(e.target.value)}
              placeholder={`${file.fileName.replace(/\.[^/.]+$/, '')}_${nextVerLabel}.dwg`}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Correction Note (Required for Audit Trail) <span className="text-orange-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={correctionNote}
              onChange={(e) => setCorrectionNote(e.target.value)}
              placeholder="Detail what was revised (e.g. Adjusted pile spacing at grid E, re-sized column C2 from 450x450 to 500x500 as per consultant vetting)..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Revision Scope Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Revised based on site boundary survey"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                File Size
              </label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                placeholder="5.4 MB"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                <input
                  type="checkbox"
                  checked={isFinal}
                  onChange={(e) => setIsFinal(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-orange-500 focus:ring-0 h-4 w-4"
                />
                <span>Mark as Final Approved Set</span>
              </label>
            </div>
          </div>

          {/* Architecture Guarantee Reminder */}
          <div className="rounded-xl border border-blue-900/40 bg-blue-950/20 p-3 text-[11px] text-blue-300 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-blue-400 mt-0.5" />
            <span>
              <strong>Zero Data Loss Protocol:</strong> Previous versions ({file.versions?.map((v) => v.versionLabel).join(', ')}) will remain permanently immutable in the archive.
            </span>
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
              Commit Version {nextVerLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
