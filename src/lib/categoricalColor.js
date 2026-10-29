/**
 * Fixed colors by category identity (not by position/rank after filtering),
 * validated against CVD and contrast on the report's dark surface (#121832)
 * via the dataviz skill's validate_palette.js. See lib/palette.js for the base PALETTE.
 */

// Ordered by global frequency in the dataset (Ransomware > Phishing > ... > Backdoor).
// The top 8 get a validated categorical slot; the 9th (Backdoor) falls into "Other".
const ATTACK_VECTOR_COLORS = {
  Ransomware: "#1aa898",
  Phishing: "#8b7cf6",
  "Data Breach": "#e0662a",
  Apt: "#2f93e0",
  Malware: "#c98500",
  Ddos: "#de5a9a",
  "Supply Chain": "#55a630",
  Trojan: "#c94f6d",
};
const OTHER_COLOR = "#8a90b5";

export function attackVectorColor(vector) {
  return ATTACK_VECTOR_COLORS[vector] ?? OTHER_COLOR;
}
