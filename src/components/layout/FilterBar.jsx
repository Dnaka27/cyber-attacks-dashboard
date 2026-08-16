import FilterDropdown from "../FilterDropdown";
import OptionList from "../OptionList";
import YearRangeSlider from "../YearRangeSlider";
import { useFilters } from "../../context/FilterContext";
import {
  ALL_ATTACK_VECTORS,
  ALL_SECTORS,
  ALL_QUALITY_GRADES,
  ALL_COUNTRIES,
  YEAR_MIN,
  YEAR_MAX,
} from "../../lib/useFilteredData";
import { summarizeSelection } from "../../lib/format";

export default function FilterBar() {
  const {
    attackVectors,
    sectors,
    qualityGrades,
    publicOnly,
    yearRange,
    countries,
    setAttackVectors,
    setSectors,
    setQualityGrades,
    setPublicOnly,
    setYearRange,
    setCountries,
  } = useFilters();

  return (
    <div className="filter-bar">
      <YearRangeSlider min={YEAR_MIN} max={YEAR_MAX} value={yearRange} onChange={setYearRange} />

      <FilterDropdown
        label="Vetor de ataque"
        value={summarizeSelection(attackVectors, ALL_ATTACK_VECTORS.length)}
      >
        <OptionList
          options={ALL_ATTACK_VECTORS}
          selected={attackVectors}
          onChange={setAttackVectors}
        />
      </FilterDropdown>

      <FilterDropdown label="Setor" value={summarizeSelection(sectors, ALL_SECTORS.length)}>
        <OptionList options={ALL_SECTORS} selected={sectors} onChange={setSectors} />
      </FilterDropdown>

      <FilterDropdown
        label="Quality grade"
        value={summarizeSelection(qualityGrades, ALL_QUALITY_GRADES.length)}
      >
        <OptionList
          options={ALL_QUALITY_GRADES}
          selected={qualityGrades}
          onChange={setQualityGrades}
        />
      </FilterDropdown>

      <FilterDropdown label="País-sede" value={summarizeSelection(countries, ALL_COUNTRIES.length)}>
        <OptionList options={ALL_COUNTRIES} selected={countries} onChange={setCountries} />
      </FilterDropdown>

      <label className={`filter-toggle${publicOnly ? " active" : ""}`}>
        <input
          type="checkbox"
          checked={publicOnly}
          onChange={(e) => setPublicOnly(e.target.checked)}
        />
        Capital aberto
      </label>
    </div>
  );
}
