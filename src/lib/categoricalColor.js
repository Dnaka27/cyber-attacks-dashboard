/**
 * Fixed colors by category identity (not by position/rank after filtering),
 * validated against CVD and contrast on the report's dark surface (#171d29)
 * via the dataviz skill's validate_palette.js. See lib/plotlyTheme.js for the base PALETTE.
 */

// Ordered by global frequency in the dataset (Ransomware > Phishing > ... > Backdoor).
// The top 8 get a validated categorical slot; the 9th (Backdoor) falls into "Other".
const ATTACK_VECTOR_COLORS = {
  Ransomware: "#3987e5",
  Phishing: "#d95926",
  "Data Breach": "#199e70",
  Apt: "#c98500",
  Malware: "#d55181",
  Ddos: "#008300",
  "Supply Chain": "#9085e9",
  Trojan: "#e66767",
};
const OTHER_COLOR = "#8a8070";

export function attackVectorColor(vector) {
  return ATTACK_VECTOR_COLORS[vector] ?? OTHER_COLOR;
}
