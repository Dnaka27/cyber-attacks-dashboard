/**
 * Checkbox list used inside a FilterDropdown. Empty selection = "all"
 * (see lib/useFilteredData.js), so we treat it as "all checked" when
 * `selected` is empty.
 */
export default function OptionList({ options, selected, onChange }) {
  const allSelected = selected.length === 0;

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
          Reset
        </button>
      </div>
      <div className="option-list">
        {options.map((option) => {
          const checked = allSelected || selected.includes(option);
          return (
            <label key={option} className="option-row">
              <input type="checkbox" checked={checked} onChange={() => toggle(option)} />
              <span>{option}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
