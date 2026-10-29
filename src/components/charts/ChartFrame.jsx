import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "../../lib/useInView";

/**
 * Responsive SVG wrapper shared by every chart. `children` is a render function receiving
 * `{ width, height, inView, showTip, hideTip }`; charts stay at zero until `inView` so their
 * entrance animation plays when the exhibit scrolls into view.
 *
 * `height` is the natural height, used as a minimum when the page scrolls. In fit-to-viewport
 * layouts CSS lets the frame shrink and grow with its exhibit, and charts receive the measured size.
 */
export default function ChartFrame({ height: naturalHeight = 320, label, children }) {
  const [inViewRef, inView] = useInView();
  const wrapRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [tip, setTip] = useState(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = (w, h) =>
      setSize((s) => (s.width === w && s.height === h ? s : { width: w, height: h }));
    measure(el.clientWidth, el.clientHeight);
    const ro = new ResizeObserver(([entry]) =>
      measure(Math.round(entry.contentRect.width), Math.round(entry.contentRect.height)),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const setRefs = useCallback(
    (el) => {
      wrapRef.current = el;
      inViewRef.current = el;
    },
    [inViewRef],
  );

  const showTip = useCallback((event, content) => {
    const box = wrapRef.current?.getBoundingClientRect();
    if (!box) return;
    setTip({ x: event.clientX - box.left, y: event.clientY - box.top, content });
  }, []);
  const hideTip = useCallback(() => setTip(null), []);

  const { width, height } = size;

  return (
    <div
      className="chart-frame"
      ref={setRefs}
      style={{ "--chart-h": `${naturalHeight}px` }}
    >
      {width > 0 && height > 0 && (
        <svg width={width} height={height} role="img" aria-label={label}>
          {children({ width, height, inView, showTip, hideTip })}
        </svg>
      )}
      {tip && (
        <div
          className="chart-tip"
          style={{
            transform: `translate(${Math.min(tip.x + 14, Math.max(0, width - 190))}px, ${Math.max(0, tip.y - 12)}px)`,
          }}
        >
          {tip.content}
        </div>
      )}
    </div>
  );
}
