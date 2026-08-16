import { sum, median, mean } from "../../lib/aggregations";
import { compactUSD, compactNumber, percent, days } from "../../lib/format";
import { useCountUp } from "../../lib/useCountUp";

export default function Kpis({ fdf }) {
  const totalLoss = useCountUp(sum(fdf.map((r) => r.total_loss_usd)));
  const medianLoss = useCountUp(median(fdf.map((r) => r.total_loss_usd)));
  const recordsLeaked = useCountUp(sum(fdf.map((r) => r.data_compromised_records)));
  const abnormalReturn = useCountUp(mean(fdf.map((r) => r.abnormal_return_1d)));
  const recoveryDays = useCountUp(median(fdf.map((r) => r.days_to_price_recovery)));
  const incidentCount = useCountUp(fdf.length);

  const rows = [
    { label: "Incidentes registrados", value: compactNumber(incidentCount) },
    { label: "Perda mediana por incidente", value: compactUSD(medianLoss) },
    { label: "Registros comprometidos", value: compactNumber(recordsLeaked) },
    { label: "Retorno anormal médio (1d)", value: percent(abnormalReturn) },
    { label: "Recuperação mediana do preço", value: days(recoveryDays) },
  ];

  return (
    <div className="kpi-band">
      <div className="kpi-card kpi-card--hero">
        <span className="kpi-card-label">Perda financeira total apurada</span>
        <div className="kpi-card-value kpi-card-value--hero num">{compactUSD(totalLoss)}</div>
      </div>
      {rows.map((row) => (
        <div className="kpi-card" key={row.label}>
          <span className="kpi-card-label">{row.label}</span>
          <div className="kpi-card-value num">{row.value}</div>
        </div>
      ))}
    </div>
  );
}
