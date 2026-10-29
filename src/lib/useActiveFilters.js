import { useFilters, DEFAULT_COUNTRIES, DEFAULT_YEAR_RANGE } from "../context/FilterContext";

const sameSet = (a, b) => a.length === b.length && a.every((x) => b.includes(x));
const names = (list, noun) => (list.length <= 2 ? list.join(", ") : `${list.length} ${noun}`);

/** Filters that differ from their defaults, as [{ key, label, clear }] for chips and the trigger badge. */
export function useActiveFilters() {
  const f = useFilters();
  const items = [];

  const [lo, hi] = f.yearRange;
  if (lo !== DEFAULT_YEAR_RANGE[0] || hi !== DEFAULT_YEAR_RANGE[1]) {
    items.push({
      key: "period",
      label: lo === hi ? `${lo}` : `${lo} – ${hi}`,
      clear: () => f.setYearRange(DEFAULT_YEAR_RANGE),
    });
  }
  if (!sameSet(f.countries, DEFAULT_COUNTRIES)) {
    items.push({
      key: "countries",
      label: f.countries.length === 0 ? "All countries" : names(f.countries, "countries"),
      clear: () => f.setCountries(DEFAULT_COUNTRIES),
    });
  }
  if (f.attackVectors.length) {
    items.push({
      key: "vectors",
      label: names(f.attackVectors, "vectors"),
      clear: () => f.setAttackVectors([]),
    });
  }
  if (f.sectors.length) {
    items.push({ key: "sectors", label: names(f.sectors, "sectors"), clear: () => f.setSectors([]) });
  }
  if (f.qualityGrades.length) {
    items.push({
      key: "grades",
      label: names(f.qualityGrades, "grades"),
      clear: () => f.setQualityGrades([]),
    });
  }
  if (f.publicOnly) {
    items.push({ key: "public", label: "Public companies", clear: () => f.setPublicOnly(false) });
  }

  return items;
}
