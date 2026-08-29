import PlotlyChart from "../PlotlyChart";
import { groupBy, median, sortAsc } from "../../lib/aggregations";

export default function MedianLossBySectorBar({ fdf }) {
  const byIndustry = groupBy(fdf, (r) => r.industry_name);
  const rows = sortAsc(
    [...byIndustry.entries()].map(([industry, rs]) => ({
      industry,
      value: median(rs.map((r) => r.total_loss_usd)),
    })),
    (r) => r.value,
  );

  const data = [
    {
      x: rows.map((r) => r.value),
      y: rows.map((r) => r.industry),
      type: "bar",
      orientation: "h",
      marker: {
        color: rows.map((r) => r.value),
        colorscale: [
          [0, "#2a3242"],
          [0.5, "#4a7ec2"],
          [1, "#e2483f"],
        ],
      },
    },
  ];

  return (
    <PlotlyChart
      data={data}
      layout={{
        xaxis: { title: { text: "Median Loss (USD)" }, tickformat: "$.2s" },
        yaxis: { title: { text: "Sector" }, automargin: true },
      }}
    />
  );
}
