import React, { useState } from 'react';
import {
  Calculator,
  RotateCcw,
  Printer,
  ChevronDown,
  CheckCircle2,
  FileSpreadsheet,
  Building,
  HardHat,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StaircaseEstimator: React.FC = () => {
  const { currentCompany } = useApp();

  // Inputs matching user's mobile screenshot
  const [lengthFt, setLengthFt] = useState<number>(16);
  const [lengthIn, setLengthIn] = useState<number>(4);
  const [widthFt, setWidthFt] = useState<number>(8);
  const [widthIn, setWidthIn] = useState<number>(0);
  const [waistThicknessIn, setWaistThicknessIn] = useState<number>(6);
  const [mixRatio, setMixRatio] = useState<string>('1:1.5:3');

  const [noOfRisers, setNoOfRisers] = useState<number>(20);
  const [noOfTreads, setNoOfTreads] = useState<number>(19);
  const [riserHeightIn, setRiserHeightIn] = useState<number>(5.54);
  const [treadWidthIn, setTreadWidthIn] = useState<number>(10);

  const [mainBarDia, setMainBarDia] = useState<number>(12);
  const [mainBarSpacingIn, setMainBarSpacingIn] = useState<number>(5);

  const [distBarDia, setDistBarDia] = useState<number>(10);
  const [distBarSpacingIn, setDistBarSpacingIn] = useState<number>(5);

  const [baseType, setBaseType] = useState<string>('none');

  const [cementRate, setCementRate] = useState<number>(550);
  const [sandRate, setSandRate] = useState<number>(45);
  const [aggregateRate, setAggregateRate] = useState<number>(120);
  const [rebarRate, setRebarRate] = useState<number>(95);

  // Calculation Results state
  const [calculated, setCalculated] = useState<boolean>(true);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // Auto calculate
  const totalLengthFt = lengthFt + lengthIn / 12;
  const totalWidthFt = widthFt + widthIn / 12;
  const waistThicknessFt = waistThicknessIn / 12;

  // Waist slab volume (cft)
  const waistVolume = totalLengthFt * totalWidthFt * waistThicknessFt;

  // Steps triangular prism volume (cft): (0.5 * Riser * Tread) * Width * No. of Treads
  const stepAreaSqFt = 0.5 * (riserHeightIn / 12) * (treadWidthIn / 12);
  const stepsVolume = stepAreaSqFt * totalWidthFt * noOfTreads;

  // Landing / Base extra volume if any
  let baseVolume = 0;
  if (baseType === 'soling') baseVolume = totalLengthFt * totalWidthFt * 0.25;
  if (baseType === 'mass') baseVolume = totalLengthFt * totalWidthFt * 0.5;

  const totalWetVolume = waistVolume + stepsVolume + baseVolume;
  const dryFactor = 1.54;
  const dryVolume = totalWetVolume * dryFactor;

  // Mix Ratio parts
  const ratioParts = mixRatio.split(':').map((p) => parseFloat(p));
  const cementPart = ratioParts[0] || 1;
  const sandPart = ratioParts[1] || 1.5;
  const aggPart = ratioParts[2] || 3;
  const sumRatio = cementPart + sandPart + aggPart;

  // Material Quantities
  // 1 Bag cement = 1.25 CFT
  const cementCft = (dryVolume * cementPart) / sumRatio;
  const cementBags = Math.ceil(cementCft / 1.25);

  const sandCft = Math.round(((dryVolume * sandPart) / sumRatio) * 10) / 10;
  const aggCft = Math.round(((dryVolume * aggPart) / sumRatio) * 10) / 10;

  // Rebar Calculations
  // Main bars run along length: number of bars = (width in inches / spacing) + 1
  const mainBarsCount = Math.ceil((totalWidthFt * 12) / mainBarSpacingIn) + 1;
  const mainBarLengthEachFt = totalLengthFt * 1.15; // 15% extra for crank, overlaps & development length
  const totalMainBarLengthFt = mainBarsCount * mainBarLengthEachFt;
  // Weight in kg = (D^2 / 533) * Length in feet
  const mainBarWeightKg = Math.round((Math.pow(mainBarDia, 2) / 533) * totalMainBarLengthFt * 10) / 10;

  // Distribution bars run along width: number of bars = (length in inches / spacing) + 1
  const distBarsCount = Math.ceil((totalLengthFt * 12) / distBarSpacingIn) + 1;
  const distBarLengthEachFt = totalWidthFt * 1.05;
  const totalDistBarLengthFt = distBarsCount * distBarLengthEachFt;
  const distBarWeightKg = Math.round((Math.pow(distBarDia, 2) / 533) * totalDistBarLengthFt * 10) / 10;

  const totalRebarKg = Math.round((mainBarWeightKg + distBarWeightKg) * 10) / 10;

  // Costs
  const costCement = cementBags * cementRate;
  const costSand = Math.round(sandCft * sandRate);
  const costAggregate = Math.round(aggCft * aggregateRate);
  const costRebar = Math.round(totalRebarKg * rebarRate);
  const totalMaterialCost = costCement + costSand + costAggregate + costRebar;

  const handleReset = () => {
    setLengthFt(16);
    setLengthIn(4);
    setWidthFt(8);
    setWidthIn(0);
    setWaistThicknessIn(6);
    setMixRatio('1:1.5:3');
    setNoOfRisers(20);
    setNoOfTreads(19);
    setRiserHeightIn(5.54);
    setTreadWidthIn(10);
    setMainBarDia(12);
    setMainBarSpacingIn(5);
    setDistBarDia(10);
    setDistBarSpacingIn(5);
    setBaseType('none');
    setCementRate(550);
    setSandRate(45);
    setAggregateRate(120);
    setRebarRate(95);
  };

  return (
    <div className="mx-auto max-w-2xl pb-16">
      {/* Top Hairline Amber Accent matching Screenshot */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500 rounded-t-lg mb-3 shadow-[0_0_12px_rgba(245,158,11,0.5)]" />

      {/* Main Container */}
      <div className="rounded-2xl border border-[#1E2D48] bg-[#0C1524] p-4 sm:p-6 shadow-2xl text-slate-100">
        {/* Title Header */}
        <div className="text-center pb-2 border-b border-[#1E2D48]">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            Staircase Estimate
          </h1>
          <p className="text-xs text-slate-400 font-medium tracking-wide mt-0.5">
            Concrete + Rebar + Cost
          </p>
        </div>

        {/* Section 1: Stair Dimensions */}
        <div className="blueprint-section-title">Stair Dimensions</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Length (ft — in)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={lengthFt}
                onChange={(e) => setLengthFt(parseFloat(e.target.value) || 0)}
                placeholder="ft"
                className="blueprint-input w-full px-3 py-2 text-sm text-center"
              />
              <input
                type="number"
                value={lengthIn}
                onChange={(e) => setLengthIn(parseFloat(e.target.value) || 0)}
                placeholder="in"
                className="blueprint-input w-full px-3 py-2 text-sm text-center"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Width (ft — in)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={widthFt}
                onChange={(e) => setWidthFt(parseFloat(e.target.value) || 0)}
                placeholder="ft"
                className="blueprint-input w-full px-3 py-2 text-sm text-center"
              />
              <input
                type="number"
                value={widthIn}
                onChange={(e) => setWidthIn(parseFloat(e.target.value) || 0)}
                placeholder="in"
                className="blueprint-input w-full px-3 py-2 text-sm text-center"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Waist Thickness (in)
            </label>
            <input
              type="number"
              value={waistThicknessIn}
              onChange={(e) => setWaistThicknessIn(parseFloat(e.target.value) || 0)}
              className="blueprint-input w-full px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Mix Ratio
            </label>
            <div className="relative">
              <select
                value={mixRatio}
                onChange={(e) => setMixRatio(e.target.value)}
                className="blueprint-input w-full px-3 py-2 text-sm appearance-none pr-8 cursor-pointer"
              >
                <option value="1:1.5:3">1 : 1.5 : 3 (M20 Structural)</option>
                <option value="1:2:4">1 : 2 : 4 (M15 Standard)</option>
                <option value="1:1:2">1 : 1 : 2 (M25 Heavy Duty)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Section 2: Steps */}
        <div className="blueprint-section-title">Steps</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              No. of Risers
            </label>
            <input
              type="number"
              value={noOfRisers}
              onChange={(e) => setNoOfRisers(parseInt(e.target.value) || 0)}
              className="blueprint-input w-full px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              No. of Treads
            </label>
            <input
              type="number"
              value={noOfTreads}
              onChange={(e) => setNoOfTreads(parseInt(e.target.value) || 0)}
              className="blueprint-input w-full px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Riser Height (in)
            </label>
            <input
              type="number"
              step="0.01"
              value={riserHeightIn}
              onChange={(e) => setRiserHeightIn(parseFloat(e.target.value) || 0)}
              className="blueprint-input w-full px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Tread Width (in)
            </label>
            <input
              type="number"
              value={treadWidthIn}
              onChange={(e) => setTreadWidthIn(parseFloat(e.target.value) || 0)}
              className="blueprint-input w-full px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Section 3: Main Reinforcement */}
        <div className="blueprint-section-title">Main Reinforcement</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Bar Ø (mm)
            </label>
            <input
              type="number"
              value={mainBarDia}
              onChange={(e) => setMainBarDia(parseFloat(e.target.value) || 0)}
              className="blueprint-input w-full px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Spacing (in)
            </label>
            <input
              type="number"
              value={mainBarSpacingIn}
              onChange={(e) => setMainBarSpacingIn(parseFloat(e.target.value) || 0)}
              className="blueprint-input w-full px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Section 4: Distribution Bars */}
        <div className="blueprint-section-title">Distribution Bars</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Bar Ø (mm)
            </label>
            <input
              type="number"
              value={distBarDia}
              onChange={(e) => setDistBarDia(parseFloat(e.target.value) || 0)}
              className="blueprint-input w-full px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Spacing (in)
            </label>
            <input
              type="number"
              value={distBarSpacingIn}
              onChange={(e) => setDistBarSpacingIn(parseFloat(e.target.value) || 0)}
              className="blueprint-input w-full px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Section 5: Base / Filling Type */}
        <div className="blueprint-section-title">Base / Filling Type</div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Select Type
          </label>
          <div className="relative">
            <select
              value={baseType}
              onChange={(e) => setBaseType(e.target.value)}
              className="blueprint-input w-full px-3 py-2 text-sm appearance-none pr-8 cursor-pointer"
            >
              <option value="none">— None —</option>
              <option value="soling">Brick Flat Soling (BFS)</option>
              <option value="sand">Sand Filling 3&quot;</option>
              <option value="mass">Mass Concrete Cushion</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Section 6: Material Rates */}
        <div className="blueprint-section-title">Material Rates (৳)</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Cement (per bag)
            </label>
            <input
              type="number"
              value={cementRate}
              onChange={(e) => setCementRate(parseFloat(e.target.value) || 0)}
              className="blueprint-input w-full px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Local Sand (per cft)
            </label>
            <input
              type="number"
              value={sandRate}
              onChange={(e) => setSandRate(parseFloat(e.target.value) || 0)}
              className="blueprint-input w-full px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Aggregate (per cft)
            </label>
            <input
              type="number"
              value={aggregateRate}
              onChange={(e) => setAggregateRate(parseFloat(e.target.value) || 0)}
              className="blueprint-input w-full px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Rebar (per kg)
            </label>
            <input
              type="number"
              value={rebarRate}
              onChange={(e) => setRebarRate(parseFloat(e.target.value) || 0)}
              className="blueprint-input w-full px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Action Buttons matching screenshot */}
        <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-[#1E2D48]">
          <button
            type="button"
            onClick={handleReset}
            className="w-full py-2.5 px-4 rounded-xl border border-cyan-700/60 bg-transparent text-cyan-400 font-semibold text-sm hover:bg-cyan-950/30 active:scale-98 transition flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          <button
            type="button"
            onClick={() => setCalculated(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-[#00c2cb] hover:bg-[#00adb5] text-slate-950 font-bold text-sm shadow-md shadow-cyan-950/40 active:scale-98 transition flex items-center justify-center gap-1.5"
          >
            <Calculator className="w-4 h-4 text-slate-950" />
            Calculate
          </button>
        </div>

        {/* Calculated Results Panel */}
        {calculated && (
          <div className="mt-8 pt-6 border-t-2 border-dashed border-[#1E2D48] animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <h3 className="font-bold text-white text-base">
                  Estimation Bill of Quantities (BOQ)
                </h3>
              </div>
              <button
                onClick={() => setShowPrintModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 text-xs font-semibold hover:bg-cyan-900/50 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                Print BOQ Sheet
              </button>
            </div>

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4 text-center">
              <div className="bg-[#121E31] p-3 rounded-xl border border-[#1E2E4A]">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Dry Concrete</div>
                <div className="text-lg font-black text-cyan-300">{dryVolume.toFixed(1)} <span className="text-xs font-normal">CFT</span></div>
              </div>
              <div className="bg-[#121E31] p-3 rounded-xl border border-[#1E2E4A]">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Cement Required</div>
                <div className="text-lg font-black text-amber-300">{cementBags} <span className="text-xs font-normal">Bags</span></div>
              </div>
              <div className="bg-[#121E31] p-3 rounded-xl border border-[#1E2E4A]">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Rebar</div>
                <div className="text-lg font-black text-emerald-300">{totalRebarKg} <span className="text-xs font-normal">KG</span></div>
              </div>
              <div className="bg-[#121E31] p-3 rounded-xl border border-[#1E2E4A]">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Estimated Cost</div>
                <div className="text-lg font-black text-orange-400">৳ {totalMaterialCost.toLocaleString()}</div>
              </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-[#121E31] rounded-xl border border-[#1E2E4A] overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#16253C] text-slate-400 font-semibold border-b border-[#1E2E4A]">
                  <tr>
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3">Quantity</th>
                    <th className="py-2.5 px-3">Unit Rate</th>
                    <th className="py-2.5 px-3 text-right">Amount (৳)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2E4A] text-slate-200">
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-white">Portland Composite Cement</td>
                    <td className="py-2.5 px-3">{cementBags} Bags</td>
                    <td className="py-2.5 px-3">৳ {cementRate} / bag</td>
                    <td className="py-2.5 px-3 text-right font-bold text-amber-300">৳ {costCement.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-white">Sylhet / Local Sand (FM 1.5 - 2.5)</td>
                    <td className="py-2.5 px-3">{sandCft} CFT</td>
                    <td className="py-2.5 px-3">৳ {sandRate} / cft</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-200">৳ {costSand.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-white">Stone / Brick Crushed Aggregate</td>
                    <td className="py-2.5 px-3">{aggCft} CFT</td>
                    <td className="py-2.5 px-3">৳ {aggregateRate} / cft</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-200">৳ {costAggregate.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-white">
                      <div>500W Deformed Rebar Steel</div>
                      <div className="text-[10px] text-slate-400">
                        Main: Ø{mainBarDia}mm ({mainBarWeightKg}kg) + Dist: Ø{distBarDia}mm ({distBarWeightKg}kg)
                      </div>
                    </td>
                    <td className="py-2.5 px-3">{totalRebarKg} KG</td>
                    <td className="py-2.5 px-3">৳ {rebarRate} / kg</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-300">৳ {costRebar.toLocaleString()}</td>
                  </tr>
                </tbody>
                <tfoot className="bg-[#182840] font-bold text-white border-t border-[#1E2E4A]">
                  <tr>
                    <td colSpan={3} className="py-3 px-3 text-cyan-300 uppercase tracking-wider">
                      Total Estimated Material Cost
                    </td>
                    <td className="py-3 px-3 text-right text-base text-orange-400">
                      ৳ {totalMaterialCost.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Official Print Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-white text-slate-900 p-6 shadow-2xl print-page">
            {/* Hybrid Civil Letterhead */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {currentCompany.name.toUpperCase()}
                </h2>
                <p className="text-xs text-slate-600 font-semibold">{currentCompany.slogan}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{currentCompany.address}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                  Structural Estimate
                </span>
                <p className="text-xs text-slate-500 mt-1">Date: {new Date().toLocaleDateString('en-GB')}</p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                Staircase Concrete &amp; Reinforcement BOQ Sheet
              </h3>
              <p className="text-xs text-slate-600">
                Dimensions: {lengthFt}&apos;{lengthIn}&quot; × {widthFt}&apos;{widthIn}&quot; | Steps: {noOfRisers} Risers, {noOfTreads} Treads | Mix: {mixRatio}
              </p>
            </div>

            <table className="w-full text-xs text-left border border-slate-200 mb-4">
              <thead className="bg-slate-100 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2">Material</th>
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Rate</th>
                  <th className="p-2 text-right">Cost (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2 font-medium">Portland Cement (50 kg bag)</td>
                  <td className="p-2">{cementBags} Bags</td>
                  <td className="p-2">৳ {cementRate}</td>
                  <td className="p-2 text-right font-semibold">৳ {costCement.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Local Sand</td>
                  <td className="p-2">{sandCft} CFT</td>
                  <td className="p-2">৳ {sandRate}</td>
                  <td className="p-2 text-right font-semibold">৳ {costSand.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Coarse Aggregate</td>
                  <td className="p-2">{aggCft} CFT</td>
                  <td className="p-2">৳ {aggregateRate}</td>
                  <td className="p-2 text-right font-semibold">৳ {costAggregate.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">500W Rebar (Ø{mainBarDia}mm &amp; Ø{distBarDia}mm)</td>
                  <td className="p-2">{totalRebarKg} KG</td>
                  <td className="p-2">৳ {rebarRate}</td>
                  <td className="p-2 text-right font-semibold">৳ {costRebar.toLocaleString()}</td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t border-slate-300">
                <tr>
                  <td colSpan={3} className="p-2 text-slate-800">Total Material Estimation:</td>
                  <td className="p-2 text-right text-sm text-slate-900 font-black">
                    ৳ {totalMaterialCost.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Signatures */}
            <div className="flex justify-between items-end pt-8 mt-4 border-t border-slate-200 text-xs">
              <div>
                <p className="font-bold text-slate-800">Prepared By:</p>
                <p className="text-slate-500">Estimating Civil Engineer</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900">{currentCompany.managingDirector}</p>
                <p className="text-slate-600 font-medium">{currentCompany.managingDirectorQualifications}</p>
                <p className="text-[10px] text-slate-400">Managing Director &amp; Structural Specialist</p>
              </div>
            </div>

            {/* Print & Close Controls */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 no-print">
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5 shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
