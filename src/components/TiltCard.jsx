import { useRef } from "react";

/** Div that tilts toward the pointer (fine pointers only). Writes CSS vars, no React state. */
export default function TiltCard({ className = "", max = 7, children, ...rest }) {
  const ref = useRef(null);

  function onPointerMove(e) {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    const box = el.getBoundingClientRect();
    const px = (e.clientX - box.left) / box.width - 0.5;
    const py = (e.clientY - box.top) / box.height - 0.5;
    el.style.setProperty("--ry", `${(px * max * 2).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${(-py * max * 2).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${((px + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${((py + 0.5) * 100).toFixed(1)}%`);
  }

  function reset() {
    const el = ref.current;
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--rx", "0deg");
  }

  return (
    <div
      ref={ref}
      className={`tilt ${className}`}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      {...rest}
    >
      {children}
    </div>
  );
}
