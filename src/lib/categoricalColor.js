/**
 * Cores fixas por identidade de categoria (nao por posicao/rank apos filtro),
 * validadas contra CVD e contraste na superficie escura do relatorio (#171d29)
 * via dataviz skill's validate_palette.js. Ver lib/plotlyTheme.js para o PALETTE base.
 */

// Ordenado por frequencia global no dataset (Ransomware > Phishing > ... > Backdoor).
// Os 8 mais frequentes recebem um slot categorico validado; o 9o (Backdoor) cai em "Other".
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
