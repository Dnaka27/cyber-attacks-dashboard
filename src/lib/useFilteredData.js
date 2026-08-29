import { useMemo } from "react";
import rawData from "../data/data.json";
import { useFilters } from "../context/FilterContext";

const ALL = rawData;

export const YEAR_MIN = Math.min(...ALL.map((r) => r.year));
export const YEAR_MAX = Math.max(...ALL.map((r) => r.year));

export const ALL_ATTACK_VECTORS = [
  ...new Set(ALL.map((r) => r.attack_vector_primary)),
].sort();

export const ALL_SECTORS = [...new Set(ALL.map((r) => r.industry_name))].sort();

export const ALL_QUALITY_GRADES = ["Gold", "Silver", "Bronze"];

export const ALL_COUNTRIES = [...new Set(ALL.map((r) => r.country_name))].sort();

/**
 * Central filtering hook, equivalent to sidebar.py + header.py combined.
 * Empty arrays in attackVectors/sectors/qualityGrades/countries = "all selected".
 */
export function useFilteredData() {
  const { attackVectors, sectors, qualityGrades, publicOnly, yearRange, countries } =
    useFilters();

  return useMemo(() => {
    return ALL.filter((row) => {
      if (attackVectors.length && !attackVectors.includes(row.attack_vector_primary))
        return false;
      if (sectors.length && !sectors.includes(row.industry_name)) return false;
      if (qualityGrades.length && !qualityGrades.includes(row.quality_grade)) return false;
      if (publicOnly && !row.is_public_company) return false;
      if (row.year < yearRange[0] || row.year > yearRange[1]) return false;
      if (countries.length && !countries.includes(row.country_name)) return false;
      return true;
    });
  }, [attackVectors, sectors, qualityGrades, publicOnly, yearRange, countries]);
}
