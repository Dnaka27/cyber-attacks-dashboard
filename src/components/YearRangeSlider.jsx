export default function YearRangeSlider({ min, max, value, onChange }) {
  const [lo, hi] = value;
  const span = max - min || 1;

  return (
    <div className="year-filter">
      <span className="year-filter-label">Period</span>
      <span className="year-filter-value">
        {lo} — {hi}
      </span>
      <div className="year-range-track-wrap">
        <div className="year-range-track" />
        <div
          className="year-range-fill"
          style={{
            left: `${((lo - min) / span) * 100}%`,
            right: `${100 - ((hi - min) / span) * 100}%`,
          }}
        />
        <input
          type="range"
          className="year-range-input"
          min={min}
          max={max}
          value={lo}
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi), hi])}
        />
        <input
          type="range"
          className="year-range-input"
          min={min}
          max={max}
          value={hi}
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo)])}
        />
      </div>
    </div>
  );
}
