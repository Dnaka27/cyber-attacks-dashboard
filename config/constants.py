PALETTE = [
    "#e63946", "#f4a261", "#457b9d", "#2a9d8f",
    "#e9c46a", "#a8dadc", "#264653", "#f1faee",
]

PLOTLY_BASE = dict(
    paper_bgcolor="rgba(0,0,0,0)",
    plot_bgcolor="rgba(0,0,0,0)",
    font=dict(family="Space Mono, monospace", color="#e8ecf4", size=11),
    margin=dict(l=20, r=20, t=40, b=20),
    legend=dict(bgcolor="rgba(0,0,0,0)", bordercolor="#1e2235"),
    xaxis=dict(gridcolor="#1e2235", zerolinecolor="#1e2235"),
    yaxis=dict(gridcolor="#1e2235", zerolinecolor="#1e2235"),
)

NAICS = {
    "11": "Agriculture",        "21": "Mining/Oil & Gas",    "22": "Utilities",
    "23": "Construction",       "31-33": "Manufacturing",    "42": "Wholesale",
    "44-45": "Retail",          "48-49": "Transportation",   "51": "Technology/Info",
    "52": "Finance & Insurance","53": "Real Estate",         "54": "Professional Svcs",
    "55": "Management",         "56": "Admin Services",      "61": "Education",
    "62": "Healthcare",         "71": "Arts & Entertainment","72": "Hospitality",
    "81": "Other Services",     "92": "Government",
}

COUNTRY_NAMES = {
    "US": "United States", "GB": "United Kingdom", "DE": "Germany",
    "CA": "Canada",        "FR": "France",          "AU": "Australia",
    "JP": "Japan",         "IN": "India",            "IT": "Italy",
    "BR": "Brazil",        "IL": "Israel",           "MX": "Mexico",
    "CH": "Switzerland",   "SG": "Singapore",        "KR": "South Korea",
}