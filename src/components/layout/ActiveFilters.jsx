import { useActiveFilters } from "../../lib/useActiveFilters";

/** Thin strip of removable chips for filters that differ from the defaults. Renders nothing otherwise. */
export default function ActiveFilters() {
  const active = useActiveFilters();
  if (active.length === 0) return null;

  return (
    <div className="active-filters" aria-label="Active filters">
      {active.map((f) => (
        <button
          key={f.key}
          type="button"
          className="active-chip"
          onClick={f.clear}
          aria-label={`Remove filter: ${f.label}`}
        >
          {f.label}
          <span aria-hidden="true">&times;</span>
        </button>
      ))}
    </div>
  );
}
