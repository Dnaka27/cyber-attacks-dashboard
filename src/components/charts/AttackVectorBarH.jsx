import PlotlyChart from "../PlotlyChart";
import { valueCounts, sortAsc } from "../../lib/aggregations";
import { attackVectorColor } from "../../lib/categoricalColor";

export default function AttackVectorBarH({ fdf }) {
  const counts = sortAsc(
    valueCounts(fdf, (r) => r.attack_vector_primary),
    (r) => r.count,
  );

  const data = [
    {
      x: counts.map((c) => c.count),
      y: counts.map((c) => c.key),
      type: "bar",
      orientation: "h",
      text: counts.map((c) => String(c.count)),
      textposition: "outside",
      marker: { color: counts.map((c) => attackVectorColor(c.key)) },
    },
  ];

  return (
    <PlotlyChart
      data={data}
      layout={{
        xaxis: { title: { text: "Incidents" } },
        yaxis: { title: { text: "Vector" }, automargin: true },
      }}
    />
  );
}
