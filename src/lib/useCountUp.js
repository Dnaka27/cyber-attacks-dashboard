import { useEffect, useRef, useState } from "react";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/** Anima um numero do valor anterior ate `target` (usado nos KPIs do topo do relatorio). */
export function useCountUp(target, duration = 700) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!Number.isFinite(target) || prefersReducedMotion()) {
      setValue(target);
      fromRef.current = target;
      return;
    }

    const from = fromRef.current;
    const start = performance.now();

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      setValue(from + (target - from) * easeOutCubic(t));
      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return value;
}
