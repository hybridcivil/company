import React, { useState, useMemo } from 'react';
import {
  FolderKanban,
  Search,
  Plus,
  Filter,
  Building,
  Layers,
  MapPin,
  Clock,
  ArrowRight,
  Trash2,
  Edit,
  SlidersHorizontal,
  X,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Project, ProjectStatus, FoundationType } from '../../types';
import { ProjectFormModal } from './ProjectFormModal';
import { ProjectDetailView } from './ProjectDetailView';
import { ServicesContractModal } from '../contracts/ServicesContractModal';
import { PaymentModal } from '../payments/PaymentModal';
import { SiteVisitModal } from '../sitevisits/SiteVisitModal';
import { FileVersionModal } from '../files/FileVersionModal';
import { SoilTestFormModal } from '../soiltest/SoilTestFormModal';

export const ProjectList: React.FC = () => {
  const {
    projects,
    clients,
    deleteProject,
    selectedProjectId,
    setSelectedProjectId,
    currentCompany,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filters State according to Section 7
  const [selectedStorey, setSelectedStorey] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedAreaRange, setSelectedAreaRange] = useState<string>('all');
  const [selectedFoundation, setSelectedFoundation] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedClientId, setSelectedClientId] = useState<string>('all');

  // Fast Child Modals triggers from Project Detail
  const [contractModalState, setContractModalState] = useState<{ open: boolean; prjId: string; cliId: string }>({ open: false, prjId: '', cliId: '' });
  const [paymentModalState, setPaymentModalState] = useState<{ open: boolean; prjId: string; cliId: string }>({ open: false, prjId: '', cliId: '' });
  const [visitModalState, setVisitModalState] = useState<{ open: boolean; prjId: string; cliId: string }>({ open: false, prjId: '', cliId: '' });
  const [fileModalState, setFileModalState] = useState<{ open: boolean; prjId: string; cliId: string }>({ open: false, prjId: '', cliId: '' });
  const [soilModalState, setSoilModalState] = useState<{ open: boolean; prjId: string; cliId: string }>({ open: false, prjId: '', cliId: '' });

  const sym = currentCompany.currencySymbol || '৳';

  // Distinct districts from current projects
  const uniqueDistricts = useMemo(() => {
    return Array.from(new Set(projects.map((p) => p.district).filter(Boolean)));
  }, [projects]);

  // Filter application
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.projectCode.toLowerCase().includes(q) ||
          p.clientName.toLowerCase().includes(q) ||
          p.projectLocation.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Storey filter
      if (selectedStorey !== 'all') {
        const s = parseInt(selectedStorey, 10);
        if (s === 10) {
          if (p.storeys < 10) return false;
        } else if (p.storeys !== s) {
          return false;
        }
      }

      // District filter
      if (selectedDistrict !== 'all' && p.district !== selectedDistrict) {
        return false;
      }

      // Foundation filter
      if (selectedFoundation !== 'all' && p.foundationType !== selectedFoundation) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && p.currentStage !== selectedStatus) {
        return false;
      }

      // Client filter
      if (selectedClientId !== 'all' && p.clientId !== selectedClientId) {
        return false;
      }

      // Area Range filter
      if (selectedAreaRange !== 'all') {
        const area = p.areaSft;
        if (selectedAreaRange === 'under-1000' && area >= 1000) return false;
        if (selectedAreaRange === '1000-2000' && (area < 1000 || area > 2000)) return false;
        if (selectedAreaRange === '2000-3000' && (area < 2000 || area > 3000)) return false;
        if (selectedAreaRange === '3000-5000' && (area < 3000 || area > 5000)) return false;
        if (selectedAreaRange === '5000+' && area < 5000) return false;
      }

      return true;
    });
  }, [
    projects,
    searchQuery,
    selectedStorey,
    selectedDistrict,
    selectedFoundation,
    selectedStatus,
    selectedClientId,
    selectedAreaRange,
  ]);

  const activeFilterCount = [
    selectedStorey !== 'all',
    selectedDistrict !== 'all',
    selectedFoundation !== 'all',
    selectedStatus !== 'all',
    selectedClientId !== 'all',
    selectedAreaRange !== 'all',
  ].filter(Boolean).length;

  const resetFilters = () => {
    setSelectedStorey('all');
    setSelectedDistrict('all');
    setSelectedFoundation('all');
    setSelectedStatus('all');
    setSelectedClientId('all');
    setSelectedAreaRange('all');
    setSearchQuery('');
  };

  const handleDeleteConfirm = async () => {
    if (projectToDelete) {
      await deleteProject(projectToDelete.id);
      setProjectToDelete(null);
      if (selectedProjectId === projectToDelete.id) {
        setSelectedProjectId(null);
      }
    }
  };

  // If a project is selected, render the Section 39 detailed view
  if (selectedProjectId) {
    return (
      <>
        <ProjectDetailView
          projectId={selectedProjectId}
          onBack={() => setSelectedProjectId(null)}
          onEditProject={(p) => {
            setProjectToEdit(p);
            setIsFormOpen(true);
          }}
          onOpenNewContract={(prjId, cliId) => setContractModalState({ open: true, prjId, cliId })}
          onOpenNewPayment={(prjId, cliId) => setPaymentModalState({ open: true, prjId, cliId })}
          onOpenNewSiteVisit={(prjId, cliId) => setVisitModalState({ open: true, prjId, cliId })}
          onOpenNewFile={(prjId, cliId) => setFileModalState({ open: true, prjId, cliId })}
          onOpenNewSoilTest={(prjId, cliId) => setSoilModalState({ open: true, prjId, cliId })}
        />

        {/* Modal Modals when triggered from project detail view */}
        <ProjectFormModal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setProjectToEdit(null);
          }}
          projectToEdit={projectToEdit}
        />
        <ServicesContractModal
          isOpen={contractModalState.open}
          onClose={() => setContractModalState({ open: false, prjId: '', cliId: '' })}
          projectId={contractModalState.prjId}
          clientId={contractModalState.cliId}
        />
        <PaymentModal
          isOpen={paymentModalState.open}
          onClose={() => setPaymentModalState({ open: false, prjId: '', cliId: '' })}
          projectId={paymentModalState.prjId}
          clientId={paymentModalState.cliId}
        />
        <SiteVisitModal
          isOpen={visitModalState.open}
          onClose={() => setVisitModalState({ open: false, prjId: '', cliId: '' })}
          projectId={visitModalState.prjId}
          clientId={visitModalState.cliId}
        />
        <SoilTestFormModal
          isOpen={soilModalState.open}
          onClose={() => setSoilModalState({ open: false, prjId: '', cliId: '' })}
          projectId={soilModalState.prjId}
          clientId={soilModalState.cliId}
        />
      </>
    );
  }

  return (
    <div className="space-y-5 pb-12">
      {/* Top Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl dark:text-white">
              Project Portfolio &amp; Site Stages
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Architectural, structural, and foundation engineering projects with live progress
          </p>
        </div>

        <button
          onClick={() => {
            setProjectToEdit(null);
            setIsFormOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-orange-500 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Commission New Project</span>
        </button>
      </div>

      {/* Search & Filter Trigger Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by project title, code (e.g. HC-PRJ-2026-01), client, location, or district..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition ${
              showFilters || activeFilterCount > 0
                ? 'border-orange-500 bg-orange-50 text-orange-600 dark:border-orange-500 dark:bg-orange-950/40 dark:text-orange-400'
                : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-orange-600 px-1.5 py-0.2 text-[10px] text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-xs text-rose-500 hover:underline p-1.5"
              title="Reset All Filters"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* SECTION 7 EXPANDABLE INSTANT FILTER PANEL */}
        {showFilters && (
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/40 space-y-3">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 text-xs">
              {/* Storey Filter */}
              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Storey Height
                </label>
                <select
                  value={selectedStorey}
                  onChange={(e) => setSelectedStorey(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="all">All Storeys</option>
                  <option value="1">1 Storey</option>
                  <option value="2">2 Storey</option>
                  <option value="3">3 Storey</option>
                  <option value="5">5 Storey</option>
                  <option value="7">7 Storey</option>
                  <option value="10">10+ Storey</option>
                </select>
              </div>

              {/* District Filter */}
              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  District Location
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="all">All Districts</option>
                  {uniqueDistricts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Foundation Filter */}
              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Foundation Type
                </label>
                <select
                  value={selectedFoundation}
                  onChange={(e) => setSelectedFoundation(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="all">All Foundations</option>
                  <option value="Isolated Footing">Isolated Footing</option>
                  <option value="Combined Footing">Combined Footing</option>
                  <option value="Raft Foundation">Raft Foundation</option>
                  <option value="Pile Foundation">Pile Foundation</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Area Range Filter */}
              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Area (SFT) Range
                </label>
                <select
                  value={selectedAreaRange}
                  onChange={(e) => setSelectedAreaRange(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="all">All Built Areas</option>
                  <option value="under-1000">Under 1000 SFT</option>
                  <option value="1000-2000">1000–2000 SFT</option>
                  <option value="2000-3000">2000–3000 SFT</option>
                  <option value="3000-5000">3000–5000 SFT</option>
                  <option value="5000+">5000+ SFT</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Construction Stage
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="all">All Stages</option>
                  <option value="Lead">Lead</option>
                  <option value="Quotation">Quotation</option>
                  <option value="Contracted">Contracted</option>
                  <option value="Design">Design</option>
                  <option value="Approval">Approval</option>
                  <option value="Foundation">Foundation</option>
                  <option value="Structure">Structure</option>
                  <option value="Brickwork">Brickwork</option>
                  <option value="Plaster">Plaster</option>
                  <option value="Finishing">Finishing</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Client Filter */}
              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Client / Owner
                </label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="all">All Clients</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-300 py-12 text-center text-slate-400 dark:border-slate-800">
            <FolderKanban className="mx-auto h-8 w-8 text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              No engineering projects match the selected criteria
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting the filters or click &quot;Commission New Project&quot;.
            </p>
          </div>
        ) : (
          filteredProjects.map((p) => {
            return (
              <div
                key={p.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
              >
                <div>
                  {/* Top Bar: Code & Current Stage */}
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700 dark:bg-orange-950/80 dark:text-orange-400">
                      {p.projectCode}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {p.currentStage}
                    </span>
                  </div>

                  {/* Project Name */}
                  <h3
                    onClick={() => setSelectedProjectId(p.id)}
                    className="mt-2 text-base font-bold text-slate-900 dark:text-white cursor-pointer group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors"
                  >
                    {p.name}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Client: <strong className="text-slate-700 dark:text-slate-300">{p.clientName}</strong>
                  </p>

                  {/* Technical Meta badges */}
                  <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {p.storeys} Storey
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {p.areaSft.toLocaleString()} SFT
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {p.foundationType}
                    </span>
                  </div>

                  <p className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-2 truncate">
                    <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                    <span className="truncate">{p.projectLocation}, {p.district}</span>
                  </p>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      <span>Execution Progress</span>
                      <span className="text-orange-600 dark:text-orange-400">{p.progressPercent}%</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-orange-600 transition-all duration-300"
                        style={{ width: `${p.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Financials Strip */}
                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 dark:border-slate-800 text-[11px]">
                    <div>
                      <span className="text-slate-400 text-[10px]">Contract</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        {sym} {p.contractAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px]">Paid</span>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">
                        {sym} {p.paidAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px]">Due</span>
                      <p className="font-bold text-rose-600 dark:text-rose-400">
                        {sym} {p.dueAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                  <button
                    onClick={() => setSelectedProjectId(p.id)}
                    className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:underline dark:text-orange-400"
                  >
                    <span>Full Dossier</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setProjectToEdit(p);
                        setIsFormOpen(true);
                      }}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-white"
                      title="Edit Project"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setProjectToDelete(p)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                      title="Delete Project"
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

      {/* Project Form Modal */}
      <ProjectFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setProjectToEdit(null);
        }}
        projectToEdit={projectToEdit}
      />

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-5 text-white shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-rose-600/20 p-2 text-rose-500">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">Delete Project?</h3>
                <p className="text-xs text-slate-400">All linked services and files remain archived.</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-300">
              Are you sure you want to delete <strong>{projectToDelete.name}</strong> ({projectToDelete.projectCode})?
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setProjectToDelete(null)}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-500"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
