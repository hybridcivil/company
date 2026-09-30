import React, { useState, useEffect } from 'react';
import { X, FolderKanban, Save, Building, HardHat } from 'lucide-react';
import { Project, ProjectStatus, FoundationType } from '../../types';
import { useApp } from '../../context/AppContext';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Project | null;
}

const FOUNDATION_OPTIONS: FoundationType[] = [
  'Isolated Footing',
  'Combined Footing',
  'Raft Foundation',
  'Pile Foundation',
  'Deep Pier',
  'Other',
];

const STAGE_OPTIONS: ProjectStatus[] = [
  'Lead',
  'Quotation',
  'Contracted',
  'Design',
  'Approval',
  'Foundation',
  'Structure',
  'Brickwork',
  'Plaster',
  'Finishing',
  'Completed',
  'On Hold',
  'Cancelled',
];

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  projectToEdit,
}) => {
  const { currentCompany, clients, employees, saveProject, projects } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    clientId: '',
    projectLocation: '',
    district: 'Dhaka',
    upazila: '',
    areaSft: 15000,
    landAreaDecimal: 5,
    storeys: 6,
    foundationType: 'Pile Foundation' as FoundationType,
    projectType: 'Residential' as 'Residential' | 'Commercial' | 'Mixed-Use' | 'Industrial' | 'Institutional',
    startDate: new Date().toISOString().slice(0, 10),
    expectedCompletionDate: '',
    currentStage: 'Design' as ProjectStatus,
    progressPercent: 15,
    contractAmount: 800000,
    managingDirector: currentCompany.managingDirector,
    structuralEngineer: '',
    architect: '',
    draftEngineer: '',
    siteEngineer: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (projectToEdit) {
      setFormData({
        name: projectToEdit.name || '',
        clientId: projectToEdit.clientId || '',
        projectLocation: projectToEdit.projectLocation || '',
        district: projectToEdit.district || 'Dhaka',
        upazila: projectToEdit.upazila || '',
        areaSft: projectToEdit.areaSft || 15000,
        landAreaDecimal: projectToEdit.landAreaDecimal || 5,
        storeys: projectToEdit.storeys || 6,
        foundationType: projectToEdit.foundationType || 'Pile Foundation',
        projectType: projectToEdit.projectType || 'Residential',
        startDate: projectToEdit.startDate || '',
        expectedCompletionDate: projectToEdit.expectedCompletionDate || '',
        currentStage: projectToEdit.currentStage || 'Design',
        progressPercent: projectToEdit.progressPercent || 0,
        contractAmount: projectToEdit.contractAmount || 0,
        managingDirector: projectToEdit.assignedEngineers?.managingDirector || currentCompany.managingDirector,
        structuralEngineer: projectToEdit.assignedEngineers?.structuralEngineer || '',
        architect: projectToEdit.assignedEngineers?.architect || '',
        draftEngineer: projectToEdit.assignedEngineers?.draftEngineer || '',
        siteEngineer: projectToEdit.assignedEngineers?.siteEngineer || '',
        notes: projectToEdit.notes || '',
      });
    } else {
      const completionDate = new Date();
      completionDate.setFullYear(completionDate.getFullYear() + 1);
      setFormData({
        name: '',
        clientId: clients[0]?.id || '',
        projectLocation: '',
        district: 'Dhaka',
        upazila: '',
        areaSft: 18000,
        landAreaDecimal: 7.5,
        storeys: 6,
        foundationType: 'Pile Foundation',
        projectType: 'Residential',
        startDate: new Date().toISOString().slice(0, 10),
        expectedCompletionDate: completionDate.toISOString().slice(0, 10),
        currentStage: 'Design',
        progressPercent: 10,
        contractAmount: 900000,
        managingDirector: currentCompany.managingDirector,
        structuralEngineer: 'Engr. Tanjil Hossain',
        architect: 'Ar. Samira Chowdhury',
        draftEngineer: 'Md. Kamrul Hasan',
        siteEngineer: 'Engr. Rashedul Karim',
        notes: '',
      });
    }
    setErrors({});
  }, [projectToEdit, isOpen, clients, currentCompany.managingDirector]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Project title is required';
    if (!formData.clientId) errs.clientId = 'Please assign an existing client';
    if (!formData.projectLocation.trim()) errs.projectLocation = 'Location is required';
    if (formData.storeys <= 0) errs.storeys = 'Number of storeys must be at least 1';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const clientObj = clients.find((c) => c.id === formData.clientId);
    const clientName = clientObj ? clientObj.name : 'Unknown Client';
    const nextPrjCode = `HC-PRJ-${new Date().getFullYear()}-${String(projects.length + 1).padStart(2, '0')}`;

    const payload: Project = {
      id: projectToEdit ? projectToEdit.id : `prj-${Date.now()}`,
      companyId: currentCompany.id,
      projectCode: projectToEdit ? projectToEdit.projectCode : nextPrjCode,
      name: formData.name.trim(),
      clientId: formData.clientId,
      clientName,
      projectLocation: formData.projectLocation.trim(),
      district: formData.district.trim(),
      upazila: formData.upazila.trim() || formData.district.trim(),
      areaSft: Number(formData.areaSft) || 0,
      landAreaDecimal: Number(formData.landAreaDecimal) || 0,
      storeys: Number(formData.storeys) || 1,
      foundationType: formData.foundationType,
      projectType: formData.projectType,
      startDate: formData.startDate,
      expectedCompletionDate: formData.expectedCompletionDate,
      currentStage: formData.currentStage,
      progressPercent: Number(formData.progressPercent) || 0,
      status: formData.currentStage,
      notes: formData.notes.trim() || undefined,
      assignedEngineers: {
        managingDirector: formData.managingDirector,
        structuralEngineer: formData.structuralEngineer || undefined,
        architect: formData.architect || undefined,
        draftEngineer: formData.draftEngineer || undefined,
        siteEngineer: formData.siteEngineer || undefined,
      },
      contractAmount: Number(formData.contractAmount) || 0,
      paidAmount: projectToEdit ? projectToEdit.paidAmount : 0,
      dueAmount: projectToEdit
        ? Math.max(0, Number(formData.contractAmount) - (projectToEdit.paidAmount || 0))
        : Number(formData.contractAmount) || 0,
      createdAt: projectToEdit ? projectToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveProject(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl overflow-y-auto max-h-[92vh]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white font-bold">
              <FolderKanban className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {projectToEdit ? 'Edit Engineering Project' : 'Commission New Project'}
              </h3>
              <p className="text-xs text-slate-400">
                Hybrid Civil Architectural &amp; Structural Consultation
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {/* Project Name */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Project Title <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Al-Haramain Tower / Green View Complex"
                className={`w-full rounded-xl border bg-slate-800 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 ${
                  errors.name ? 'border-rose-500' : 'border-slate-700'
                }`}
              />
              {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
            </div>

            {/* Client Assignment */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Assign Client / Landowner <span className="text-orange-500">*</span>
              </label>
              <select
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.clientCode}) - {c.mobile}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Project Address / Road <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                value={formData.projectLocation}
                onChange={(e) => setFormData({ ...formData, projectLocation: e.target.value })}
                placeholder="Plot 45, Road 8/A, Dhanmondi"
                className={`w-full rounded-xl border bg-slate-800 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 ${
                  errors.projectLocation ? 'border-rose-500' : 'border-slate-700'
                }`}
              />
            </div>

            {/* District & Upazila */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">District</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="Dhaka"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Upazila/Thana</label>
                <input
                  type="text"
                  value={formData.upazila}
                  onChange={(e) => setFormData({ ...formData, upazila: e.target.value })}
                  placeholder="Dhanmondi"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
                />
              </div>
            </div>

            {/* Storeys & Foundation Type */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Number of Storeys (তলা) <span className="text-orange-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={formData.storeys}
                onChange={(e) => setFormData({ ...formData, storeys: parseInt(e.target.value) || 1 })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Foundation Substructure Type
              </label>
              <select
                value={formData.foundationType}
                onChange={(e) => setFormData({ ...formData, foundationType: e.target.value as FoundationType })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
              >
                {FOUNDATION_OPTIONS.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Total Area SFT & Land Area Decimal */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Total Built-up Area (SFT)
              </label>
              <input
                type="number"
                value={formData.areaSft || ''}
                onChange={(e) => setFormData({ ...formData, areaSft: parseFloat(e.target.value) || 0 })}
                placeholder="25000"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Land Area (Decimal / শতাংশ)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.landAreaDecimal || ''}
                onChange={(e) => setFormData({ ...formData, landAreaDecimal: parseFloat(e.target.value) || 0 })}
                placeholder="8.5"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
              />
            </div>

            {/* Project Type & Stage */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Occupancy / Project Type
              </label>
              <select
                value={formData.projectType}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value as typeof formData.projectType })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Mixed-Use">Mixed-Use</option>
                <option value="Industrial">Industrial</option>
                <option value="Institutional">Institutional</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Current Construction Stage
              </label>
              <select
                value={formData.currentStage}
                onChange={(e) => setFormData({ ...formData, currentStage: e.target.value as ProjectStatus })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
              >
                {STAGE_OPTIONS.map((stg) => (
                  <option key={stg} value={stg}>{stg}</option>
                ))}
              </select>
            </div>

            {/* Progress Percent & Contract Amount */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Work Progress: {formData.progressPercent}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.progressPercent}
                onChange={(e) => setFormData({ ...formData, progressPercent: parseInt(e.target.value) || 0 })}
                className="w-full accent-orange-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Agreed Consultancy Contract Amount (৳)
              </label>
              <input
                type="number"
                value={formData.contractAmount || ''}
                onChange={(e) => setFormData({ ...formData, contractAmount: parseFloat(e.target.value) || 0 })}
                placeholder="1200000"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
              />
            </div>

            {/* Dates */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Target Completion Date
              </label>
              <input
                type="date"
                value={formData.expectedCompletionDate}
                onChange={(e) => setFormData({ ...formData, expectedCompletionDate: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
              />
            </div>
          </div>

          {/* Assigned Engineering Team */}
          <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-3.5 space-y-3">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block">
              Assigned Engineering &amp; Architectural Team
            </span>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-0.5">Structural Consultant</label>
                <input
                  type="text"
                  value={formData.structuralEngineer}
                  onChange={(e) => setFormData({ ...formData, structuralEngineer: e.target.value })}
                  placeholder="Engr. Tanjil Hossain"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-0.5">Architect</label>
                <input
                  type="text"
                  value={formData.architect}
                  onChange={(e) => setFormData({ ...formData, architect: e.target.value })}
                  placeholder="Ar. Samira Chowdhury"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-0.5">CAD Draft Engineer</label>
                <input
                  type="text"
                  value={formData.draftEngineer}
                  onChange={(e) => setFormData({ ...formData, draftEngineer: e.target.value })}
                  placeholder="Md. Kamrul Hasan"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-0.5">Site Engineer</label>
                <input
                  type="text"
                  value={formData.siteEngineer}
                  onChange={(e) => setFormData({ ...formData, siteEngineer: e.target.value })}
                  placeholder="Engr. Rashedul Karim"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>
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
              {projectToEdit ? 'Save Changes' : 'Commission Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
