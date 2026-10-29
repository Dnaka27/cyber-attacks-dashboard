import { useMemo } from "react";
import { scaleLinear } from "d3-scale";
import { bin } from "d3-array";
import ChartFrame from "./ChartFrame";
import { median } from "../../lib/aggregations";
import { useTweenedValues } from "../../lib/useTweenedValues";
import { ACCENT, RISK, GRID, MUTED } from "../../lib/palette";

const M = { t: 30, r: 20, b: 36, l: 40 };

function Histogram({ width, height, inView, days, med, showTip, hideTip }) {
  const iw = width - M.l - M.r;
  const ih = height - M.t - M.b;
  const x = scaleLinear()
    .domain([0, Math.max(...days, 1)])
    .nice()
    .range([0, iw]);
  const bins = bin().domain(x.domain()).thresholds(x.ticks(30))(days);
  const counts = useTweenedValues(
    bins.map((b) => b.length),
    { enabled: inView, duration: 800 },
  );
  const y = scaleLinear()
    .domain([0, Math.max(...bins.map((b) => b.length), 1)])
    .range([ih, 0]);

  return (
    <g transform={`translate(${M.l},${M.t})`}>
      {y.ticks(4).map((t) => (
        <g key={t} transform={`translate(0,${y(t)})`}>
          <line x2={iw} stroke={GRID} strokeDasharray="2 4" />
          <text x={-8} dy="0.32em" textAnchor="end" fill={MUTED} className="chart-tick">
            {t}
          </text>
        </g>
      ))}
      {x.ticks(8).map((t) => (
        <text key={t} x={x(t)} y={ih + 22} textAnchor="middle" fill={MUTED} className="chart-tick">
          {t}d
        </text>
      ))}
      {bins.map((b, i) => (
        <rect
          key={b.x0}
          x={x(b.x0) + 1}
          width={Math.max(1, x(b.x1) - x(b.x0) - 2)}
          y={y(counts[i] ?? 0)}
          height={Math.max(0, ih - y(counts[i] ?? 0))}
          rx="2"
          fill={ACCENT}
          opacity="0.85"
          onPointerMove={(e) =>
            showTip(
              e,
              <>
                <strong>
                  {b.x0}-{b.x1} days
                </strong>
                <span>{b.length} incidents</span>
              </>,
            )
          }
          onPointerLeave={hideTip}
        />
      ))}
      <g
        style={{
          transform: `translateX(${x(med)}px)`,
          transition: "transform 700ms var(--ease-out)",
        }}
      >
        <line y1={-6} y2={ih} stroke={RISK} strokeWidth="2" strokeDasharray="5 4" />
        <text y={-12} textAnchor="middle" fill={RISK} className="chart-value">
          Median: {med.toFixed(0)}d
        </text>
      </g>
    </g>
  );
}

export default function RecoveryDaysHistogram({ fdf }) {
  const days = useMemo(
    () => fdf.map((r) => r.days_to_price_recovery).filter((d) => d !== null),
    [fdf],
  );
  const med = useMemo(() => median(days), [days]);

  return (
    <ChartFrame height={340} label="Stock price recovery time in days">
      {(frame) => <Histogram {...frame} days={days} med={med} />}
    </ChartFrame>
  );
}
