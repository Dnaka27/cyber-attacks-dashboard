/**
 * Lista de checkboxes usada dentro de um FilterDropdown. Selecao vazia = "todos"
 * (ver lib/useFilteredData.js), entao tratamos como "todos marcados" quando
 * `selected` esta vazio.
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
        <span className="muted-note">{allSelected ? "Todos" : `${selected.length} de ${options.length}`}</span>
        <button type="button" className="filter-panel-action" onClick={() => onChange([])}>
          Redefinir
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
