import React, { useState, useEffect } from 'react';
import { X, Compass, Save, CheckCircle2 } from 'lucide-react';
import { SiteVisit } from '../../types';
import { useApp } from '../../context/AppContext';

interface SiteVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitToEdit?: SiteVisit | null;
  projectId?: string;
  clientId?: string;
}

export const SiteVisitModal: React.FC<SiteVisitModalProps> = ({
  isOpen,
  onClose,
  visitToEdit,
  projectId,
  clientId,
}) => {
  const { currentCompany, projects, clients, employees, saveSiteVisit, saveAllowance } = useApp();

  const siteEngineers = employees.filter(
    (e) => e.role === 'Site Engineer' || e.role === 'Engineer' || e.role === 'Structural Engineer'
  );

  const [formData, setFormData] = useState({
    projectId: projectId || '',
    clientId: clientId || '',
    visitDate: new Date().toISOString().slice(0, 10),
    visitTime: '10:00 AM',
    engineerId: siteEngineers[0]?.id || '',
    engineerName: siteEngineers[0]?.name || 'Engr. Rashedul Karim',
    currentWorkStage: '6th Floor Slab Shuttering & Rebar Checking',
    progressPercent: 55,
    siteCondition: 'Normal, dry weather, safety perimeter checked',
    observation: 'Beam clear cover, spacing of stirrups and extra top bars verified according to drawing HC-DWG-001.',
    problems: 'One negative rebar was misplaced near grid B2.',
    requiredAction: 'Advised contractor foreman to insert additional 16mm bar before concrete casting.',
    nextVisitDate: '',
    visitCharge: 5000,
    paid: 5000,
    engineerAllowance: 1500,
    notes: '',
  });

  useEffect(() => {
    if (visitToEdit) {
      setFormData({
        projectId: visitToEdit.projectId,
        clientId: visitToEdit.clientId,
        visitDate: visitToEdit.visitDate,
        visitTime: visitToEdit.visitTime,
        engineerId: visitToEdit.engineerId,
        engineerName: visitToEdit.engineerName,
        currentWorkStage: visitToEdit.currentWorkStage,
        progressPercent: visitToEdit.progressPercent,
        siteCondition: visitToEdit.siteCondition,
        observation: visitToEdit.observation,
        problems: visitToEdit.problems || '',
        requiredAction: visitToEdit.requiredAction || '',
        nextVisitDate: visitToEdit.nextVisitDate || '',
        visitCharge: visitToEdit.visitCharge,
        paid: visitToEdit.paid,
        engineerAllowance: 1500,
        notes: visitToEdit.notes || '',
      });
    } else {
      const defaultProj = projects.find((p) => p.id === projectId) || projects[0];
      setFormData({
        projectId: defaultProj ? defaultProj.id : '',
        clientId: defaultProj ? defaultProj.clientId : clients[0]?.id || '',
        visitDate: new Date().toISOString().slice(0, 10),
        visitTime: '10:30 AM',
        engineerId: siteEngineers[0]?.id || 'emp-004',
        engineerName: siteEngineers[0]?.name || 'Engr. Rashedul Karim',
        currentWorkStage: 'Structural Inspection',
        progressPercent: defaultProj ? defaultProj.progressPercent : 50,
        siteCondition: 'Good, scaffolding stable',
        observation: 'Concrete slump tested 100mm, clear cover maintained.',
        problems: '',
        requiredAction: '',
        nextVisitDate: '',
        visitCharge: 5000,
        paid: 5000,
        engineerAllowance: 1500,
        notes: '',
      });
    }
  }, [visitToEdit, projectId, clientId, isOpen, projects, clients, siteEngineers]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectId) return;

    const proj = projects.find((p) => p.id === formData.projectId);
    const client = clients.find((c) => c.id === formData.clientId) || (proj ? clients.find((c) => c.id === proj.clientId) : undefined);
    const visitId = visitToEdit ? visitToEdit.id : `sv-${Date.now()}`;
    const now = new Date().toISOString();

    const visitPayload: SiteVisit = {
      id: visitId,
      companyId: currentCompany.id,
      projectId: formData.projectId,
      projectName: proj ? proj.name : 'Project',
      clientId: client ? client.id : (proj ? proj.clientId : 'cli-001'),
      clientName: client ? client.name : (proj ? proj.clientName : 'Client'),
      visitDate: formData.visitDate,
      visitTime: formData.visitTime,
      engineerId: formData.engineerId,
      engineerName: formData.engineerName,
      currentWorkStage: formData.currentWorkStage,
      progressPercent: Number(formData.progressPercent) || 0,
      siteCondition: formData.siteCondition,
      observation: formData.observation,
      problems: formData.problems.trim() || undefined,
      requiredAction: formData.requiredAction.trim() || undefined,
      nextVisitDate: formData.nextVisitDate.trim() || undefined,
      visitCharge: Number(formData.visitCharge) || 0,
      paid: Number(formData.paid) || 0,
      due: Math.max(0, Number(formData.visitCharge) - Number(formData.paid)),
      photos: [],
      notes: formData.notes.trim() || undefined,
      createdAt: visitToEdit ? visitToEdit.createdAt : now,
      updatedAt: now,
    };

    await saveSiteVisit(visitPayload);

    // Auto record site visit allowance (Section 16)
    if (!visitToEdit && formData.engineerAllowance > 0) {
      await saveAllowance({
        id: `alw-${Date.now()}`,
        companyId: currentCompany.id,
        engineerId: formData.engineerId,
        engineerName: formData.engineerName,
        projectId: formData.projectId,
        projectName: proj ? proj.name : 'Project',
        visitId: visitId,
        allowanceType: 'Per-visit',
        amount: Number(formData.engineerAllowance),
        date: formData.visitDate,
        month: formData.visitDate.slice(0, 7),
        status: 'Unpaid',
        notes: `Conveyance allowance for inspection on ${formData.visitDate}`,
        createdAt: now,
        updatedAt: now,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl overflow-y-auto max-h-[92vh]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white font-bold">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {visitToEdit ? 'Edit Site Inspection Report' : 'Log Site Quality Inspection'}
              </h3>
              <p className="text-xs text-slate-400">Section 15: Field observation and quality check record</p>
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
            {/* Project Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Project Site <span className="text-orange-500">*</span>
              </label>
              <select
                value={formData.projectId}
                onChange={(e) => {
                  const p = projects.find((pr) => pr.id === e.target.value);
                  setFormData({
                    ...formData,
                    projectId: e.target.value,
                    clientId: p ? p.clientId : formData.clientId,
                    progressPercent: p ? p.progressPercent : formData.progressPercent,
                  });
                }}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.projectLocation})</option>
                ))}
              </select>
            </div>

            {/* Engineer Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Inspecting Engineer <span className="text-orange-500">*</span>
              </label>
              <select
                value={formData.engineerId}
                onChange={(e) => {
                  const emp = employees.find((em) => em.id === e.target.value);
                  setFormData({
                    ...formData,
                    engineerId: e.target.value,
                    engineerName: emp ? emp.name : formData.engineerName,
                  });
                }}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              >
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>{e.name} ({e.position})</option>
                ))}
              </select>
            </div>

            {/* Visit Date & Time */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Inspection Date
              </label>
              <input
                type="date"
                value={formData.visitDate}
                onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Inspection Time
              </label>
              <input
                type="text"
                value={formData.visitTime}
                onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })}
                placeholder="10:30 AM"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            {/* Work Stage & Progress */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Current Work Stage Verified
              </label>
              <input
                type="text"
                value={formData.currentWorkStage}
                onChange={(e) => setFormData({ ...formData, currentWorkStage: e.target.value })}
                placeholder="e.g. 5th floor beam & slab rebar binding"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Site Progress: {formData.progressPercent}%
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

            {/* Site Condition */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Site Condition &amp; Safety Environment
              </label>
              <input
                type="text"
                value={formData.siteCondition}
                onChange={(e) => setFormData({ ...formData, siteCondition: e.target.value })}
                placeholder="Good, dry weather, perimeter netting in place"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white"
              />
            </div>

            {/* Observation */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Engineer Observation <span className="text-orange-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={formData.observation}
                onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
                placeholder="Technical verification: bar spacing, concrete cover, lap length, formwork stability"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white"
              />
            </div>

            {/* Problems */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Discrepancies / Problems Found
              </label>
              <input
                type="text"
                value={formData.problems}
                onChange={(e) => setFormData({ ...formData, problems: e.target.value })}
                placeholder="e.g. Column C3 cover block missing"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            {/* Required Action */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Required Corrective Action
              </label>
              <input
                type="text"
                value={formData.requiredAction}
                onChange={(e) => setFormData({ ...formData, requiredAction: e.target.value })}
                placeholder="e.g. Fix 40mm cover block before concrete pour"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            {/* Next Visit Date */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Next Visit Date
              </label>
              <input
                type="date"
                value={formData.nextVisitDate}
                onChange={(e) => setFormData({ ...formData, nextVisitDate: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            {/* Engineer Allowance (Section 16) */}
            <div>
              <label className="text-xs font-semibold text-orange-400 block mb-1">
                Site Engineer Allowance (৳)
              </label>
              <input
                type="number"
                value={formData.engineerAllowance || ''}
                onChange={(e) => setFormData({ ...formData, engineerAllowance: parseFloat(e.target.value) || 0 })}
                placeholder="1500"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-bold"
              />
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
              {visitToEdit ? 'Save Changes' : 'Commit Site Visit & Allowance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
