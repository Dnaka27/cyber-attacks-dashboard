import PlotlyChart from "../PlotlyChart";
import { groupBy, median } from "../../lib/aggregations";
import { attackVectorColor } from "../../lib/categoricalColor";

export default function RecoveryDaysHistogram({ fdf }) {
  const rows = fdf.filter((r) => r.days_to_price_recovery !== null);
  const byVector = groupBy(rows, (r) => r.attack_vector_primary);
  const vectors = [...byVector.keys()].sort();
  const med = median(rows.map((r) => r.days_to_price_recovery));

  const data = vectors.map((vector) => ({
    x: byVector.get(vector).map((r) => r.days_to_price_recovery),
    name: vector,
    type: "histogram",
    nbinsx: 30,
    marker: { color: attackVectorColor(vector) },
  }));

  return (
    <PlotlyChart
      data={data}
      layout={{
        barmode: "overlay",
        xaxis: { title: { text: "Days" } },
        yaxis: { title: { text: "Incidents" } },
        shapes: [
          {
            type: "line",
            x0: med,
            x1: med,
            y0: 0,
            y1: 1,
            yref: "paper",
            line: { color: "#e2483f", dash: "dash" },
          },
        ],
        annotations: [
          {
            x: med,
            y: 1,
            yref: "paper",
            text: `Median: ${med.toFixed(0)}d`,
            showarrow: false,
            font: { color: "#e2483f" },
            yshift: 10,
          },
        ],
      }}
    />
  );
}
