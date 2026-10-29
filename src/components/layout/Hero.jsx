import { Suspense, lazy, useCallback, useMemo, useState } from "react";
import Kpis from "./Kpis";
import { useFilters } from "../../context/FilterContext";
import { useFilteredData } from "../../lib/useFilteredData";
import { groupBy, sum, sortDesc } from "../../lib/aggregations";
import { compactUSD } from "../../lib/format";

const Globe = lazy(() => import("../globe/Globe"));

const TOP_COUNTRIES = 8;

export default function Hero({ fdf }) {
  const { countries, setCountries } = useFilters();
  // The globe shows every country; the country filter only decides which markers are lit.
  const worldRows = useFilteredData({ ignoreCountries: true });
  const [focus, setFocus] = useState(null);
  // Spotlighted country: its KPIs replace the aggregate ones, the ranking below stays as is.
  const [selected, setSelected] = useState(null);
  const [globeFailed, setGlobeFailed] = useState(false);
  const onUnavailable = useCallback(() => setGlobeFailed(true), []);

  const byCountry = useMemo(
    () =>
      sortDesc(
        [...groupBy(worldRows, (r) => r.country_name).entries()].map(([name, rs]) => ({
          name,
          loss: sum(rs.map((r) => r.total_loss_usd)),
          incidents: rs.length,
        })),
        (c) => c.loss,
      ),
    [worldRows],
  );

  const isSelected = (name) => countries.length === 0 || countries.includes(name);
  const globeCountries = byCountry.map((c) => ({
    ...c,
    selected: isSelected(c.name),
    spotlight: c.name === selected,
  }));
  const spotlightRows = useMemo(
    () => (selected ? worldRows.filter((r) => r.country_name === selected) : []),
    [worldRows, selected],
  );
  const kpiRows = spotlightRows.length > 0 ? spotlightRows : fdf;
  const kpiScope = spotlightRows.length > 0 ? selected : null;
  const top = byCountry.slice(0, TOP_COUNTRIES);
  const topLoss = Math.max(...top.map((c) => c.loss), 1);

  function spotlight(name) {
    if (!name || name === selected) {
      setSelected(null);
      return;
    }
    setSelected(name);
    setFocus({ name, nonce: Date.now() });
  }

  function pick(name) {
    if (countries.length === 0) setCountries([name]);
    else if (!countries.includes(name)) setCountries([...countries, name]);
    else if (countries.length > 1) {
      setCountries(countries.filter((c) => c !== name));
      if (selected === name) setSelected(null);
      return;
    }
    setSelected(name);
    setFocus({ name, nonce: Date.now() });
  }

  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="hero-eyebrow">Financial &amp; market impact dataset</p>
        <h1 className="hero-title">
          Cyber Attacks
          <br />
          <span>Loss Ledger</span>
        </h1>
        <p className="hero-sub">
          Direct losses, ransoms, and stock market reaction to cybersecurity incidents, by
          sector, country, and attack vector.
        </p>
        {kpiRows.length > 0 && (
          <Kpis fdf={kpiRows} scope={kpiScope} onClear={() => setSelected(null)} />
        )}
      </div>

      <div className="hero-stage">
        {!globeFailed && (
          <p className="globe-hint">
            {selected ? "Click the country again to clear" : "Click a country on the globe"}
          </p>
        )}
        {!globeFailed && (
          <Suspense fallback={<div className="globe globe--loading" />}>
            <Globe
              countries={globeCountries}
              focus={focus}
              onPick={spotlight}
              onUnavailable={onUnavailable}
            />
          </Suspense>
        )}
        <ol className="country-list" aria-label="Top headquarters countries by total loss">
          {top.map((c, i) => (
            <li key={c.name}>
              <button
                type="button"
                className={`country-row${isSelected(c.name) ? " is-on" : ""}${c.name === selected ? " is-spotlight" : ""}`}
                aria-pressed={isSelected(c.name)}
                onClick={() => pick(c.name)}
              >
                <span className="country-rank num">{String(i + 1).padStart(2, "0")}</span>
                <span className="country-name">{c.name}</span>
                <span className="country-loss num">{compactUSD(c.loss)}</span>
                <span className="country-bar" aria-hidden="true">
                  <i style={{ transform: `scaleX(${c.loss / topLoss})` }} />
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
