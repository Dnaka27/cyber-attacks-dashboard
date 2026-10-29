import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import FilterBar from "./FilterBar";
import { useFilters } from "../../context/FilterContext";
import { useActiveFilters } from "../../lib/useActiveFilters";

function FilterDrawer({ onClose }) {
  const { reset } = useFilters();
  const active = useActiveFilters();
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <>
      <div className="drawer-scrim" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-label="Filters">
        <header className="drawer-head">
          <h2 className="drawer-title">Filters</h2>
          <button
            type="button"
            className="drawer-close"
            ref={closeRef}
            onClick={onClose}
            aria-label="Close filters"
          >
            &times;
          </button>
        </header>
        <div className="drawer-body">
          <FilterBar />
        </div>
        <footer className="drawer-foot">
          <span className="muted-note">
            {active.length === 0 ? "Default filters" : `${active.length} changed`}
          </span>
          <button
            type="button"
            className="drawer-reset"
            disabled={active.length === 0}
            onClick={reset}
          >
            Reset to default
          </button>
        </footer>
      </aside>
    </>,
    document.body,
  );
}

/** Trigger button (lives in the tab bar) and the drawer it opens. */
export default function FilterDock() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const active = useActiveFilters();

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        className={`filters-trigger${open ? " is-open" : ""}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => (open ? close() : setOpen(true))}
      >
        Filters
        {active.length > 0 && <span className="filters-count">{active.length}</span>}
      </button>
      {open && <FilterDrawer onClose={close} />}
    </>
  );
}
