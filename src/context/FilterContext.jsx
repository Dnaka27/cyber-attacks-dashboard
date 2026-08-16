import { createContext, useContext, useState } from "react";
import rawData from "../data/data.json";

export const DEFAULT_COUNTRIES = ["Brazil", "United States", "United Kingdom"];

const years = rawData.map((r) => r.year);
const DEFAULT_YEAR_RANGE = [Math.min(...years), Math.max(...years)];

const FilterContext = createContext(null);

export function FilterProvider({ children }) {
  const [attackVectors, setAttackVectors] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [qualityGrades, setQualityGrades] = useState([]);
  const [publicOnly, setPublicOnly] = useState(false);
  const [yearRange, setYearRange] = useState(DEFAULT_YEAR_RANGE);
  const [countries, setCountries] = useState(DEFAULT_COUNTRIES);

  const value = {
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
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used within a FilterProvider");
  return ctx;
}
