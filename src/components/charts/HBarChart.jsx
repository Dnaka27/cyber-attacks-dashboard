import { scaleLinear } from "d3-scale";
import ChartFrame from "./ChartFrame";
import { useTweenedValues } from "../../lib/useTweenedValues";
import { GRID, MUTED, INK_SOFT } from "../../lib/palette";

const ROW = 30;
const M = { t: 6, r: 64, b: 6, l: 8 };

function Bars({ width, height, inView, rows, labelWidth: fullLabelWidth, format, showTip, hideTip }) {
  // On narrow frames the label column yields space to the bars and value text.
  const labelWidth = Math.min(fullLabelWidth, Math.max(128, width * 0.45));
  const row = Math.max(18, Math.min(44, (height - M.t - M.b) / rows.length));
  const pad = Math.round(row * 0.23);
  const tweened = useTweenedValues(
    rows.map((r) => r.value),
    { enabled: inView, duration: 800 },
  );
  const iw = Math.max(40, width - M.l - M.r - labelWidth);
  const max = Math.max(...rows.map((r) => r.value), 1);
  const x = scaleLinear().domain([0, max]).range([0, iw]);

  return (
    <g transform={`translate(${M.l},${M.t})`}>
      {rows.map((r, i) => (
        <g
          key={r.key}
          transform={`translate(0,${i * row})`}
          onPointerMove={(e) =>
            showTip(
              e,
              <>
                <strong>{r.key}</strong>
                <span>{format(r.value)}</span>
              </>,
            )
          }
          onPointerLeave={hideTip}
        >
          <rect x={0} y={0} width={width} height={row} fill="transparent" />
          <text x={0} y={row / 2} dy="0.32em" fill={INK_SOFT} className="chart-label">
            {r.key}
          </text>
          <rect x={labelWidth} y={pad} width={iw} height={row - 2 * pad} rx="3" fill={GRID} opacity="0.35" />
          <rect
            x={labelWidth}
            y={pad}
            width={Math.max(0, x(tweened[i] ?? 0))}
            height={row - 2 * pad}
            rx="3"
            fill={r.color}
          />
          <text
            x={labelWidth + Math.max(0, x(tweened[i] ?? 0)) + 8}
            y={row / 2}
            dy="0.32em"
            fill={MUTED}
            className="chart-value"
            opacity={inView ? 1 : 0}
          >
            {format(r.value)}
          </text>
        </g>
      ))}
    </g>
  );
}

/** rows: [{ key, value, color }] already sorted top-to-bottom. */
export default function HBarChart({ rows, label, format = String, labelWidth = 120 }) {
  const height = rows.length * ROW + M.t + M.b;
  return (
    <ChartFrame height={height} label={label}>
      {(frame) => <Bars {...frame} rows={rows} labelWidth={labelWidth} format={format} />}
    </ChartFrame>
  );
}
