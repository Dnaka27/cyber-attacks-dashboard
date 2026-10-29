import { useEffect, useMemo, useRef, useState } from "react";
import { compactUSD } from "../lib/format";
import { toCsv, downloadCsv } from "../lib/csv";
import { useFitMode } from "../lib/useFitMode";

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

const HEADERS = {
  incident_id: "ID",
  company_name: "Company",
  country_name: "Country",
  year: "Year",
  attack_vector_primary: "Vector",
  industry_name: "Sector",
  total_loss_usd: "Loss (USD)",
  downtime_hours: "Downtime (h)",
  data_compromised_records: "Records",
  quality_grade: "Grade",
  is_public_company: "Public",
  days_to_price_recovery: "Recovery (d)",
};

const PAGE_SIZE = 50;
const NUMERIC = new Set([
  "total_loss_usd",
  "downtime_hours",
  "data_compromised_records",
  "days_to_price_recovery",
]);

function formatCell(column, value) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (column === "total_loss_usd") return compactUSD(value);
  if (column === "downtime_hours") return value.toLocaleString("en-US", { maximumFractionDigits: 1 });
  if (typeof value === "number") {
    return column === "year" ? String(value) : value.toLocaleString("en-US");
  }
  return String(value);
}

/** Missing values always sort last, whatever the direction. */
function compareBy(key, dir) {
  const sign = dir === "asc" ? 1 : -1;
  return (a, b) => {
    const x = a[key];
    const y = b[key];
    if (x == null || y == null) return x == null ? (y == null ? 0 : 1) : -1;
    const c = typeof x === "string" ? x.localeCompare(y) : x < y ? -1 : x > y ? 1 : 0;
    return c * sign;
  };
}

export default function RawDataTable({ fdf }) {
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState({ key: "total_loss_usd", dir: "desc" });
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const wrapRef = useRef(null);
  const fit = useFitMode();

  // When the layout fits the viewport, show as many rows as the table area holds.
  useEffect(() => {
    const el = wrapRef.current;
    if (!fit || !el) {
      setPageSize(PAGE_SIZE);
      return;
    }
    const measure = () => {
      const head = el.querySelector("thead")?.getBoundingClientRect().height ?? 36;
      const row = el.querySelector("tbody tr")?.getBoundingClientRect().height ?? 31;
      setPageSize(Math.max(5, Math.floor((el.clientHeight - head) / row)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [fit]);

  const sorted = useMemo(() => [...fdf].sort(compareBy(sort.key, sort.dir)), [fdf, sort]);

  function sortBy(key) {
    setSort((s) => ({ key, dir: s.key === key && s.dir === "desc" ? "asc" : "desc" }));
    setPage(0);
  }

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, pageCount - 1);
  const pageRows = sorted.slice(current * pageSize, (current + 1) * pageSize);

  function handleDownload() {
    const csv = toCsv(sorted, COLUMNS);
    downloadCsv("cyber_attacks_filtered.csv", csv);
  }

  return (
    <div className="docket-body">
      <div className="docket-toolbar">
        <span className="docket-count">
          {sorted.length.toLocaleString("en-US")} records match the current filters
        </span>
        <button type="button" onClick={handleDownload} className="docket-download">
          Download CSV
        </button>
      </div>

      <div
        className="docket-table-wrap"
        ref={wrapRef}
        tabIndex={0}
        role="region"
        aria-label="Incident records"
      >
        <table className="docket-table">
          <thead>
            <tr>
              {COLUMNS.map((c) => (
                <th
                  key={c}
                  className={NUMERIC.has(c) ? "is-num" : undefined}
                  aria-sort={
                    sort.key === c ? (sort.dir === "asc" ? "ascending" : "descending") : undefined
                  }
                >
                  <button type="button" className="docket-sort" onClick={() => sortBy(c)}>
                    {HEADERS[c]}
                    <span className="docket-sort-mark" aria-hidden="true">
                      {sort.key === c ? (sort.dir === "asc" ? "↑" : "↓") : ""}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr key={row.incident_id}>
                {COLUMNS.map((c) => (
                  <td key={c} className={NUMERIC.has(c) ? "is-num" : undefined}>
                    {formatCell(c, row[c])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="docket-pagination">
        <button type="button" disabled={current === 0} onClick={() => setPage(current - 1)}>
          Previous
        </button>
        <span className="muted-note">
          Page {current + 1} of {pageCount}
        </span>
        <button
          type="button"
          disabled={current >= pageCount - 1}
          onClick={() => setPage(current + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
