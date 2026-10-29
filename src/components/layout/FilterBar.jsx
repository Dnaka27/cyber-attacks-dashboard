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

function Section({ label, value, defaultOpen = false, children }) {
  return (
    <details className="filter-section" open={defaultOpen}>
      <summary>
        <span className="filter-section-label">{label}</span>
        <span className="filter-section-value">{value}</span>
      </summary>
      <div className="filter-section-body">{children}</div>
    </details>
  );
}

/** Body of the filter drawer: one collapsible section per filter. */
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
      <Section label="Period" value={`${yearRange[0]} – ${yearRange[1]}`} defaultOpen>
        <YearRangeSlider min={YEAR_MIN} max={YEAR_MAX} value={yearRange} onChange={setYearRange} />
      </Section>

      <Section
        label="HQ country"
        value={summarizeSelection(countries, ALL_COUNTRIES.length)}
        defaultOpen
      >
        <OptionList
          label="countries"
          options={ALL_COUNTRIES}
          selected={countries}
          onChange={setCountries}
        />
      </Section>

      <Section
        label="Attack vector"
        value={summarizeSelection(attackVectors, ALL_ATTACK_VECTORS.length)}
      >
        <OptionList
          label="attack vectors"
          options={ALL_ATTACK_VECTORS}
          selected={attackVectors}
          onChange={setAttackVectors}
        />
      </Section>

      <Section label="Sector" value={summarizeSelection(sectors, ALL_SECTORS.length)}>
        <OptionList
          label="sectors"
          options={ALL_SECTORS}
          selected={sectors}
          onChange={setSectors}
        />
      </Section>

      <Section
        label="Quality grade"
        value={summarizeSelection(qualityGrades, ALL_QUALITY_GRADES.length)}
      >
        <OptionList
          label="quality grades"
          options={ALL_QUALITY_GRADES}
          selected={qualityGrades}
          onChange={setQualityGrades}
        />
      </Section>

      <label className={`filter-toggle${publicOnly ? " active" : ""}`}>
        <input
          type="checkbox"
          checked={publicOnly}
          onChange={(e) => setPublicOnly(e.target.checked)}
        />
        Public companies only
      </label>
    </div>
  );
}
