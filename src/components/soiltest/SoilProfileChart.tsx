import React from 'react';
import { SPTRecord } from '../../types';

interface SoilProfileChartProps {
  sptTable: SPTRecord[];
  totalDepthFeet: number;
  groundwaterLevelFeet: number;
}

export const SoilProfileChart: React.FC<SoilProfileChartProps> = ({
  sptTable,
  totalDepthFeet,
  groundwaterLevelFeet,
}) => {
  if (!sptTable || sptTable.length === 0) {
    return <div className="text-xs text-slate-400 p-4">No SPT data points available.</div>;
  }

  // Calculate max N value for scaling the N-curve
  const maxN = Math.max(...sptTable.map((s) => s.nValue), 50);

  // SVG dimensions
  const svgWidth = 520;
  const svgHeight = 360;
  const margin = { top: 30, right: 30, bottom: 30, left: 160 };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;

  // Scale functions
  const maxDepth = Math.max(totalDepthFeet, ...sptTable.map((s) => s.depthFeet));
  const depthToY = (depth: number) => margin.top + (depth / maxDepth) * graphHeight;
  const nToX = (n: number) => margin.left + (n / maxN) * graphWidth;

  // Points string for SVG polyline
  const points = sptTable
    .map((s) => `${nToX(s.nValue)},${depthToY(s.depthFeet)}`)
    .join(' ');

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-white overflow-x-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider">
          Borehole Soil Stratigraphy &amp; SPT N-Value Profile
        </h4>
        <span className="text-[11px] text-slate-400 font-mono">
          GWT: {groundwaterLevelFeet} ft | Depth: {totalDepthFeet} ft
        </span>
      </div>

      <div className="min-w-[500px]">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
          {/* Background grid lines */}
          {[0, 10, 20, 30, 40, 50].map((n) => (
            <g key={`grid-n-${n}`}>
              <line
                x1={nToX(n)}
                y1={margin.top}
                x2={nToX(n)}
                y2={svgHeight - margin.bottom}
                stroke="#334155"
                strokeDasharray="2,2"
              />
              <text
                x={nToX(n)}
                y={margin.top - 8}
                fill="#94a3b8"
                fontSize="9"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                N={n}
              </text>
            </g>
          ))}

          {/* Groundwater level line */}
          {groundwaterLevelFeet > 0 && groundwaterLevelFeet <= maxDepth && (
            <g>
              <line
                x1={margin.left}
                y1={depthToY(groundwaterLevelFeet)}
                x2={svgWidth - margin.right}
                y2={depthToY(groundwaterLevelFeet)}
                stroke="#0284c7"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
              <text
                x={svgWidth - margin.right - 4}
                y={depthToY(groundwaterLevelFeet) - 4}
                fill="#38bdf8"
                fontSize="9"
                textAnchor="end"
                fontWeight="bold"
              >
                ▼ GWT ({groundwaterLevelFeet} ft)
              </text>
            </g>
          )}

          {/* Left: Soil Layer Stratigraphy Rectangles */}
          {sptTable.map((s, idx) => {
            const prevDepth = idx === 0 ? 0 : sptTable[idx - 1].depthFeet;
            const topY = depthToY(prevDepth);
            const botY = depthToY(s.depthFeet);
            const height = Math.max(4, botY - topY);

            // Alternate layer tint
            const isClay = s.soilDescription.toLowerCase().includes('clay');
            const isSand = s.soilDescription.toLowerCase().includes('sand');
            const layerFill = isClay ? '#475569' : isSand ? '#ca8a04' : '#64748b';

            return (
              <g key={`layer-${s.depthFeet}`}>
                <rect
                  x="15"
                  y={topY}
                  width="130"
                  height={height}
                  fill={layerFill}
                  fillOpacity="0.4"
                  stroke="#334155"
                  strokeWidth="1"
                />
                <text
                  x="20"
                  y={topY + height / 2 + 3}
                  fill="#f1f5f9"
                  fontSize="8"
                  fontWeight="600"
                  fontFamily="sans-serif"
                >
                  {s.depthFeet} ft: {s.soilDescription.slice(0, 18)}...
                </text>
              </g>
            );
          })}

          {/* Depth Axis labels on Left */}
          {sptTable.map((s) => (
            <g key={`depth-tick-${s.depthFeet}`}>
              <line
                x1={margin.left - 5}
                y1={depthToY(s.depthFeet)}
                x2={margin.left}
                y2={depthToY(s.depthFeet)}
                stroke="#94a3b8"
                strokeWidth="1.5"
              />
              <text
                x={margin.left - 8}
                y={depthToY(s.depthFeet) + 3}
                fill="#cbd5e1"
                fontSize="9"
                fontWeight="bold"
                textAnchor="end"
              >
                {s.depthFeet} ft
              </text>
            </g>
          ))}

          {/* Y Axis line */}
          <line
            x1={margin.left}
            y1={margin.top}
            x2={margin.left}
            y2={svgHeight - margin.bottom}
            stroke="#94a3b8"
            strokeWidth="2"
          />

          {/* N-curve Polyline */}
          <polyline
            fill="none"
            stroke="#f97316"
            strokeWidth="2.5"
            points={points}
          />

          {/* N-value Node Dots */}
          {sptTable.map((s) => (
            <g key={`node-${s.depthFeet}`}>
              <circle
                cx={nToX(s.nValue)}
                cy={depthToY(s.depthFeet)}
                r="4.5"
                fill="#f97316"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <text
                x={nToX(s.nValue) + 8}
                y={depthToY(s.depthFeet) + 3}
                fill="#fdba74"
                fontSize="9"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                {s.nValue}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800 pt-2">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-orange-500" />
          <span>Orange Line: Standard Penetration Resistance (SPT N-Value)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 bg-sky-500 rounded-sm" />
          <span>Dashed Line: In-situ Groundwater Table (GWT)</span>
        </span>
      </div>
    </div>
  );
};
