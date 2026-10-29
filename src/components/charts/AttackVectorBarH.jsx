import { useMemo } from "react";
import HBarChart from "./HBarChart";
import { valueCounts, sortDesc } from "../../lib/aggregations";
import { attackVectorColor } from "../../lib/categoricalColor";

export default function AttackVectorBarH({ fdf }) {
  const rows = useMemo(
    () =>
      sortDesc(
        valueCounts(fdf, (r) => r.attack_vector_primary),
        (r) => r.count,
      ).map((c) => ({ key: c.key, value: c.count, color: attackVectorColor(c.key) })),
    [fdf],
  );

  return <HBarChart rows={rows} label="Incidents by attack vector" labelWidth={104} />;
}
