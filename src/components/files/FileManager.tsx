import React, { useState, useMemo } from 'react';
import {
  FileBox,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  History,
  CheckCircle2,
  AlertCircle,
  FileUp,
  Layers,
  Clock,
  Trash2,
  Eye,
  X,
  Save,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProjectFile, FileCategory, FileVersion } from '../../types';
import { FileVersionModal } from './FileVersionModal';
import { FileCorrectionModal } from './FileCorrectionModal';
import { FilePrintReceiptModal } from './FilePrintReceiptModal';

const CATEGORIES: FileCategory[] = [
  'Architectural',
  'Structural',
  'Electrical',
  'Plumbing',
  'Soil Report',
  'BOQ',
  'Estimate',
  'Municipality Approval',
  '3D',
  'Site Photo',
  'Other',
];

export const FileManager: React.FC = () => {
  const {
    files,
    downloads,
    prints,
    projects,
    clients,
    saveFile,
    deleteFile,
    currentUser,
    currentCompany,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'files' | 'downloads' | 'prints'>('files');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [versionModalFile, setVersionModalFile] = useState<ProjectFile | null>(null);
  const [correctionModalFile, setCorrectionModalFile] = useState<ProjectFile | null>(null);
  const [printSlipState, setPrintSlipState] = useState<{ open: boolean; file: ProjectFile | null; version: string }>({
    open: false,
    file: null,
    version: '',
  });

  // Upload original file form state
  const [newFileData, setNewFileData] = useState({
    projectId: projects[0]?.id || '',
    category: 'Structural' as FileCategory,
    fileName: '',
    description: '',
    fileSize: '4.5 MB',
  });

  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      if (selectedCategory !== 'all' && f.category !== selectedCategory) return false;
      if (selectedProjectId !== 'all' && f.projectId !== selectedProjectId) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          f.fileName.toLowerCase().includes(q) ||
          f.fileCode.toLowerCase().includes(q) ||
          f.projectName.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [files, selectedCategory, selectedProjectId, searchQuery]);

  const handleUploadOriginal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileData.fileName.trim() || !newFileData.projectId) return;

    const proj = projects.find((p) => p.id === newFileData.projectId);
    const client = proj ? clients.find((c) => c.id === proj.clientId) : undefined;
    const nextCode = `HC-DWG-${String(files.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();

    const originalVersion: FileVersion = {
      versionNumber: 1,
      versionLabel: 'V01 Original',
      uploadDate: now,
      uploadedBy: currentUser.name,
      fileUrl: `/drawings/v01-${newFileData.fileName.replace(/\s+/g, '_')}`,
      fileName: newFileData.fileName.trim(),
      fileSize: newFileData.fileSize || '4.5 MB',
      description: newFileData.description.trim() || 'Initial original drawing set',
      isFinal: false,
    };

    const payload: ProjectFile = {
      id: `fil-${Date.now()}`,
      companyId: currentCompany.id,
      fileCode: nextCode,
      projectId: newFileData.projectId,
      projectName: proj ? proj.name : 'Project',
      clientId: client ? client.id : 'cli-001',
      clientName: client ? client.name : 'Client',
      category: newFileData.category,
      fileName: newFileData.fileName.trim(),
      currentVersion: 'V01',
      versions: [originalVersion],
      status: 'Draft',
      createdAt: now,
      updatedAt: now,
    };

    await saveFile(payload);
    setIsUploadModalOpen(false);
    setNewFileData({
      projectId: projects[0]?.id || '',
      category: 'Structural',
      fileName: '',
      description: '',
      fileSize: '4.5 MB',
    });
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileBox className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl dark:text-white">
              Engineering Drawing &amp; Revision Vault
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Immutable version tree (V01, V02, V03, V04 Final) with complete download &amp; print tracking
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-orange-500 active:scale-95"
        >
          <FileUp className="h-4 w-4" />
          <span>Upload Original Drawing (V01)</span>
        </button>
      </div>

      {/* Main Tabs (Files, Download History, Print History) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 dark:border-slate-800">
        <button
          onClick={() => setActiveSubTab('files')}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
            activeSubTab === 'files'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Drawing Archives ({files.length})
        </button>
        <button
          onClick={() => setActiveSubTab('downloads')}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
            activeSubTab === 'downloads'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Download className="h-3.5 w-3.5" />
          Download History ({downloads.length})
        </button>
        <button
          onClick={() => setActiveSubTab('prints')}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
            activeSubTab === 'prints'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Printer className="h-3.5 w-3.5" />
          Print History ({prints.length})
        </button>
      </div>

      {/* SUBTAB 1: DRAWING FILES */}
      {activeSubTab === 'files' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs md:flex-row md:items-center md:justify-between dark:border-slate-800 dark:bg-slate-900">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search drawings by file name, code, or project..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="all">All Projects</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Files Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFiles.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 py-12 text-center text-slate-400 dark:border-slate-800">
                <FileBox className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No drawings found</p>
                <p className="text-xs text-slate-400 mt-1">Upload an original drawing to begin version tracking.</p>
              </div>
            ) : (
              filteredFiles.map((file) => {
                const latestVersion = file.versions[file.versions.length - 1];
                return (
                  <div
                    key={file.id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                  >
                    <div>
                      {/* Top Code & Version Badge */}
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700 dark:bg-orange-950/80 dark:text-orange-400">
                          {file.fileCode}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {file.category}
                          </span>
                          <span className="rounded-full bg-orange-600 px-2.5 py-0.5 text-[10px] font-extrabold text-white">
                            {file.currentVersion}
                          </span>
                        </div>
                      </div>

                      {/* File Name */}
                      <h3
                        onClick={() => setVersionModalFile(file)}
                        className="mt-2 text-sm font-bold text-slate-900 dark:text-white cursor-pointer hover:text-orange-600 dark:hover:text-orange-400 line-clamp-2"
                        title={file.fileName}
                      >
                        {file.fileName}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Project: <strong className="text-slate-700 dark:text-slate-300">{file.projectName}</strong>
                      </p>

                      {/* Revisions Summary */}
                      <div className="mt-3 rounded-xl bg-slate-50 p-2.5 text-xs dark:bg-slate-800/40">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                          <span>Revisions: <strong>{file.versions.length} versions</strong></span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{file.status}</span>
                        </div>
                        {latestVersion && latestVersion.correctionNote && (
                          <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300 italic line-clamp-1">
                            &ldquo;{latestVersion.correctionNote}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                      <button
                        onClick={() => setVersionModalFile(file)}
                        className="text-xs font-bold text-orange-600 hover:underline dark:text-orange-400 flex items-center gap-1"
                      >
                        <History className="h-3.5 w-3.5" />
                        <span>Timeline ({file.versions.length})</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setCorrectionModalFile(file)}
                          className="rounded-lg bg-orange-50 px-2 py-1 text-[11px] font-bold text-orange-600 hover:bg-orange-100 dark:bg-orange-950/40 dark:text-orange-400"
                          title="Upload Next Correction (Step 4 & 5)"
                        >
                          + Revision
                        </button>
                        <button
                          onClick={() => setPrintSlipState({ open: true, file, version: file.currentVersion })}
                          className="rounded-lg p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-white"
                          title="Print Transmittal Slip"
                        >
                          <Printer className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => deleteFile(file.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                          title="Delete File"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: DOWNLOAD HISTORY TABLE (Section 13) */}
      {activeSubTab === 'downloads' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Official File Download Registry (Section 13)
            </h3>
            <span className="text-xs text-slate-400">Total downloads: {downloads.length}</span>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider dark:bg-slate-800/60 dark:text-slate-400">
                <tr>
                  <th className="px-3 py-2.5">Date &amp; Time</th>
                  <th className="px-3 py-2.5">Drawing File Name</th>
                  <th className="px-3 py-2.5">Version</th>
                  <th className="px-3 py-2.5">Downloaded By</th>
                  <th className="px-3 py-2.5">Purpose / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {downloads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400">No download logs recorded yet.</td>
                  </tr>
                ) : (
                  downloads.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap">{new Date(d.downloadedAt).toLocaleString()}</td>
                      <td className="px-3 py-2.5 font-bold text-slate-900 dark:text-white">{d.fileName}</td>
                      <td className="px-3 py-2.5"><span className="rounded bg-orange-100 px-1.5 py-0.5 font-bold text-orange-700 dark:bg-orange-950 dark:text-orange-400">{d.version}</span></td>
                      <td className="px-3 py-2.5 font-semibold text-slate-800 dark:text-slate-200">{d.downloadedBy}</td>
                      <td className="px-3 py-2.5 text-slate-600 dark:text-slate-400">{d.purpose || 'Engineering Review'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: PRINT HISTORY TABLE (Section 14) */}
      {activeSubTab === 'prints' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Official Blueprint Print Transmittal History (Section 14)
            </h3>
            <span className="text-xs text-slate-400">Total print jobs: {prints.length}</span>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider dark:bg-slate-800/60 dark:text-slate-400">
                <tr>
                  <th className="px-3 py-2.5">Date &amp; Time</th>
                  <th className="px-3 py-2.5">Drawing File Name</th>
                  <th className="px-3 py-2.5">Version</th>
                  <th className="px-3 py-2.5">Printed By</th>
                  <th className="px-3 py-2.5">Copies</th>
                  <th className="px-3 py-2.5">Purpose / Transmittal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {prints.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400">No print records logged yet.</td>
                  </tr>
                ) : (
                  prints.map((prt) => (
                    <tr key={prt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap">{new Date(prt.printedAt).toLocaleString()}</td>
                      <td className="px-3 py-2.5 font-bold text-slate-900 dark:text-white">{prt.fileName}</td>
                      <td className="px-3 py-2.5"><span className="rounded bg-orange-100 px-1.5 py-0.5 font-bold text-orange-700 dark:bg-orange-950 dark:text-orange-400">{prt.version}</span></td>
                      <td className="px-3 py-2.5 font-semibold text-slate-800 dark:text-slate-200">{prt.printedBy}</td>
                      <td className="px-3 py-2.5 font-bold text-orange-600">{prt.printCount} sets</td>
                      <td className="px-3 py-2.5 text-slate-600 dark:text-slate-400">{prt.purpose || 'Site Execution'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Upload Original Drawing V01 */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold">Upload Original Drawing (V01)</h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUploadOriginal} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Project
                </label>
                <select
                  value={newFileData.projectId}
                  onChange={(e) => setNewFileData({ ...newFileData, projectId: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.projectCode})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Drawing Category
                </label>
                <select
                  value={newFileData.category}
                  onChange={(e) => setNewFileData({ ...newFileData, category: e.target.value as FileCategory })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  File Name (DWG / PDF / CAD) <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newFileData.fileName}
                  onChange={(e) => setNewFileData({ ...newFileData, fileName: e.target.value })}
                  placeholder="e.g. Al-Haramain_Foundation_Rebar_Detailing.dwg"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Design Description
                </label>
                <input
                  type="text"
                  value={newFileData.description}
                  onChange={(e) => setNewFileData({ ...newFileData, description: e.target.value })}
                  placeholder="Initial structural design vetted for approval"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-orange-500"
                >
                  <Save className="h-4 w-4" />
                  Save Original (V01)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Version Timeline Modal */}
      <FileVersionModal
        isOpen={Boolean(versionModalFile)}
        onClose={() => setVersionModalFile(null)}
        file={versionModalFile}
        onOpenCorrection={(f) => {
          setVersionModalFile(null);
          setCorrectionModalFile(f);
        }}
        onOpenPrintSlip={(f, v) => {
          setVersionModalFile(null);
          setPrintSlipState({ open: true, file: f, version: v });
        }}
      />

      {/* File Correction Workflow Modal (Step 4 & 5) */}
      <FileCorrectionModal
        isOpen={Boolean(correctionModalFile)}
        onClose={() => setCorrectionModalFile(null)}
        file={correctionModalFile}
      />

      {/* Print Slip Modal */}
      <FilePrintReceiptModal
        isOpen={printSlipState.open}
        onClose={() => setPrintSlipState({ open: false, file: null, version: '' })}
        file={printSlipState.file}
        versionLabel={printSlipState.version}
      />
    </div>
  );
};
