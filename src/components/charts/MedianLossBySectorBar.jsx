import { useMemo } from "react";
import { scaleLinear } from "d3-scale";
import HBarChart from "./HBarChart";
import { groupBy, median, sortDesc } from "../../lib/aggregations";
import { compactUSD } from "../../lib/format";

// Sequential single-hue ramp (dim indigo -> bright violet).
const ramp = scaleLinear().domain([0, 1]).range(["#3a3f8f", "#a99dff"]);

export default function MedianLossBySectorBar({ fdf }) {
  const rows = useMemo(() => {
    const items = sortDesc(
      [...groupBy(fdf, (r) => r.industry_name).entries()].map(([key, rs]) => ({
        key,
        value: median(rs.map((r) => r.total_loss_usd)),
      })),
      (r) => r.value,
    );
    const lo = Math.min(...items.map((r) => r.value));
    const hi = Math.max(...items.map((r) => r.value));
    return items.map((r) => ({ ...r, color: ramp(hi === lo ? 1 : (r.value - lo) / (hi - lo)) }));
  }, [fdf]);

  return (
    <HBarChart rows={rows} label="Median loss by sector" format={compactUSD} labelWidth={190} />
  );
}
