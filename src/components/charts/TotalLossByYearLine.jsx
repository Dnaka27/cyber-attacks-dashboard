import { useMemo } from "react";
import { scaleLinear, scalePoint } from "d3-scale";
import { area, line, curveMonotoneX } from "d3-shape";
import ChartFrame from "./ChartFrame";
import { sum, groupBy } from "../../lib/aggregations";
import { compactUSD } from "../../lib/format";
import { useTweenedValues } from "../../lib/useTweenedValues";
import { RISK, GRID, MUTED, INK_SOFT } from "../../lib/palette";

const M = { t: 28, r: 20, b: 34, l: 52 };

function Chart({ width, height, inView, years, losses, showTip, hideTip }) {
  const tweened = useTweenedValues(losses, { enabled: inView, duration: 900 });
  const iw = width - M.l - M.r;
  const ih = height - M.t - M.b;

  const x = scalePoint().domain(years).range([0, iw]).padding(0.3);
  const y = scaleLinear()
    .domain([0, Math.max(...losses, 1) * 1.12])
    .range([ih, 0]);

  const pts = years.map((yr, i) => ({ x: x(yr), y: y(tweened[i] ?? 0) }));
  const path = line().x((p) => p.x).y((p) => p.y).curve(curveMonotoneX)(pts);
  const fill = area().x((p) => p.x).y0(ih).y1((p) => p.y).curve(curveMonotoneX)(pts);

  return (
    <g transform={`translate(${M.l},${M.t})`}>
      <defs>
        <linearGradient id="loss-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={RISK} stopOpacity="0.42" />
          <stop offset="100%" stopColor={RISK} stopOpacity="0" />
        </linearGradient>
      </defs>
      {y.ticks(4).map((t) => (
        <g key={t} transform={`translate(0,${y(t)})`}>
          <line x2={iw} stroke={GRID} strokeDasharray="2 4" />
          <text x={-10} dy="0.32em" textAnchor="end" fill={MUTED} className="chart-tick">
            {compactUSD(t)}
          </text>
        </g>
      ))}
      <path d={fill} fill="url(#loss-area)" />
      <path d={path} fill="none" stroke={RISK} strokeWidth="2.5" strokeLinecap="round" />
      {years.map((yr, i) => (
        <g key={yr}>
          <text x={x(yr)} y={ih + 22} textAnchor="middle" fill={MUTED} className="chart-tick">
            {yr}
          </text>
          <circle
            cx={pts[i].x}
            cy={pts[i].y}
            r="4.5"
            fill="var(--bg)"
            stroke={RISK}
            strokeWidth="2"
          />
          <rect
            x={x(yr) - 20}
            y={0}
            width={40}
            height={ih}
            fill="transparent"
            onPointerMove={(e) =>
              showTip(
                e,
                <>
                  <strong>{yr}</strong>
                  <span>{compactUSD(losses[i])}</span>
                </>,
              )
            }
            onPointerLeave={hideTip}
          />
          <text
            x={pts[i].x}
            y={pts[i].y - 12}
            textAnchor="middle"
            fill={INK_SOFT}
            className="chart-value"
            opacity={inView ? 1 : 0}
          >
            {compactUSD(losses[i])}
          </text>
        </g>
      ))}
    </g>
  );
}

export default function TotalLossByYearLine({ fdf }) {
  const { years, losses } = useMemo(() => {
    const byYear = groupBy(fdf, (r) => r.year);
    const ys = [...byYear.keys()].sort((a, b) => a - b);
    return { years: ys, losses: ys.map((yr) => sum(byYear.get(yr).map((r) => r.total_loss_usd))) };
  }, [fdf]);

  return (
    <ChartFrame height={340} label="Total financial loss recorded by year">
      {(frame) => <Chart {...frame} years={years} losses={losses} />}
    </ChartFrame>
  );
}
