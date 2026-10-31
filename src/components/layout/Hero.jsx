import { Suspense, lazy, useCallback, useMemo, useState } from "react";
import Kpis from "./Kpis";
import { useFilters } from "../../context/FilterContext";
import { useFilteredData } from "../../lib/useFilteredData";
import { useFitMode } from "../../lib/useFitMode";
import { groupBy, sum, median, mean, sortDesc } from "../../lib/aggregations";
import { compactUSD, compactNumber, percent, days } from "../../lib/format";

const Globe = lazy(() => import("../globe/Globe"));

const TOP_COUNTRIES = 8;

/** Spotlight summary under the globe, for layouts where the KPI cards sit out of sight above it. */
function SpotCard({ name, rows, onClear }) {
  const stats = [
    { label: "Total loss", value: compactUSD(sum(rows.map((r) => r.total_loss_usd))) },
    { label: "Incidents", value: compactNumber(rows.length) },
    { label: "Median loss", value: compactUSD(median(rows.map((r) => r.total_loss_usd))) },
    { label: "Records", value: compactNumber(sum(rows.map((r) => r.data_compromised_records))) },
    { label: "Abnormal return (1d)", value: percent(mean(rows.map((r) => r.abnormal_return_1d))) },
    { label: "Price recovery", value: days(median(rows.map((r) => r.days_to_price_recovery))) },
  ];

  return (
    <div className="spot-card" role="status">
      <div className="spot-card-head">
        <span className="spot-card-name">{name}</span>
        <button type="button" className="spot-card-clear" onClick={onClear} aria-label={`Clear ${name}`}>
          &times;
        </button>
      </div>
      <dl className="spot-card-stats">
        {stats.map((st) => (
          <div key={st.label}>
            <dt>{st.label}</dt>
            <dd className="num">{st.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function Hero({ fdf }) {
  const { countries, setCountries } = useFilters();
  // The globe shows every country; the country filter only decides which markers are lit.
  const worldRows = useFilteredData({ ignoreCountries: true });
  const [focus, setFocus] = useState(null);
  // Spotlighted country: its KPIs replace the aggregate ones, the ranking below stays as is.
  const [selected, setSelected] = useState(null);
  const [globeFailed, setGlobeFailed] = useState(false);
  // Fit layout: the KPI cards sit beside the globe and follow the spotlight.
  // Scrolling layout: they stay aggregate and a summary card under the globe shows the country.
  const fit = useFitMode();
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
  const kpiSpotlight = fit && spotlightRows.length > 0;
  const kpiRows = kpiSpotlight ? spotlightRows : fdf;
  const kpiScope = kpiSpotlight ? selected : null;
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
        {!fit && spotlightRows.length > 0 && (
          <SpotCard name={selected} rows={spotlightRows} onClear={() => setSelected(null)} />
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
