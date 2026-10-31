import { useEffect, useRef } from "react";

/** Top-level view switcher. Roving tabindex with arrow/Home/End keys, per the ARIA tabs pattern. */
export default function TabBar({ tabs, active, onChange, onHome, actions }) {
  const refs = useRef({});

  // The tab strip scrolls on narrow screens: keep the active tab in view.
  useEffect(() => {
    refs.current[active]?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [active]);

  function onKeyDown(e, index) {
    const last = tabs.length - 1;
    let next;
    if (e.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (e.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    onChange(tabs[next].id);
    refs.current[tabs[next].id]?.focus();
  }

  return (
    <div className="tabbar">
      <button type="button" className="tabbar-brand" onClick={onHome}>
        Loss Ledger
      </button>
      <div className="tabbar-list" role="tablist" aria-label="Dashboard sections">
        {tabs.map((t, i) => {
          const selected = t.id === active;
          return (
            <button
              key={t.id}
              ref={(el) => (refs.current[t.id] = el)}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`panel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              className={`tabbar-tab${selected ? " is-active" : ""}`}
              onClick={() => onChange(t.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div className="tabbar-actions">{actions}</div>
    </div>
  );
}
