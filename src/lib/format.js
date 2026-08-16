const usdCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
});

const numberCompact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});

export function compactUSD(value) {
  return usdCompact.format(value);
}

export function compactNumber(value) {
  return numberCompact.format(value);
}

export function percent(value, digits = 2) {
  return `${(value * 100).toFixed(digits)}%`;
}

export function days(value) {
  return `${Math.round(value)} dias`;
}

export function summarizeSelection(selected, total) {
  if (selected.length === 0) return `Todos (${total})`;
  if (selected.length === 1) return selected[0];
  return `${selected.length} de ${total}`;
}
