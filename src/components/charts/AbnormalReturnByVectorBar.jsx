import PlotlyChart from "../PlotlyChart";
import { mean } from "../../lib/aggregations";

const WINDOWS = [
  { label: "1 dia", key: "abnormal_return_1d" },
  { label: "7 dias", key: "abnormal_return_7d" },
  { label: "30 dias", key: "abnormal_return_30d" },
];

export default function AbnormalReturnByVectorBar({ fdf }) {
  const vectors = [...new Set(fdf.map((r) => r.attack_vector_primary))].sort();

  const data = WINDOWS.map((w) => ({
    x: vectors,
    y: vectors.map((v) =>
      mean(fdf.filter((r) => r.attack_vector_primary === v).map((r) => r[w.key])),
    ),
    name: w.label,
    type: "bar",
  }));

  return (
    <PlotlyChart
      data={data}
      layout={{
        barmode: "group",
        xaxis: { title: { text: "Vetor" }, tickangle: -30, automargin: true },
        yaxis: { title: { text: "Retorno" }, tickformat: ".1%" },
      }}
    />
  );
}
