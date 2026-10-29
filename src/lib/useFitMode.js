import { useEffect, useState } from "react";

/** Viewports big enough for every tab to fit on one screen. Keep in sync with the `.app` rules in index.css. */
export const FIT_QUERY = "(min-width: 1000px) and (min-height: 600px)";

export function useFitMode() {
  const [fit, setFit] = useState(() => window.matchMedia(FIT_QUERY).matches);

  useEffect(() => {
    const mq = window.matchMedia(FIT_QUERY);
    const onChange = () => setFit(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return fit;
}
