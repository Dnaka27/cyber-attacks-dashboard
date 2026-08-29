import PlotlyChart from "../PlotlyChart";
import { median } from "../../lib/aggregations";
import { PALETTE } from "../../lib/plotlyTheme";

const COMPONENTS = [
  { label: "Direct Loss", key: "direct_loss_usd" },
  { label: "Recovery Cost", key: "recovery_cost_usd" },
  { label: "Legal Fees", key: "legal_fees_usd" },
  { label: "Regulatory Fine", key: "regulatory_fine_usd" },
];

export default function LossCompositionDonut({ fdf }) {
  const values = COMPONENTS.map((c) => median(fdf.map((r) => r[c.key])));

  const data = [
    {
      labels: COMPONENTS.map((c) => c.label),
      values,
      type: "pie",
      hole: 0.45,
      marker: { colors: PALETTE.slice(0, 4) },
    },
  ];

  return <PlotlyChart data={data} />;
}
