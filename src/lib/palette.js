// Categorical palette validated (CVD + contrast) against the report's dark
// surface (#121832) via the dataviz skill's validate_palette.js. Fixed order —
// never cycle by index after filtering; see lib/categoricalColor.js for the
// mapping by entity identity (attack vector, quality grade, etc).
export const PALETTE = [
  "#1aa898",
  "#8b7cf6",
  "#e0662a",
  "#2f93e0",
  "#c98500",
  "#de5a9a",
  "#55a630",
  "#c94f6d",
];

export const INK = "#eef0fb";
export const INK_SOFT = "#b8bedc";
export const MUTED = "#7d85ad";
export const GRID = "#262e57";
export const RISK = "#ffb02e";
export const ACCENT = "#2dd4bf";
