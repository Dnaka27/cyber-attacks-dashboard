/** Funcoes puras de agregacao, equivalentes aos groupby/agg do pandas usados no app original. */

export function notNull(values) {
  return values.filter((v) => v !== null && v !== undefined);
}

export function sum(values) {
  return notNull(values).reduce((acc, v) => acc + v, 0);
}

export function mean(values) {
  const vs = notNull(values);
  return vs.length ? sum(vs) / vs.length : 0;
}

export function median(values) {
  const vs = notNull(values).slice().sort((a, b) => a - b);
  if (!vs.length) return 0;
  const mid = Math.floor(vs.length / 2);
  return vs.length % 2 === 0 ? (vs[mid - 1] + vs[mid]) / 2 : vs[mid];
}

/** groupBy(rows, keyFn) -> Map<key, rows[]> */
export function groupBy(rows, keyFn) {
  const map = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    const bucket = map.get(key);
    if (bucket) bucket.push(row);
    else map.set(key, [row]);
  }
  return map;
}

/** value_counts equivalente: conta ocorrencias de keyFn(row), ignorando null/undefined. */
export function valueCounts(rows, keyFn) {
  const counts = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    if (key === null || key === undefined) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()].map(([key, count]) => ({ key, count }));
}

export function sortDesc(rows, valueFn) {
  return rows.slice().sort((a, b) => valueFn(b) - valueFn(a));
}

export function sortAsc(rows, valueFn) {
  return rows.slice().sort((a, b) => valueFn(a) - valueFn(b));
}
