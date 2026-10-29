import { useState } from "react";

const SEARCH_FROM = 9;

/**
 * Checkbox list with an optional search box. Empty selection = "all"
 * (see lib/useFilteredData.js), so we treat it as "all checked" when
 * `selected` is empty.
 */
export default function OptionList({ label, options, selected, onChange }) {
  const [query, setQuery] = useState("");
  const allSelected = selected.length === 0;
  const visible = query
    ? options.filter((o) => o.toLowerCase().includes(query.trim().toLowerCase()))
    : options;

  function toggle(option) {
    const current = allSelected ? options : selected;
    const next = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    onChange(next.length === options.length ? [] : next);
  }

  return (
    <div>
      <div className="filter-panel-actions">
        <span className="muted-note">{allSelected ? "All" : `${selected.length} of ${options.length}`}</span>
        <button type="button" className="filter-panel-action" onClick={() => onChange([])}>
          Select all
        </button>
      </div>
      {options.length >= SEARCH_FROM && (
        <input
          type="search"
          className="option-search"
          placeholder="Search"
          aria-label={`Search ${label ?? "options"}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      )}
      <div className="option-list">
        {visible.map((option) => {
          const checked = allSelected || selected.includes(option);
          return (
            <label key={option} className="option-row">
              <input type="checkbox" checked={checked} onChange={() => toggle(option)} />
              <span>{option}</span>
            </label>
          );
        })}
        {visible.length === 0 && <span className="muted-note">No matches</span>}
      </div>
    </div>
  );
}
