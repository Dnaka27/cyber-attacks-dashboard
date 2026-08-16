import { useLayoutEffect, useRef, useState } from "react";

export default function Tabs({ tabs }) {
  const [active, setActive] = useState(0);
  const trackRef = useRef(null);
  const buttonRefs = useRef([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const btn = buttonRefs.current[active];
    const track = trackRef.current;
    if (!btn || !track) return;
    const trackBox = track.getBoundingClientRect();
    const btnBox = btn.getBoundingClientRect();
    setIndicator({ left: btnBox.left - trackBox.left, width: btnBox.width });
  }, [active, tabs]);

  return (
    <div className="tabs-root">
      <div className="tab-bar">
        <div className="tab-bar-track" ref={trackRef}>
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              ref={(el) => (buttonRefs.current[i] = el)}
              type="button"
              onClick={() => setActive(i)}
              className={`tab-button${i === active ? " active" : ""}`}
            >
              {tab.label}
            </button>
          ))}
          <span
            className="tab-indicator"
            style={{ transform: `translateX(${indicator.left}px)`, width: `${indicator.width}px` }}
          />
        </div>
      </div>
      <div className="tab-panel" key={active}>
        {tabs[active].content}
      </div>
    </div>
  );
}
