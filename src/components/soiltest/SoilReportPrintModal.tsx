import React from 'react';
import { X, Printer, Layers, ShieldCheck } from 'lucide-react';
import { SoilTest } from '../../types';
import { useApp } from '../../context/AppContext';
import { SoilProfileChart } from './SoilProfileChart';

interface SoilReportPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  soilTest: SoilTest | null;
}

export const SoilReportPrintModal: React.FC<SoilReportPrintModalProps> = ({
  isOpen,
  onClose,
  soilTest,
}) => {
  const { currentCompany } = useApp();

  if (!isOpen || !soilTest) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-4xl rounded-2xl border border-slate-700 bg-white p-6 text-slate-900 shadow-2xl overflow-y-auto max-h-[95vh] print:p-0 print:border-none print:shadow-none print:w-full print:max-h-none">
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="rounded bg-orange-100 p-1.5 text-orange-700">
              <Layers className="h-4 w-4" />
            </span>
            <span className="text-sm font-bold text-slate-900">
              Printable Geotechnical Investigation Report (Section 23)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-500 shadow-sm"
            >
              <Printer className="h-4 w-4" />
              Print Official Report
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE GEOTECHNICAL REPORT BODY (Section 23) */}
        <div className="print-page border-2 border-slate-900 p-8 rounded-xl text-xs space-y-4">
          {/* Official Letterhead */}
          <div className="border-b-2 border-slate-900 pb-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 font-black text-white text-lg">
                HC
              </div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-slate-950">
                {currentCompany.name}
              </h1>
            </div>
            <p className="text-xs font-bold text-orange-600 uppercase tracking-widest">
              Geotechnical Investigation &amp; Subsoil Exploration Division
            </p>
            <p className="text-[11px] text-slate-600 mt-1">{currentCompany.address}</p>
            <p className="text-[10px] text-slate-500">
              Managing Director: {currentCompany.managingDirector} • DAP Reg: {currentCompany.dapRegNo || 'RAJUK/ENG-2024'}
            </p>
          </div>

          {/* Report Title */}
          <div className="flex items-center justify-between border-b border-slate-300 pb-2">
            <div>
              <span className="rounded bg-slate-900 px-2.5 py-1 text-[11px] font-black uppercase text-white tracking-wider">
                SUBSOIL INVESTIGATION REPORT
              </span>
              <p className="text-slate-600 text-[11px] mt-1">
                Ref No: <strong className="font-mono text-slate-900">{soilTest.testCode}</strong>
              </p>
            </div>
            <div className="text-right text-[11px]">
              <p><strong>Borehole No:</strong> <span className="font-bold text-orange-600">{soilTest.boreholeId}</span></p>
              <p><strong>Date of Boring:</strong> {soilTest.testDate}</p>
            </div>
          </div>

          {/* Project & Client Dossier */}
          <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-3 text-[11px] border border-slate-200">
            <div>
              <p><strong>Client / Landowner:</strong> {soilTest.clientName}</p>
              <p><strong>Project Name:</strong> {soilTest.projectName}</p>
              <p><strong>Project Location:</strong> {soilTest.location}</p>
            </div>
            <div>
              <p><strong>Total Exploration Depth:</strong> {soilTest.totalDepthFeet} ft ({(soilTest.totalDepthFeet * 0.3048).toFixed(1)} m)</p>
              <p><strong>In-situ Groundwater Level (GWT):</strong> {soilTest.groundwaterLevelFeet} ft below GL</p>
              <p><strong>Testing Standard:</strong> ASTM D1586 / BNBC 2020</p>
            </div>
          </div>

          {/* SPT Log Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-1 mb-2">
              1. Borehole Log &amp; Standard Penetration Resistance (SPT)
            </h3>
            <table className="w-full text-left text-[11px] border border-slate-300">
              <thead className="bg-slate-100 font-bold uppercase text-[10px]">
                <tr className="border-b border-slate-300">
                  <th className="p-1.5 border-r border-slate-300">Depth (ft)</th>
                  <th className="p-1.5 border-r border-slate-300">Sample ID</th>
                  <th className="p-1.5 border-r border-slate-300">Blow Counts (15cm intervals)</th>
                  <th className="p-1.5 border-r border-slate-300">SPT N-Value</th>
                  <th className="p-1.5 border-r border-slate-300">Visual Soil Stratigraphy</th>
                  <th className="p-1.5">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {soilTest.sptTable.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="p-1.5 border-r border-slate-300 font-bold">{row.depthFeet} ft</td>
                    <td className="p-1.5 border-r border-slate-300">{row.sampleNumber}</td>
                    <td className="p-1.5 border-r border-slate-300 font-mono">{row.blows}</td>
                    <td className="p-1.5 border-r border-slate-300 font-bold text-orange-600">{row.nValue}</td>
                    <td className="p-1.5 border-r border-slate-300">{row.soilDescription}</td>
                    <td className="p-1.5 text-slate-600">{row.remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Visual Soil Profile Chart */}
          <div className="pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-1 mb-2">
              2. Graphical Soil Profile &amp; Penetration Resistance Curve
            </h3>
            <SoilProfileChart
              sptTable={soilTest.sptTable}
              totalDepthFeet={soilTest.totalDepthFeet}
              groundwaterLevelFeet={soilTest.groundwaterLevelFeet}
            />
          </div>

          {/* Section 22: Engineer-Entered Recommendation */}
          <div className="rounded-xl border-2 border-slate-900 p-4 space-y-2 bg-slate-50">
            <h3 className="text-xs font-black uppercase text-slate-950">
              3. Geotechnical Engineering Recommendations (BNBC 2020)
            </h3>
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <p><strong>Recommended Substructure:</strong> <span className="font-bold text-slate-950">{soilTest.recommendation.recommendedFoundation}</span></p>
                <p><strong>Founding Level / Tip Depth:</strong> {soilTest.recommendation.recommendedFoundingDepthFeet} ft below existing GL</p>
                <p><strong>Allowable Bearing Capacity:</strong> {soilTest.recommendation.allowableBearingCapacityKsf} Ksf</p>
              </div>
              <div>
                <p><strong>Groundwater Consideration:</strong> {soilTest.recommendation.groundwaterConsideration}</p>
                <p><strong>Settlement Consideration:</strong> {soilTest.recommendation.settlementConsideration}</p>
              </div>
            </div>
            {soilTest.recommendation.specialNotes && (
              <p className="text-[11px] text-slate-800 border-t border-slate-300 pt-1.5 mt-1">
                <strong>Special Engineering Directives:</strong> {soilTest.recommendation.specialNotes}
              </p>
            )}
          </div>

          {/* Section 23 Signature Area */}
          <div className="mt-14 grid grid-cols-3 gap-6 pt-6 text-[11px] text-center border-t border-slate-300">
            <div>
              <p className="font-semibold">{soilTest.engineerName}</p>
              <div className="mt-1 border-t border-slate-900 pt-1 font-bold">
                Prepared by (Geotechnical Engr.)
              </div>
            </div>

            <div>
              <p className="font-semibold">Engr. Tanjil Hossain</p>
              <div className="mt-1 border-t border-slate-900 pt-1 font-bold">
                Checked by (Structural Division)
              </div>
            </div>

            <div>
              <p className="font-semibold">{currentCompany.managingDirector}</p>
              <div className="mt-1 border-t border-slate-900 pt-1 font-bold text-slate-950">
                Approved by (Managing Director)
              </div>
              <p className="text-[9px] text-slate-500 mt-0.5">{currentCompany.managingDirectorQualifications}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
