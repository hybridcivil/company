import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  X,
  FolderKanban,
  Users,
  FileBox,
  HardHat,
  Briefcase,
  Layers,
  ArrowRight,
  CreditCard,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GlobalSearchModal: React.FC = () => {
  const {
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    clients,
    projects,
    files,
    employees,
    contractors,
    soilTests,
    payments,
    setActiveTab,
    setSelectedProjectId,
    setSelectedClientId,
  } = useApp();

  const [query, setQuery] = useState('');

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(!isGlobalSearchOpen);
      }
      if (e.key === 'Escape' && isGlobalSearchOpen) {
        setIsGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGlobalSearchOpen, setIsGlobalSearchOpen]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    const matchedProjects = projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.projectCode.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        (p.projectLocation || '').toLowerCase().includes(q) ||
        p.clientName.toLowerCase().includes(q)
    );

    const matchedClients = clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.clientCode.toLowerCase().includes(q) ||
        c.mobile.includes(q) ||
        (c.email && c.email.toLowerCase().includes(q))
    );

    const matchedFiles = files.filter(
      (f) =>
        f.fileName.toLowerCase().includes(q) ||
        f.fileCode.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        f.projectName.toLowerCase().includes(q)
    );

    const matchedEngineers = employees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.position.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.mobile.includes(q)
    );

    const matchedContractors = contractors.filter(
      (cnt) =>
        cnt.name.toLowerCase().includes(q) ||
        cnt.companyName.toLowerCase().includes(q) ||
        cnt.trade.toLowerCase().includes(q)
    );

    const matchedSoilTests = soilTests.filter(
      (s) =>
        s.testCode.toLowerCase().includes(q) ||
        s.boreholeId.toLowerCase().includes(q) ||
        s.projectName.toLowerCase().includes(q) ||
        s.clientName.toLowerCase().includes(q)
    );

    const matchedPayments = payments.filter(
      (p) =>
        p.receiptNo.toLowerCase().includes(q) ||
        p.clientName.toLowerCase().includes(q) ||
        p.projectName.toLowerCase().includes(q) ||
        (p.reference && p.reference.toLowerCase().includes(q))
    );

    return {
      projects: matchedProjects,
      clients: matchedClients,
      files: matchedFiles,
      engineers: matchedEngineers,
      contractors: matchedContractors,
      soilTests: matchedSoilTests,
      payments: matchedPayments,
      totalCount:
        matchedProjects.length +
        matchedClients.length +
        matchedFiles.length +
        matchedEngineers.length +
        matchedContractors.length +
        matchedSoilTests.length +
        matchedPayments.length,
    };
  }, [query, projects, clients, files, employees, contractors, soilTests, payments]);

  if (!isGlobalSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-16 backdrop-blur-xs sm:p-6 sm:pt-20">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-slate-800 px-4 py-3">
          <Search className="h-5 w-5 text-orange-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients, projects, drawings, soil tests, engineers, payments..."
            autoFocus
            className="flex-1 bg-transparent px-3 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="rounded-lg p-1 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setIsGlobalSearchOpen(false)}
            className="ml-2 rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[70vh] overflow-y-auto p-4 space-y-4">
          {!query && (
            <div className="py-8 text-center text-slate-400">
              <Search className="mx-auto h-8 w-8 text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-300">Global System Search</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Type client name, project code, drawing file, engineer, contractor, or receipt voucher to instantly locate records.
              </p>
            </div>
          )}

          {searchResults && searchResults.totalCount === 0 && (
            <div className="py-8 text-center text-slate-400">
              <p className="text-sm font-medium text-slate-300">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-500 mt-1">Please try searching with another keyword or ID number.</p>
            </div>
          )}

          {/* Matched Projects */}
          {searchResults && searchResults.projects.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-orange-400 uppercase tracking-wider">
                <FolderKanban className="h-4 w-4" /> Projects ({searchResults.projects.length})
              </div>
              <div className="space-y-1.5">
                {searchResults.projects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedProjectId(p.id);
                      setActiveTab('projects');
                      setIsGlobalSearchOpen(false);
                    }}
                    className="flex cursor-pointer items-center justify-between rounded-xl bg-slate-800/80 p-3 hover:bg-slate-800 hover:border-slate-700 border border-transparent transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">{p.name}</span>
                        <span className="rounded bg-orange-500/20 px-1.5 py-0.5 text-[10px] font-bold text-orange-400">
                          {p.projectCode}
                        </span>
                        <span className="rounded bg-slate-700 px-1.5 py-0.5 text-[10px] text-slate-300">
                          {p.storeys} Storey
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Client: {p.clientName} • {p.district} • {p.foundationType}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Clients */}
          {searchResults && searchResults.clients.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                <Users className="h-4 w-4" /> Clients ({searchResults.clients.length})
              </div>
              <div className="space-y-1.5">
                {searchResults.clients.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedClientId(c.id);
                      setActiveTab('clients');
                      setIsGlobalSearchOpen(false);
                    }}
                    className="flex cursor-pointer items-center justify-between rounded-xl bg-slate-800/80 p-3 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">{c.name}</span>
                        <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-bold text-blue-400">
                          {c.clientCode}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Phone: {c.mobile} • {c.address}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Files & Drawings */}
          {searchResults && searchResults.files.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <FileBox className="h-4 w-4" /> Drawings &amp; Files ({searchResults.files.length})
              </div>
              <div className="space-y-1.5">
                {searchResults.files.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => {
                      setActiveTab('files');
                      setIsGlobalSearchOpen(false);
                    }}
                    className="flex cursor-pointer items-center justify-between rounded-xl bg-slate-800/80 p-3 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">{f.fileName}</span>
                        <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                          {f.currentVersion}
                        </span>
                        <span className="rounded bg-slate-700 px-1.5 py-0.5 text-[10px] text-slate-300">
                          {f.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Project: {f.projectName} • Status: {f.status}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Soil Tests */}
          {searchResults && searchResults.soilTests.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Layers className="h-4 w-4" /> Soil Tests &amp; SPT ({searchResults.soilTests.length})
              </div>
              <div className="space-y-1.5">
                {searchResults.soilTests.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setActiveTab('soilTest');
                      setIsGlobalSearchOpen(false);
                    }}
                    className="flex cursor-pointer items-center justify-between rounded-xl bg-slate-800/80 p-3 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">{s.testCode}</span>
                        <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
                          {s.boreholeId}
                        </span>
                        <span className="text-xs text-slate-300">Depth: {s.totalDepthFeet} ft</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Project: {s.projectName} • Client: {s.clientName}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Payments */}
          {searchResults && searchResults.payments.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-green-400 uppercase tracking-wider">
                <CreditCard className="h-4 w-4" /> Payment Receipts ({searchResults.payments.length})
              </div>
              <div className="space-y-1.5">
                {searchResults.payments.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setActiveTab('accounts');
                      setIsGlobalSearchOpen(false);
                    }}
                    className="flex cursor-pointer items-center justify-between rounded-xl bg-slate-800/80 p-3 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">৳{p.amount.toLocaleString()}</span>
                        <span className="rounded bg-green-500/20 px-1.5 py-0.5 text-[10px] font-bold text-green-400">
                          {p.receiptNo}
                        </span>
                        <span className="text-xs text-slate-300">{p.date}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Client: {p.clientName} • Project: {p.projectName} • {p.paymentMethod}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Team */}
          {searchResults && searchResults.engineers.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
                <HardHat className="h-4 w-4" /> Engineers &amp; Staff ({searchResults.engineers.length})
              </div>
              <div className="space-y-1.5">
                {searchResults.engineers.map((e) => (
                  <div
                    key={e.id}
                    onClick={() => {
                      setActiveTab('team');
                      setIsGlobalSearchOpen(false);
                    }}
                    className="flex cursor-pointer items-center justify-between rounded-xl bg-slate-800/80 p-3 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">{e.name}</span>
                        <span className="rounded bg-purple-500/20 px-1.5 py-0.5 text-[10px] font-bold text-purple-400">
                          {e.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {e.position} • {e.mobile}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
