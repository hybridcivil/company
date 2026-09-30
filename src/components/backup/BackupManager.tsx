import React, { useState } from 'react';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  GitBranch,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileCode,
  HardDrive,
  Lock,
  Server,
  Terminal,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BackupManager: React.FC = () => {
  const { exportDataJSON, importDataJSON, syncGitHubVault, currentCompany } = useApp();

  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const json = await exportDataJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `HYBRID_CIVIL_BACKUP_${currentCompany.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setMessage({
        text: 'Database backup downloaded successfully. Keep this file in a secure vault.',
        type: 'success',
      });
    } catch (err: any) {
      setMessage({ text: `Export failed: ${err.message}`, type: 'error' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm('WARNING: Restoring data will overwrite your current active records with the backup file. Proceed?')) {
      e.target.value = '';
      return;
    }

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const success = await importDataJSON(text);
        if (success) {
          setMessage({
            text: 'System database restored successfully from JSON backup!',
            type: 'success',
          });
        } else {
          setMessage({
            text: 'Import failed: The selected file does not match the valid Hybrid Civil schema.',
            type: 'error',
          });
        }
      } catch (err: any) {
        setMessage({ text: `Error reading file: ${err.message}`, type: 'error' });
      } finally {
        setIsImporting(false);
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleSyncGitHub = async () => {
    setIsSyncing(true);
    try {
      const res = await syncGitHubVault();
      if (res.success) {
        setMessage({
          text: `GitHub Storage Vault Sync Complete: ${res.message}`,
          type: 'success',
        });
      } else {
        setMessage({
          text: `GitHub Sync: ${res.message}. Local storage remains primary & safe.`,
          type: 'info',
        });
      }
    } catch (err: any) {
      setMessage({
        text: `Sync error: ${err.message}. Local changes are intact.`,
        type: 'error',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-slate-700 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-2 border border-orange-500/30">
              <HardDrive className="w-3.5 h-3.5" />
              Secure Data Resilience
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Backup &amp; GitHub Storage Layer
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Controlled persistence, JSON snapshots, and server-side private GitHub repository syncing.
            </p>
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-lg shadow-orange-950/30 transition disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Generating...' : 'Download JSON Snapshot'}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-medium animate-fade-in ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : message.type === 'error'
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-blue-50 text-blue-800 border-blue-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : message.type === 'error' ? (
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Grid of Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GitHub Storage Layer Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <GitBranch className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">GitHub Private Repository Storage</h3>
                  <p className="text-xs text-slate-500">Controlled server-side persistence</p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Encrypted
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Designed according to architectural specifications: Front-end makes secure calls to server API routes, which use your server-side environment variables (<code>GITHUB_TOKEN</code>, <code>GITHUB_REPO</code>) to store versioned data in your private GitHub repository without ever exposing tokens to browser clients.
            </p>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Storage Target:</span>
                <span className="font-mono font-semibold text-slate-800">Private Repository data branch</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Token Exposure:</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> 0% (Server-only)
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Failover Mode:</span>
                <span className="font-semibold text-slate-800">Auto Local Storage Fallback</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Sync with GitHub repository</span>
            <button
              onClick={handleSyncGitHub}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync GitHub Vault'}
            </button>
          </div>
        </div>

        {/* Local JSON Backup / Restore Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Direct JSON Snapshot &amp; Restore</h3>
                  <p className="text-xs text-slate-500">Manual portable file backup</p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                JSON v1.0
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Instantly export your entire consultancy database including clients, land records, CAD/PDF revisions, site visit logs, allowances, employee payrolls, contractor ledgers, soil SPT logs, and accounting vouchers to an offline JSON file.
            </p>

            <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Restore Caution:</strong> Importing will replace the local browser cache with the imported records.
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
            >
              <Download className="w-3.5 h-3.5" />
              Download JSON
            </button>

            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer transition">
              <Upload className="w-3.5 h-3.5" />
              {isImporting ? 'Restoring...' : 'Restore from JSON'}
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                disabled={isImporting}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Security Architecture Reference */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-2">
          <Terminal className="w-4 h-4 text-slate-600" />
          Enterprise Deployment Architecture for Vercel
        </h3>
        <p className="text-xs text-slate-600 mb-3">
          To connect your production Vercel deployment with your private GitHub storage repository, ensure these environment variables are set in your Vercel Project Settings:
        </p>
        <div className="bg-slate-900 text-slate-200 font-mono text-xs rounded-xl p-4 overflow-x-auto space-y-1">
          <div><span className="text-purple-400">GITHUB_OWNER</span>=<span className="text-emerald-300">&quot;your-github-username-or-org&quot;</span></div>
          <div><span className="text-purple-400">GITHUB_REPO</span>=<span className="text-emerald-300">&quot;hybrid-civil-private-vault&quot;</span></div>
          <div><span className="text-purple-400">GITHUB_BRANCH</span>=<span className="text-emerald-300">&quot;main&quot;</span></div>
          <div><span className="text-purple-400">GITHUB_TOKEN</span>=<span className="text-emerald-300">&quot;ghp_xxxxxxxxxxxxxxxxxxxx&quot;</span> <span className="text-slate-500"># Server-side only!</span></div>
          <div><span className="text-purple-400">STORAGE_DRIVER</span>=<span className="text-emerald-300">&quot;github&quot;</span></div>
        </div>
      </div>
    </div>
  );
};
