import { useMemo, useState } from "react";
import { sortDesc } from "../lib/aggregations";
import { toCsv, downloadCsv } from "../lib/csv";

const COLUMNS = [
  "incident_id",
  "company_name",
  "country_name",
  "year",
  "attack_vector_primary",
  "industry_name",
  "total_loss_usd",
  "downtime_hours",
  "data_compromised_records",
  "quality_grade",
  "is_public_company",
  "days_to_price_recovery",
];

const PAGE_SIZE = 50;

function formatCell(column, value) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Sim" : "Não";
  if (typeof value === "number") {
    return column === "year" ? String(value) : value.toLocaleString("en-US");
  }
  return String(value);
}

export default function RawDataTable({ fdf }) {
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => sortDesc(fdf, (r) => r.total_loss_usd ?? -Infinity), [fdf]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageRows = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function handleDownload() {
    const csv = toCsv(sorted, COLUMNS);
    downloadCsv("cyber_attacks_filtered.csv", csv);
  }

  return (
    <div className="docket-body">
      <div className="docket-toolbar">
        <span className="docket-count">
          {sorted.length.toLocaleString("en-US")} registros com os filtros atuais
        </span>
        <button type="button" onClick={handleDownload} className="docket-download">
          Baixar CSV
        </button>
      </div>

      <div className="docket-table-wrap">
        <table className="docket-table">
          <thead>
            <tr>
              {COLUMNS.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr key={row.incident_id}>
                {COLUMNS.map((c) => (
                  <td key={c}>{formatCell(c, row[c])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="docket-pagination">
        <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
          Anterior
        </button>
        <span className="muted-note">
          Página {page + 1} de {pageCount}
        </span>
        <button type="button" disabled={page >= pageCount - 1} onClick={() => setPage((p) => p + 1)}>
          Próxima
        </button>
      </div>
    </div>
  );
}
