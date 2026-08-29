// Categorical palette validated (CVD + contrast) against the report's dark
// surface (#171d29) via the dataviz skill's validate_palette.js. Fixed order —
// never cycle by index after filtering; see lib/categoricalColor.js for the
// mapping by entity identity (attack vector, quality grade, etc).
export const PALETTE = [
  "#3987e5",
  "#d95926",
  "#199e70",
  "#c98500",
  "#d55181",
  "#008300",
  "#9085e9",
  "#e66767",
];

const AXIS_BASE = {
  gridcolor: "#2a3242",
  zerolinecolor: "#3a4256",
  linecolor: "#3a4256",
};

export const BASE_LAYOUT = {
  paper_bgcolor: "rgba(0,0,0,0)",
  plot_bgcolor: "rgba(0,0,0,0)",
  font: { family: "IBM Plex Mono, monospace", color: "#eef1f6", size: 12 },
  colorway: PALETTE,
  margin: { t: 40, r: 20, b: 40, l: 50 },
  xaxis: { ...AXIS_BASE },
  yaxis: { ...AXIS_BASE },
  legend: { bgcolor: "rgba(0,0,0,0)", font: { color: "#eef1f6" } },
};

export const BASE_CONFIG = {
  displayModeBar: false,
  responsive: true,
};

/** Shallow merge: caller's layout takes priority, except xaxis/yaxis which are merged with the base. */
export function mergeLayout(layout) {
  return {
    ...BASE_LAYOUT,
    ...layout,
    xaxis: { ...AXIS_BASE, ...layout.xaxis },
    yaxis: { ...AXIS_BASE, ...layout.yaxis },
    font: { ...BASE_LAYOUT.font, ...layout.font },
  };
}
