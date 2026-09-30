import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Search,
  Printer,
  Edit,
  Trash2,
  Eye,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SoilTest } from '../../types';
import { SoilTestFormModal } from './SoilTestFormModal';
import { SoilReportPrintModal } from './SoilReportPrintModal';

export const SoilTestManager: React.FC = () => {
  const { soilTests, deleteSoilTest } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [soilToEdit, setSoilToEdit] = useState<SoilTest | null>(null);
  const [printSoilTest, setPrintSoilTest] = useState<SoilTest | null>(null);
  const [soilToDelete, setSoilToDelete] = useState<SoilTest | null>(null);

  const filteredSoilTests = soilTests.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.testCode.toLowerCase().includes(q) ||
      s.projectName.toLowerCase().includes(q) ||
      s.clientName.toLowerCase().includes(q) ||
      s.boreholeId.toLowerCase().includes(q)
    );
  });

  const handleDeleteConfirm = async () => {
    if (soilToDelete) {
      await deleteSoilTest(soilToDelete.id);
      setSoilToDelete(null);
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl dark:text-white">
              Geotechnical Subsoil Investigation &amp; SPT Hub
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Sections 20–23: Standard Penetration Test logs, visual stratigraphy &amp; certified engineering recommendations
          </p>
        </div>

        <button
          onClick={() => {
            setSoilToEdit(null);
            setIsFormOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-orange-500 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>New Borehole Soil Test</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search soil tests by test code (HC-ST-2026-01), borehole (BH-01), project, or client..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSoilTests.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-300 py-12 text-center text-slate-400 dark:border-slate-800">
            <Layers className="mx-auto h-8 w-8 text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No geotechnical soil tests found</p>
          </div>
        ) : (
          filteredSoilTests.map((test) => (
            <div
              key={test.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700 dark:bg-orange-950/80 dark:text-orange-400">
                    {test.testCode}
                  </span>
                  <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-white">
                    {test.boreholeId}
                  </span>
                </div>

                <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                  {test.projectName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Client: <strong className="text-slate-700 dark:text-slate-300">{test.clientName}</strong>
                </p>

                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/40">
                  <p>Depth: <strong>{test.totalDepthFeet} ft</strong></p>
                  <p>GWT: <strong>{test.groundwaterLevelFeet} ft</strong></p>
                  <p>SPT Records: <strong>{test.sptTable.length} pts</strong></p>
                  <p>Date: <strong>{test.testDate}</strong></p>
                </div>

                <div className="mt-3 rounded-lg border border-orange-200 bg-orange-50/50 p-2.5 text-xs dark:border-orange-950 dark:bg-orange-950/20">
                  <span className="text-[10px] uppercase font-bold text-orange-800 dark:text-orange-300 block mb-0.5">
                    Recommended Substructure:
                  </span>
                  <p className="font-semibold text-slate-900 dark:text-white text-[11px]">
                    {test.recommendation.recommendedFoundation}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Founding Depth: {test.recommendation.recommendedFoundingDepthFeet} ft • Bearing: {test.recommendation.allowableBearingCapacityKsf} Ksf
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                <button
                  onClick={() => setPrintSoilTest(test)}
                  className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:underline dark:text-orange-400"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Soil Report</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setSoilToEdit(test);
                      setIsFormOpen(true);
                    }}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Edit Soil Test"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setSoilToDelete(test)}
                    className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600"
                    title="Delete Soil Test"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form Modal */}
      <SoilTestFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSoilToEdit(null);
        }}
        soilToEdit={soilToEdit}
      />

      {/* Printable Report Modal */}
      <SoilReportPrintModal
        isOpen={Boolean(printSoilTest)}
        onClose={() => setPrintSoilTest(null)}
        soilTest={printSoilTest}
      />

      {/* Delete Confirmation */}
      {soilToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-5 text-white shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-rose-600/20 p-2 text-rose-500">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">Delete Soil Test?</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-300">
              Are you sure you want to delete borehole investigation <strong>{soilToDelete.testCode}</strong> ({soilToDelete.boreholeId})?
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setSoilToDelete(null)}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-400 hover:bg-slate-800"
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
