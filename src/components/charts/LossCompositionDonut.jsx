import { useMemo } from "react";
import { arc, pie } from "d3-shape";
import ChartFrame from "./ChartFrame";
import { median } from "../../lib/aggregations";
import { compactUSD } from "../../lib/format";
import { useTweenedValues } from "../../lib/useTweenedValues";
import { PALETTE, INK, MUTED, INK_SOFT } from "../../lib/palette";

const COMPONENTS = [
  { label: "Direct Loss", key: "direct_loss_usd" },
  { label: "Recovery Cost", key: "recovery_cost_usd" },
  { label: "Legal Fees", key: "legal_fees_usd" },
  { label: "Regulatory Fine", key: "regulatory_fine_usd" },
];

function Donut({ width, height, inView, values, showTip, hideTip }) {
  const tweened = useTweenedValues(values, { enabled: inView, duration: 900 });
  const total = values.reduce((a, v) => a + v, 0) || 1;
  const legendW = width >= 520 ? 190 : 0;
  const size = Math.min(width - legendW, height);
  const r = size / 2 - 6;
  const slices = pie().sort(null)(tweened.map((v) => Math.max(v, 0.0001)));
  const gen = arc().innerRadius(r * 0.62).outerRadius(r).cornerRadius(3).padAngle(0.02);

  return (
    <g>
      <g transform={`translate(${(width - legendW) / 2},${height / 2})`}>
        {slices.map((s, i) => (
          <path
            key={COMPONENTS[i].key}
            d={gen(s)}
            fill={PALETTE[i]}
            onPointerMove={(e) =>
              showTip(
                e,
                <>
                  <strong>{COMPONENTS[i].label}</strong>
                  <span>
                    {compactUSD(values[i])} ({Math.round((values[i] / total) * 100)}%)
                  </span>
                </>,
              )
            }
            onPointerLeave={hideTip}
          />
        ))}
        <text textAnchor="middle" y="-4" fill={INK} className="chart-center">
          {compactUSD(total)}
        </text>
        <text textAnchor="middle" y="16" fill={MUTED} className="chart-tick">
          sum of medians
        </text>
      </g>
      {legendW > 0 && (
        <g transform={`translate(${width - legendW + 8},${height / 2 - COMPONENTS.length * 14})`}>
          {COMPONENTS.map((c, i) => (
            <g key={c.key} transform={`translate(0,${i * 28})`}>
              <rect width="10" height="10" y="-5" rx="2" fill={PALETTE[i]} />
              <text x="18" dy="0.32em" fill={INK_SOFT} className="chart-label">
                {c.label}
              </text>
            </g>
          ))}
        </g>
      )}
    </g>
  );
}

export default function LossCompositionDonut({ fdf }) {
  const values = useMemo(
    () => COMPONENTS.map((c) => median(fdf.map((r) => r[c.key]))),
    [fdf],
  );

  return (
    <ChartFrame height={320} label="Median loss composition">
      {(frame) => <Donut {...frame} values={values} />}
    </ChartFrame>
  );
}
