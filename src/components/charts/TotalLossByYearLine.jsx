import PlotlyChart from "../PlotlyChart";
import { sum, groupBy } from "../../lib/aggregations";
import { compactUSD } from "../../lib/format";

export default function TotalLossByYearLine({ fdf }) {
  const byYear = groupBy(fdf, (r) => r.year);
  const years = [...byYear.keys()].sort((a, b) => a - b);
  const losses = years.map((y) => sum(byYear.get(y).map((r) => r.total_loss_usd)));

  const data = [
    {
      x: years,
      y: losses,
      type: "scatter",
      mode: "text+lines+markers",
      line: { color: "#e2483f", width: 2 },
      marker: { color: "#e2483f", size: 8 },
      text: losses.map(compactUSD),
      textposition: "top center",
      textfont: { color: "#eef1f6" },
    },
  ];

  return (
    <PlotlyChart
      data={data}
      layout={{
        xaxis: { title: { text: "Year" }, type: "category" },
        yaxis: { title: { text: "Total Loss (USD)" }, tickformat: "$.2s" },
      }}
    />
  );
}
