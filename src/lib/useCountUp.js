import { useTweenedValues } from "./useTweenedValues";

/** Animates a number from the previous value to `target` (used in the report's top KPIs). */
export function useCountUp(target, duration = 700) {
  const [value] = useTweenedValues([Number.isFinite(target) ? target : 0], { duration });
  return value;
}
