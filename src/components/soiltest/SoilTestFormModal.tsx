import React, { useState, useEffect } from 'react';
import { X, Layers, Save, Plus, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';
import { SoilTest, SPTRecord, SoilRecommendation } from '../../types';
import { useApp } from '../../context/AppContext';

interface SoilTestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  soilToEdit?: SoilTest | null;
  projectId?: string;
  clientId?: string;
}

export const SoilTestFormModal: React.FC<SoilTestFormModalProps> = ({
  isOpen,
  onClose,
  soilToEdit,
  projectId,
  clientId,
}) => {
  const { currentCompany, projects, clients, saveSoilTest, soilTests } = useApp();

  const [formData, setFormData] = useState({
    projectId: projectId || '',
    clientId: clientId || '',
    location: '',
    boreholeId: 'BH-01',
    groundLevelFeet: 0.0,
    groundwaterLevelFeet: 8.5,
    totalDepthFeet: 50,
    testDate: new Date().toISOString().slice(0, 10),
    laboratory: 'Hybrid Civil Geotechnical Testing Laboratory',
    engineerName: currentCompany.managingDirector,
    notes: 'Wash boring method carried out using standard split-spoon sampler (ASTM D1586).',
  });

  const [sptRows, setSptRows] = useState<SPTRecord[]>([
    { depthFeet: 5, sampleNumber: 'SS-01', blows: '2-3-4', nValue: 7, soilDescription: 'Soft dark grey clayey silt', sampleType: 'Split Spoon', remarks: 'High compressibility' },
    { depthFeet: 10, sampleNumber: 'SS-02', blows: '3-5-6', nValue: 11, soilDescription: 'Grey medium stiff silty clay', sampleType: 'Split Spoon', remarks: 'Water table struck' },
    { depthFeet: 15, sampleNumber: 'SS-03', blows: '5-7-9', nValue: 16, soilDescription: 'Light brown medium dense fine sand', sampleType: 'Split Spoon', remarks: 'Firm layer' },
    { depthFeet: 20, sampleNumber: 'SS-04', blows: '7-10-12', nValue: 22, soilDescription: 'Dense silty fine sand', sampleType: 'Split Spoon', remarks: 'Good bearing' },
    { depthFeet: 25, sampleNumber: 'SS-05', blows: '10-14-16', nValue: 30, soilDescription: 'Very dense yellowish brown sand', sampleType: 'Split Spoon', remarks: 'Stable strata' },
  ]);

  const [recommendation, setRecommendation] = useState<SoilRecommendation>({
    recommendedFoundation: 'Cast-in-situ RCC Bored Pile Foundation',
    recommendedFoundingDepthFeet: 45,
    allowableBearingCapacityKsf: 4.5,
    groundwaterConsideration: 'Groundwater struck at 8.5 ft. Submerged pile boring requires bentonite slurry circulation.',
    settlementConsideration: 'Calculated differential settlement is within BNBC 2020 permissible limits (<25mm).',
    soilImprovement: 'No chemical grouting needed if pile tips reach dense sand layer below 40 ft.',
    specialNotes: 'Shallow isolated footings strictly discouraged due to soft silty clay top layers (N=7 to 11). Estimated working load of 600mm dia pile is 100 MT.',
    approvedByEngineer: currentCompany.managingDirector,
    approvalDate: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    if (soilToEdit) {
      setFormData({
        projectId: soilToEdit.projectId,
        clientId: soilToEdit.clientId,
        location: soilToEdit.location,
        boreholeId: soilToEdit.boreholeId,
        groundLevelFeet: soilToEdit.groundLevelFeet,
        groundwaterLevelFeet: soilToEdit.groundwaterLevelFeet,
        totalDepthFeet: soilToEdit.totalDepthFeet,
        testDate: soilToEdit.testDate,
        laboratory: soilToEdit.laboratory,
        engineerName: soilToEdit.engineerName,
        notes: soilToEdit.notes || '',
      });
      setSptRows(soilToEdit.sptTable || []);
      setRecommendation(soilToEdit.recommendation);
    } else {
      const defaultProj = projects.find((p) => p.id === projectId) || projects[0];
      setFormData({
        projectId: defaultProj ? defaultProj.id : '',
        clientId: defaultProj ? defaultProj.clientId : clients[0]?.id || '',
        location: defaultProj ? defaultProj.projectLocation : 'Plot Site',
        boreholeId: `BH-0${soilTests.length + 1}`,
        groundLevelFeet: 0.0,
        groundwaterLevelFeet: 8.5,
        totalDepthFeet: 50,
        testDate: new Date().toISOString().slice(0, 10),
        laboratory: 'Hybrid Civil Geotechnical Testing Laboratory',
        engineerName: currentCompany.managingDirector,
        notes: 'Wash boring method carried out using standard split-spoon sampler (ASTM D1586).',
      });
    }
  }, [soilToEdit, projectId, clientId, isOpen, projects, clients, soilTests.length, currentCompany.managingDirector]);

  if (!isOpen) return null;

  // Add 5 ft interval entry
  const handleAdd5ftRow = () => {
    const lastDepth = sptRows.length > 0 ? sptRows[sptRows.length - 1].depthFeet : 0;
    const nextDepth = lastDepth + 5;
    const nextSampleNum = `SS-${String(sptRows.length + 1).padStart(2, '0')}`;
    const newRow: SPTRecord = {
      depthFeet: nextDepth,
      sampleNumber: nextSampleNum,
      blows: '6-9-12',
      nValue: 21,
      soilDescription: 'Dense silty fine sand with mica flakes',
      sampleType: 'Split Spoon',
      remarks: 'Standard testing depth',
    };
    setSptRows([...sptRows, newRow]);
  };

  const handleUpdateRow = (idx: number, field: keyof SPTRecord, value: string | number) => {
    const updated = [...sptRows];
    updated[idx] = { ...updated[idx], [field]: value };
    setSptRows(updated);
  };

  const handleDeleteRow = (idx: number) => {
    setSptRows(sptRows.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectId) return;

    const proj = projects.find((p) => p.id === formData.projectId);
    const client = clients.find((c) => c.id === formData.clientId) || (proj ? clients.find((c) => c.id === proj.clientId) : undefined);
    const nextTestCode = `HC-ST-${new Date().getFullYear()}-${String(soilTests.length + 1).padStart(2, '0')}`;

    const payload: SoilTest = {
      id: soilToEdit ? soilToEdit.id : `st-${Date.now()}`,
      companyId: currentCompany.id,
      testCode: soilToEdit ? soilToEdit.testCode : nextTestCode,
      clientId: client ? client.id : (proj ? proj.clientId : 'cli-001'),
      clientName: client ? client.name : (proj ? proj.clientName : 'Client'),
      projectId: formData.projectId,
      projectName: proj ? proj.name : 'Project',
      location: formData.location.trim(),
      boreholeId: formData.boreholeId.trim(),
      groundLevelFeet: Number(formData.groundLevelFeet) || 0,
      groundwaterLevelFeet: Number(formData.groundwaterLevelFeet) || 0,
      totalDepthFeet: Number(formData.totalDepthFeet) || 50,
      testDate: formData.testDate,
      laboratory: formData.laboratory.trim(),
      engineerName: formData.engineerName.trim(),
      notes: formData.notes.trim() || undefined,
      sptTable: sptRows,
      recommendation,
      createdAt: soilToEdit ? soilToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveSoilTest(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-4xl rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl overflow-y-auto max-h-[92vh]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white font-bold">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {soilToEdit ? 'Edit Geotechnical Investigation' : 'New Soil Investigation & Borehole SPT'}
              </h3>
              <p className="text-xs text-slate-400">Sections 20, 21, 22: ASTM D1586 Borehole logging &amp; engineering recommendation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          {/* Top Parameters */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Target Project</label>
              <select
                value={formData.projectId}
                onChange={(e) => {
                  const p = projects.find((pr) => pr.id === e.target.value);
                  setFormData({
                    ...formData,
                    projectId: e.target.value,
                    clientId: p ? p.clientId : formData.clientId,
                    location: p ? p.projectLocation : formData.location,
                  });
                }}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.projectLocation})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Borehole ID</label>
              <input
                type="text"
                value={formData.boreholeId}
                onChange={(e) => setFormData({ ...formData, boreholeId: e.target.value })}
                placeholder="BH-01"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Testing Date</label>
              <input
                type="date"
                value={formData.testDate}
                onChange={(e) => setFormData({ ...formData, testDate: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Total Boring Depth (ft)</label>
              <input
                type="number"
                value={formData.totalDepthFeet || ''}
                onChange={(e) => setFormData({ ...formData, totalDepthFeet: parseFloat(e.target.value) || 0 })}
                placeholder="50"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white font-bold"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Groundwater Level (GWT ft)</label>
              <input
                type="number"
                step="0.1"
                value={formData.groundwaterLevelFeet || ''}
                onChange={(e) => setFormData({ ...formData, groundwaterLevelFeet: parseFloat(e.target.value) || 0 })}
                placeholder="8.5"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Supervising Engineer</label>
              <input
                type="text"
                value={formData.engineerName}
                onChange={(e) => setFormData({ ...formData, engineerName: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white"
              />
            </div>
          </div>

          {/* SPT Table with 5 ft interval entry */}
          <div className="space-y-2 border-t border-slate-800 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                  Standard Penetration Test (SPT) Log Table (Section 20)
                </h4>
                <p className="text-[11px] text-slate-400">5 ft standard interval entries with blow counts and N-values</p>
              </div>

              <button
                type="button"
                onClick={handleAdd5ftRow}
                className="flex items-center gap-1 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-500"
              >
                <Plus className="h-3.5 w-3.5" />
                Add +5 ft Interval Entry
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/80 text-[10px] font-bold text-slate-400 uppercase">
                  <tr>
                    <th className="px-2.5 py-2">Depth (ft)</th>
                    <th className="px-2.5 py-2">Sample ID</th>
                    <th className="px-2.5 py-2">Blows</th>
                    <th className="px-2.5 py-2">N-Value</th>
                    <th className="px-2.5 py-2">Visual Soil Description</th>
                    <th className="px-2.5 py-2">Type</th>
                    <th className="px-2.5 py-2 text-right">Del</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {sptRows.map((row, idx) => (
                    <tr key={idx} className="bg-slate-900/60">
                      <td className="px-2 py-1.5 w-20">
                        <input
                          type="number"
                          value={row.depthFeet}
                          onChange={(e) => handleUpdateRow(idx, 'depthFeet', parseFloat(e.target.value) || 0)}
                          className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-white"
                        />
                      </td>
                      <td className="px-2 py-1.5 w-24">
                        <input
                          type="text"
                          value={row.sampleNumber}
                          onChange={(e) => handleUpdateRow(idx, 'sampleNumber', e.target.value)}
                          className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-white"
                        />
                      </td>
                      <td className="px-2 py-1.5 w-24">
                        <input
                          type="text"
                          value={row.blows}
                          onChange={(e) => handleUpdateRow(idx, 'blows', e.target.value)}
                          placeholder="3-5-6"
                          className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-white"
                        />
                      </td>
                      <td className="px-2 py-1.5 w-20">
                        <input
                          type="number"
                          value={row.nValue}
                          onChange={(e) => handleUpdateRow(idx, 'nValue', parseInt(e.target.value) || 0)}
                          className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-orange-400 font-bold"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="text"
                          value={row.soilDescription}
                          onChange={(e) => handleUpdateRow(idx, 'soilDescription', e.target.value)}
                          placeholder="e.g. Medium dense silty fine sand"
                          className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-white"
                        />
                      </td>
                      <td className="px-2 py-1.5 w-28">
                        <select
                          value={row.sampleType}
                          onChange={(e) => handleUpdateRow(idx, 'sampleType', e.target.value as typeof row.sampleType)}
                          className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-white"
                        >
                          <option value="Split Spoon">Split Spoon</option>
                          <option value="Shelby Tube">Shelby Tube</option>
                          <option value="Grab">Grab</option>
                        </select>
                      </td>
                      <td className="px-2 py-1.5 text-right w-10">
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(idx)}
                          className="p-1 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 22: Engineer-Authorized Manual Recommendations */}
          <div className="rounded-xl border border-orange-500/30 bg-orange-950/20 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-orange-400" />
              <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                Geotechnical Recommendation (Engineer-Authorized Entry - Section 22)
              </h4>
            </div>
            <p className="text-[11px] text-slate-400">
              Per Section 22 requirements: Foundation recommendations are editable and strictly identified as engineer-approved (never blindly automated).
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-300 block mb-1">Recommended Foundation Type</label>
                <input
                  type="text"
                  value={recommendation.recommendedFoundation}
                  onChange={(e) => setRecommendation({ ...recommendation, recommendedFoundation: e.target.value })}
                  placeholder="e.g. Cast-in-situ RCC Bored Pile Foundation"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Founding Depth (ft)</label>
                <input
                  type="number"
                  value={recommendation.recommendedFoundingDepthFeet || ''}
                  onChange={(e) => setRecommendation({ ...recommendation, recommendedFoundingDepthFeet: parseFloat(e.target.value) || 0 })}
                  placeholder="45"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Allowable Bearing Capacity (Ksf)</label>
                <input
                  type="number"
                  step="0.1"
                  value={recommendation.allowableBearingCapacityKsf || ''}
                  onChange={(e) => setRecommendation({ ...recommendation, allowableBearingCapacityKsf: parseFloat(e.target.value) || 0 })}
                  placeholder="4.5"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-300 block mb-1">Groundwater Considerations</label>
                <input
                  type="text"
                  value={recommendation.groundwaterConsideration}
                  onChange={(e) => setRecommendation({ ...recommendation, groundwaterConsideration: e.target.value })}
                  placeholder="e.g. High water table at 8.5 ft requires bentonite slurry"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="font-semibold text-slate-300 block mb-1">Special Engineering Directives &amp; Warnings</label>
                <textarea
                  rows={2}
                  value={recommendation.specialNotes}
                  onChange={(e) => setRecommendation({ ...recommendation, specialNotes: e.target.value })}
                  placeholder="Specific pile capacity notes, settlement limits, BNBC 2020 adherence..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Approved By Engineer</label>
                <input
                  type="text"
                  value={recommendation.approvedByEngineer}
                  onChange={(e) => setRecommendation({ ...recommendation, approvedByEngineer: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Approval Date</label>
                <input
                  type="date"
                  value={recommendation.approvalDate}
                  onChange={(e) => setRecommendation({ ...recommendation, approvalDate: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white"
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
              Save Geotechnical Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
