import { useEffect, useRef, useState } from "react";

export default function FilterDropdown({ label, value, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="filter-dropdown" ref={ref}>
      <button
        type="button"
        className={`filter-chip${open ? " open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="filter-chip-label">{label}</span>
        <span className="filter-chip-value">{value}</span>
      </button>
      {open && <div className="filter-panel">{children}</div>}
    </div>
  );
}
