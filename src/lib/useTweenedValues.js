import { useEffect, useRef, useState } from "react";

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

export function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

const finite = (n) => (Number.isFinite(n) ? n : 0);

/**
 * Tweens a numeric array toward `target` whenever it changes (same-length arrays blend index by
 * index; a length change snaps to the new shape and animates in from zero-height values).
 * Pass `enabled=false` to hold the zero state (used to delay charts until they scroll into view).
 */
export function useTweenedValues(target, { duration = 700, enabled = true } = {}) {
  const [values, setValues] = useState(() => target.map(() => 0));
  const fromRef = useRef(values);
  const frameRef = useRef(null);
  const key = target.join("|");

  useEffect(() => {
    if (!enabled) return;
    if (prefersReducedMotion()) {
      fromRef.current = target;
      setValues(target);
      return;
    }

    const prev = fromRef.current;
    const from = target.map((_, i) => finite(prev[i] ?? 0));
    const start = performance.now();

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const e = easeOutCubic(t);
      const next = target.map((v, i) => from[i] + (v - from[i]) * e);
      fromRef.current = next;
      setValues(next);
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
    // `key` captures the content of `target`; the array identity changes on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, duration, enabled]);

  return values;
}
