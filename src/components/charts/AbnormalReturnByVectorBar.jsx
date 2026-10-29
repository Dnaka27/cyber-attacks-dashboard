import { useMemo } from "react";
import { scaleLinear, scalePoint } from "d3-scale";
import ChartFrame from "./ChartFrame";
import { mean } from "../../lib/aggregations";
import { percent } from "../../lib/format";
import { useTweenedValues } from "../../lib/useTweenedValues";
import { PALETTE, GRID, MUTED, INK_SOFT } from "../../lib/palette";

const WINDOWS = [
  { label: "1 day", key: "abnormal_return_1d" },
  { label: "7 days", key: "abnormal_return_7d" },
  { label: "30 days", key: "abnormal_return_30d" },
];
const COLORS = [PALETTE[0], PALETTE[3], PALETTE[4]];
const NATURAL_ROW = 34;
const M = { t: 30, r: 24, b: 28, l: 108 };

function Dots({ width, height, inView, vectors, matrix, showTip, hideTip }) {
  const ROW = Math.max(22, Math.min(48, (height - M.t - M.b) / vectors.length));
  const flat = useTweenedValues(matrix.flat(), { enabled: inView, duration: 900 });
  const iw = width - M.l - M.r;
  const ext = Math.max(0.005, ...matrix.flat().map(Math.abs));
  const x = scaleLinear().domain([-ext, ext]).nice().range([0, iw]);
  const y = scalePoint().domain(vectors).range([ROW / 2, vectors.length * ROW - ROW / 2]);
  const val = (vi, wi) => flat[vi * WINDOWS.length + wi] ?? 0;

  return (
    <g transform={`translate(${M.l},${M.t})`}>
      {WINDOWS.map((w, i) => (
        <g key={w.key} transform={`translate(${i * 96},-16)`}>
          <circle r="4.5" cx="4" fill={COLORS[i]} />
          <text x="14" dy="0.32em" fill={INK_SOFT} className="chart-tick">
            {w.label}
          </text>
        </g>
      ))}
      {x.ticks(5).map((t) => (
        <g key={t} transform={`translate(${x(t)},0)`}>
          <line
            y2={vectors.length * ROW}
            stroke={t === 0 ? MUTED : GRID}
            strokeDasharray={t === 0 ? "" : "2 4"}
          />
          <text
            y={vectors.length * ROW + 18}
            textAnchor="middle"
            fill={MUTED}
            className="chart-tick"
          >
            {percent(t, 1)}
          </text>
        </g>
      ))}
      {vectors.map((v, vi) => {
        const xs = WINDOWS.map((_, wi) => x(val(vi, wi)));
        return (
          <g
            key={v}
            transform={`translate(0,${y(v)})`}
            onPointerMove={(e) =>
              showTip(
                e,
                <>
                  <strong>{v}</strong>
                  {WINDOWS.map((w, wi) => (
                    <span key={w.key}>
                      {w.label}: {percent(matrix[vi][wi])}
                    </span>
                  ))}
                </>,
              )
            }
            onPointerLeave={hideTip}
          >
            <rect x={-M.l} y={-ROW / 2} width={width} height={ROW} fill="transparent" />
            <text x={-14} dy="0.32em" textAnchor="end" fill={INK_SOFT} className="chart-label">
              {v}
            </text>
            <line
              x1={Math.min(...xs)}
              x2={Math.max(...xs)}
              stroke={GRID}
              strokeWidth="3"
              strokeLinecap="round"
            />
            {xs.map((cx, wi) => (
              <circle
                key={WINDOWS[wi].key}
                cx={cx}
                r="5.5"
                fill={COLORS[wi]}
                stroke="var(--bg)"
                strokeWidth="1.5"
              />
            ))}
          </g>
        );
      })}
    </g>
  );
}

export default function AbnormalReturnByVectorBar({ fdf }) {
  const { vectors, matrix } = useMemo(() => {
    const vs = [...new Set(fdf.map((r) => r.attack_vector_primary))].sort();
    return {
      vectors: vs,
      matrix: vs.map((v) => {
        const rows = fdf.filter((r) => r.attack_vector_primary === v);
        return WINDOWS.map((w) => mean(rows.map((r) => r[w.key])));
      }),
    };
  }, [fdf]);

  return (
    <ChartFrame
      height={vectors.length * NATURAL_ROW + M.t + M.b}
      label="Mean abnormal return by attack vector"
    >
      {(frame) => <Dots {...frame} vectors={vectors} matrix={matrix} />}
    </ChartFrame>
  );
}
