import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go

# ── Page config ───────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="Cyber Attacks · Financial & Market Impact",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── Custom CSS ────────────────────────────────────────────────────────────────
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;800&display=swap');

:root {
    --bg:       #0a0c14;
    --surface:  #111420;
    --border:   #1e2235;
    --accent:   #e63946;
    --accent2:  #457b9d;
    --accent3:  #f4a261;
    --text:     #e8ecf4;
    --muted:    #6b7399;
}

html, body, [data-testid="stAppViewContainer"] {
    background-color: var(--bg) !important;
    color: var(--text) !important;
    font-family: 'Syne', sans-serif;
}
[data-testid="stSidebar"] {
    background-color: var(--surface) !important;
    border-right: 1px solid var(--border);
}
[data-testid="stSidebar"] * { color: var(--text) !important; }

[data-testid="metric-container"] {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px !important;
    transition: border-color .2s;
}
[data-testid="metric-container"]:hover { border-color: var(--accent); }
[data-testid="stMetricLabel"] {
    color: var(--muted) !important;
    font-size: .72rem;
    letter-spacing: .1em;
    text-transform: uppercase;
}
[data-testid="stMetricValue"] {
    color: var(--text) !important;
    font-family: 'Space Mono', monospace;
    font-size: 1.7rem !important;
}

h1 {
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 2.4rem !important;
    background: linear-gradient(90deg, #e63946, #f4a261);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
h2, h3 { font-family: 'Syne', sans-serif; font-weight: 600; color: var(--text) !important; }

[data-testid="stTab"] button {
    font-family: 'Space Mono', monospace; font-size: .78rem; color: var(--muted) !important;
}
[data-testid="stTab"] button[aria-selected="true"] {
    color: var(--accent) !important;
    border-bottom: 2px solid var(--accent) !important;
}

hr { border-color: var(--border) !important; }
.js-plotly-plot { border-radius: 12px; border: 1px solid var(--border); }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
</style>
""", unsafe_allow_html=True)

# ── Constants ─────────────────────────────────────────────────────────────────
PALETTE = ["#e63946", "#f4a261", "#457b9d", "#2a9d8f", "#e9c46a", "#a8dadc", "#264653", "#f1faee"]

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
    "11": "Agriculture", "21": "Mining/Oil & Gas", "22": "Utilities",
    "23": "Construction", "31-33": "Manufacturing", "42": "Wholesale",
    "44-45": "Retail", "48-49": "Transportation", "51": "Technology/Info",
    "52": "Finance & Insurance", "53": "Real Estate", "54": "Professional Svcs",
    "55": "Management", "56": "Admin Services", "61": "Education",
    "62": "Healthcare", "71": "Arts & Entertainment", "72": "Hospitality",
    "81": "Other Services", "92": "Government",
}

COUNTRY_NAMES = {
    "US": "United States", "GB": "United Kingdom", "DE": "Germany",
    "CA": "Canada", "FR": "France", "AU": "Australia", "JP": "Japan",
    "IN": "India", "IT": "Italy", "BR": "Brazil", "IL": "Israel",
    "MX": "Mexico", "CH": "Switzerland", "SG": "Singapore", "KR": "South Korea",
}

# ── Data loading ──────────────────────────────────────────────────────────────
@st.cache_data
def load_data():
    fi = pd.read_csv("data/financial_impact.csv")
    im = pd.read_csv("data/incidents_master.csv")
    mi = pd.read_csv("data/market_impact.csv")

    im["incident_date"] = pd.to_datetime(im["incident_date"], errors="coerce")
    im["year"] = im["incident_date"].dt.year

    im["industry_name"] = im["industry_primary"].astype(str).map(NAICS).fillna(im["industry_primary"].astype(str))
    im["country_name"]  = im["country_hq"].map(COUNTRY_NAMES).fillna(im["country_hq"])
    im["attack_vector_primary"] = im["attack_vector_primary"].str.replace("_", " ").str.title()

    df = im.merge(
        fi[["incident_id", "total_loss_usd", "direct_loss_usd", "recovery_cost_usd",
            "legal_fees_usd", "regulatory_fine_usd", "insurance_payout_usd",
            "ransom_demanded_usd", "ransom_paid_usd", "inflation_adjusted_usd"]],
        on="incident_id", how="left"
    )
    df = df.merge(
        mi[["incident_id", "abnormal_return_1d", "abnormal_return_7d", "abnormal_return_30d",
            "car_0_to_30", "car_0_to_90", "days_to_price_recovery", "market_cap_at_disclosure",
            "volume_ratio_disclosure", "pre_incident_volatility_30d", "post_incident_volatility_30d",
            "price_7d_before", "price_disclosure_day", "price_30d_after", "sector_index"]],
        on="incident_id", how="left"
    )
    return df

try:
    df = load_data()
except FileNotFoundError as e:
    st.error(f"❌ Arquivo não encontrado: {e}\n\nVerifique se a pasta `data/` existe com os três CSVs.")
    st.stop()

# ── Sidebar ───────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("## 🛡️ Filtros")
    st.markdown("---")

    year_min, year_max = int(df.year.min()), int(df.year.max())
    year_range = st.slider("Ano", year_min, year_max, (year_min, year_max))

    all_attacks = sorted(df["attack_vector_primary"].dropna().unique())
    sel_attacks = st.multiselect("Vetor de Ataque", all_attacks, default=all_attacks)

    all_industries = sorted(df["industry_name"].dropna().unique())
    sel_industries = st.multiselect("Setor (NAICS)", all_industries, default=all_industries)

    all_countries = sorted(df["country_name"].dropna().unique())
    sel_countries = st.multiselect("País (HQ)", all_countries, default=all_countries)

    all_grades = ["Gold", "Silver", "Bronze"]
    sel_grades = st.multiselect("Quality Grade", all_grades, default=all_grades)

    st.markdown("---")
    only_public = st.checkbox("Apenas empresas públicas", value=False)

# ── Apply filters ─────────────────────────────────────────────────────────────
mask = (
    df["year"].between(*year_range) &
    df["attack_vector_primary"].isin(sel_attacks) &
    df["industry_name"].isin(sel_industries) &
    df["country_name"].isin(sel_countries) &
    df["quality_grade"].isin(sel_grades)
)
if only_public:
    mask &= df["is_public_company"] == True

fdf = df[mask].copy()

# ── Header ────────────────────────────────────────────────────────────────────
st.markdown("# Cyber Attacks")
st.markdown("#### Financial & Market Impact Dashboard")
st.markdown("---")

if fdf.empty:
    st.warning("Nenhum dado com os filtros atuais. Ajuste a barra lateral.")
    st.stop()

# ── KPIs ──────────────────────────────────────────────────────────────────────
c1, c2, c3, c4, c5, c6 = st.columns(6)

c1.metric("Incidentes",          f"{len(fdf):,}")
c2.metric("Perda Total",         f"${fdf['total_loss_usd'].sum()/1e9:.2f}B")
c3.metric("Perda Mediana",       f"${fdf['total_loss_usd'].median()/1e6:.1f}M")
c4.metric("Registros Vazados",   f"{fdf['data_compromised_records'].sum()/1e6:.1f}M")
c5.metric("Retorno Anormal (1d)",f"{fdf['abnormal_return_1d'].mean()*100:.2f}%")
c6.metric("Recuperação Mediana", f"{fdf['days_to_price_recovery'].median():.0f} dias")

st.markdown("---")

# ── Tabs ──────────────────────────────────────────────────────────────────────
tab1, tab2, tab3, tab4 = st.tabs(["📈  Tendências", "🎯  Ataques", "💸  Impacto Financeiro", "📉  Impacto de Mercado"])

# ═══════════════════════════════════════════════════════════════════
# TAB 1 — Tendências
# ═══════════════════════════════════════════════════════════════════
with tab1:
    col_a, col_b = st.columns(2)

    with col_a:
        st.subheader("Incidentes por Ano")
        year_atk = fdf.groupby(["year","attack_vector_primary"]).size().reset_index(name="count")
        fig = px.area(year_atk, x="year", y="count", color="attack_vector_primary",
                      color_discrete_sequence=PALETTE, template="none",
                      labels={"year":"Ano","count":"Incidentes","attack_vector_primary":"Ataque"})
        fig.update_layout(**PLOTLY_BASE)
        st.plotly_chart(fig, use_container_width=True)

    with col_b:
        st.subheader("Perda Total por Ano (USD)")
        loss_yr = fdf.groupby("year")["total_loss_usd"].sum().reset_index()
        fig2 = go.Figure(go.Scatter(
            x=loss_yr["year"], y=loss_yr["total_loss_usd"],
            fill="tozeroy", line=dict(color="#e63946", width=2.5),
            fillcolor="rgba(230,57,70,0.15)", mode="lines+markers",
            marker=dict(size=7, color="#e63946"),
        ))
        fig2.update_layout(**PLOTLY_BASE)
        fig2.update_yaxes(title="Total Loss (USD)", tickformat="$.2s")
        st.plotly_chart(fig2, use_container_width=True)

    col_c, col_d = st.columns(2)

    with col_c:
        st.subheader("Empresas Públicas vs Privadas por Ano")
        pub_yr = fdf.groupby(["year","is_public_company"]).size().reset_index(name="count")
        pub_yr["tipo"] = pub_yr["is_public_company"].map({True: "Pública", False: "Privada"})
        fig3 = px.bar(pub_yr, x="year", y="count", color="tipo",
                      color_discrete_map={"Pública": "#457b9d", "Privada": "#f4a261"},
                      barmode="stack", template="none",
                      labels={"year":"Ano","count":"Incidentes","tipo":"Tipo"})
        fig3.update_layout(**PLOTLY_BASE)
        st.plotly_chart(fig3, use_container_width=True)

    with col_d:
        st.subheader("Quality Grade dos Dados por Ano")
        grade_yr = fdf.groupby(["year","quality_grade"]).size().reset_index(name="count")
        grade_colors = {"Gold": "#e9c46a", "Silver": "#a8dadc", "Bronze": "#f4a261"}
        fig4 = px.bar(grade_yr, x="year", y="count", color="quality_grade",
                      color_discrete_map=grade_colors, barmode="group", template="none",
                      labels={"year":"Ano","count":"Incidentes","quality_grade":"Grade"})
        fig4.update_layout(**PLOTLY_BASE)
        st.plotly_chart(fig4, use_container_width=True)

# ═══════════════════════════════════════════════════════════════════
# TAB 2 — Ataques
# ═══════════════════════════════════════════════════════════════════
with tab2:
    col_a, col_b = st.columns(2)

    with col_a:
        st.subheader("Vetores de Ataque Mais Comuns")
        atk_counts = fdf["attack_vector_primary"].value_counts().reset_index()
        atk_counts.columns = ["attack","count"]
        fig5 = px.bar(atk_counts, x="count", y="attack", orientation="h",
                      color="count", color_continuous_scale=["#1e2235","#e63946"],
                      template="none", labels={"count":"Incidentes","attack":"Vetor"})
        fig5.update_layout(**PLOTLY_BASE)
        fig5.update_coloraxes(showscale=False)
        st.plotly_chart(fig5, use_container_width=True)

    with col_b:
        st.subheader("Heatmap: Ataque × Setor")
        heat = fdf.groupby(["industry_name","attack_vector_primary"]).size().reset_index(name="count")
        heat_pivot = heat.pivot(index="industry_name", columns="attack_vector_primary", values="count").fillna(0)
        fig6 = px.imshow(heat_pivot, color_continuous_scale=["#0a0c14","#e63946"],
                         aspect="auto", template="none",
                         labels={"x":"Vetor de Ataque","y":"Setor","color":"Incidentes"})
        fig6.update_layout(**PLOTLY_BASE)
        st.plotly_chart(fig6, use_container_width=True)

    col_c, col_d = st.columns(2)

    with col_c:
        st.subheader("Downtime por Vetor de Ataque (horas)")
        fig7 = px.box(fdf.dropna(subset=["downtime_hours"]),
                      x="attack_vector_primary", y="downtime_hours",
                      color="attack_vector_primary", color_discrete_sequence=PALETTE,
                      template="none", labels={"attack_vector_primary":"Ataque","downtime_hours":"Horas"})
        fig7.update_layout(**PLOTLY_BASE, showlegend=False)
        fig7.update_xaxes(tickangle=-30)
        st.plotly_chart(fig7, use_container_width=True)

    with col_d:
        st.subheader("Confiança de Atribuição")
        conf_counts = fdf["attribution_confidence"].value_counts().reset_index()
        conf_counts.columns = ["confiança","count"]
        fig8 = px.pie(conf_counts, names="confiança", values="count",
                      color_discrete_sequence=PALETTE, template="none", hole=.45)
        fig8.update_layout(**PLOTLY_BASE)
        st.plotly_chart(fig8, use_container_width=True)

    st.subheader("Registros Comprometidos por Setor")
    sec_rec = (fdf.groupby("industry_name")["data_compromised_records"]
               .sum().sort_values(ascending=False).reset_index())
    fig9 = px.bar(sec_rec, x="industry_name", y="data_compromised_records",
                  color="data_compromised_records",
                  color_continuous_scale=["#1e2235","#f4a261","#e63946"],
                  template="none", labels={"industry_name":"Setor","data_compromised_records":"Registros"})
    fig9.update_layout(**PLOTLY_BASE)
    fig9.update_coloraxes(showscale=False)
    fig9.update_xaxes(tickangle=-30)
    fig9.update_yaxes(tickformat=".2s")
    st.plotly_chart(fig9, use_container_width=True)

# ═══════════════════════════════════════════════════════════════════
# TAB 3 — Impacto Financeiro
# ═══════════════════════════════════════════════════════════════════
with tab3:
    col_a, col_b = st.columns(2)

    with col_a:
        st.subheader("Distribuição de Perda Total (USD)")
        fig10 = px.histogram(fdf.dropna(subset=["total_loss_usd"]),
                             x="total_loss_usd", color="attack_vector_primary",
                             log_y=True, nbins=50, template="none",
                             color_discrete_sequence=PALETTE, opacity=.8, barmode="overlay",
                             labels={"total_loss_usd":"Perda Total (USD)","attack_vector_primary":"Ataque"})
        fig10.update_layout(**PLOTLY_BASE)
        fig10.update_xaxes(tickformat="$.2s")
        st.plotly_chart(fig10, use_container_width=True)

    with col_b:
        st.subheader("Composição das Perdas (mediana USD)")
        loss_cols = {
            "Perda Direta":       "direct_loss_usd",
            "Custo Recuperação":  "recovery_cost_usd",
            "Honorários Legais":  "legal_fees_usd",
            "Multa Regulatória":  "regulatory_fine_usd",
        }
        medians = {k: fdf[v].median() for k, v in loss_cols.items()}
        fig11 = go.Figure(go.Pie(
            labels=list(medians.keys()), values=list(medians.values()),
            hole=.45, marker_colors=PALETTE[:4],
        ))
        fig11.update_layout(**PLOTLY_BASE)
        st.plotly_chart(fig11, use_container_width=True)

    col_c, col_d = st.columns(2)

    with col_c:
        st.subheader("Perda Mediana por Setor (USD)")
        sec_loss = (fdf.groupby("industry_name")["total_loss_usd"]
                    .median().sort_values(ascending=True).reset_index())
        fig12 = px.bar(sec_loss, x="total_loss_usd", y="industry_name", orientation="h",
                       color="total_loss_usd", color_continuous_scale=["#1e2235","#f4a261","#e63946"],
                       template="none", labels={"total_loss_usd":"Perda Mediana (USD)","industry_name":"Setor"})
        fig12.update_layout(**PLOTLY_BASE)
        fig12.update_coloraxes(showscale=False)
        fig12.update_xaxes(tickformat="$.2s")
        st.plotly_chart(fig12, use_container_width=True)

    with col_d:
        st.subheader("Ransom: Demandado vs Pago (USD)")
        ransom_df = fdf.dropna(subset=["ransom_demanded_usd","ransom_paid_usd"])
        if not ransom_df.empty:
            mx = max(ransom_df["ransom_demanded_usd"].max(), ransom_df["ransom_paid_usd"].max())
            fig13 = px.scatter(ransom_df,
                               x="ransom_demanded_usd", y="ransom_paid_usd",
                               color="attack_vector_primary", size="total_loss_usd", size_max=20,
                               color_discrete_sequence=PALETTE, template="none",
                               hover_data=["company_name","country_name","year"],
                               labels={"ransom_demanded_usd":"Demandado (USD)",
                                       "ransom_paid_usd":"Pago (USD)",
                                       "attack_vector_primary":"Ataque"})
            fig13.add_trace(go.Scatter(x=[0, mx], y=[0, mx], mode="lines",
                            line=dict(color="#6b7399", dash="dash", width=1), showlegend=False))
            fig13.update_layout(**PLOTLY_BASE)
            fig13.update_xaxes(tickformat="$.2s")
            fig13.update_yaxes(tickformat="$.2s")
            st.plotly_chart(fig13, use_container_width=True)
        else:
            st.info("Sem dados de ransom nos filtros atuais.")

    st.subheader("Perda Ajustada pela Inflação — Top 15 Países (USD)")
    country_loss = (fdf.groupby("country_name")["inflation_adjusted_usd"]
                    .sum().nlargest(15).reset_index())
    fig14 = px.bar(country_loss, x="country_name", y="inflation_adjusted_usd",
                   color="inflation_adjusted_usd",
                   color_continuous_scale=["#1e2235","#457b9d","#e63946"],
                   template="none",
                   labels={"country_name":"País","inflation_adjusted_usd":"Perda Ajustada (USD)"})
    fig14.update_layout(**PLOTLY_BASE)
    fig14.update_coloraxes(showscale=False)
    fig14.update_yaxes(tickformat="$.2s")
    st.plotly_chart(fig14, use_container_width=True)

# ═══════════════════════════════════════════════════════════════════
# TAB 4 — Impacto de Mercado
# ═══════════════════════════════════════════════════════════════════
with tab4:
    mdf = fdf.dropna(subset=["abnormal_return_1d"])

    if mdf.empty:
        st.info("Nenhum dado de mercado disponível com os filtros atuais.")
    else:
        col_a, col_b = st.columns(2)

        with col_a:
            st.subheader("Retorno Anormal Médio por Vetor de Ataque")
            ar_atk = (mdf.groupby("attack_vector_primary")
                      [["abnormal_return_1d","abnormal_return_7d","abnormal_return_30d"]]
                      .mean().reset_index())
            ar_melt = ar_atk.melt(id_vars="attack_vector_primary", var_name="Janela", value_name="Retorno")
            ar_melt["Janela"] = ar_melt["Janela"].map({
                "abnormal_return_1d": "1 dia",
                "abnormal_return_7d": "7 dias",
                "abnormal_return_30d": "30 dias",
            })
            fig15 = px.bar(ar_melt, x="attack_vector_primary", y="Retorno", color="Janela",
                           barmode="group", template="none", color_discrete_sequence=PALETTE,
                           labels={"attack_vector_primary":"Vetor"})
            fig15.update_layout(**PLOTLY_BASE)
            fig15.update_xaxes(tickangle=-30)
            fig15.update_yaxes(tickformat=".1%")
            st.plotly_chart(fig15, use_container_width=True)

        with col_b:
            st.subheader("CAR 0→30 dias por Setor S&P 500")
            mi_sec = mdf.dropna(subset=["car_0_to_30","sector_index"])
            fig16 = px.box(mi_sec, x="sector_index", y="car_0_to_30",
                           color="sector_index", color_discrete_sequence=PALETTE, template="none",
                           labels={"sector_index":"Índice","car_0_to_30":"CAR 0→30d"})
            fig16.update_layout(**PLOTLY_BASE, showlegend=False)
            fig16.update_xaxes(tickangle=-30)
            fig16.update_yaxes(tickformat=".1%")
            st.plotly_chart(fig16, use_container_width=True)

        col_c, col_d = st.columns(2)

        with col_c:
            st.subheader("Distribuição: Dias para Recuperação do Preço")
            rec_df = mdf.dropna(subset=["days_to_price_recovery"])
            med = rec_df["days_to_price_recovery"].median()
            fig17 = px.histogram(rec_df, x="days_to_price_recovery", color="attack_vector_primary",
                                 nbins=30, template="none", color_discrete_sequence=PALETTE, opacity=.8,
                                 labels={"days_to_price_recovery":"Dias","attack_vector_primary":"Ataque"})
            fig17.add_vline(x=med, line_dash="dash", line_color="#e63946",
                            annotation_text=f"Mediana: {med:.0f}d",
                            annotation_font_color="#e63946")
            fig17.update_layout(**PLOTLY_BASE)
            st.plotly_chart(fig17, use_container_width=True)

        with col_d:
            st.subheader("Volatilidade: Pré vs Pós Incidente")
            vol_df = mdf.dropna(subset=["pre_incident_volatility_30d","post_incident_volatility_30d"])
            mx_vol = max(vol_df["pre_incident_volatility_30d"].max(),
                         vol_df["post_incident_volatility_30d"].max())
            fig18 = px.scatter(vol_df,
                               x="pre_incident_volatility_30d", y="post_incident_volatility_30d",
                               color="attack_vector_primary", size="market_cap_at_disclosure",
                               size_max=18, color_discrete_sequence=PALETTE, template="none",
                               hover_data=["company_name","year"],
                               labels={"pre_incident_volatility_30d":"Volatilidade Pré (30d)",
                                       "post_incident_volatility_30d":"Volatilidade Pós (30d)",
                                       "attack_vector_primary":"Ataque"})
            fig18.add_trace(go.Scatter(x=[0, mx_vol], y=[0, mx_vol], mode="lines",
                            line=dict(color="#6b7399", dash="dash", width=1), showlegend=False))
            fig18.update_layout(**PLOTLY_BASE)
            st.plotly_chart(fig18, use_container_width=True)

        st.subheader("Market Cap no Disclosure vs Perda Total — Escala Log (empresas públicas)")
        pub_df = mdf.dropna(subset=["market_cap_at_disclosure","total_loss_usd"])
        if not pub_df.empty:
            fig19 = px.scatter(pub_df,
                               x="market_cap_at_disclosure", y="total_loss_usd",
                               color="industry_name", size="downtime_hours", size_max=18,
                               color_discrete_sequence=PALETTE, template="none", log_x=True, log_y=True,
                               hover_data=["company_name","stock_ticker","year","attack_vector_primary"],
                               labels={"market_cap_at_disclosure":"Market Cap (USD)",
                                       "total_loss_usd":"Perda Total (USD)",
                                       "industry_name":"Setor"})
            fig19.update_layout(**PLOTLY_BASE)
            fig19.update_xaxes(tickformat="$.2s")
            fig19.update_yaxes(tickformat="$.2s")
            st.plotly_chart(fig19, use_container_width=True)

# ── Raw data explorer ─────────────────────────────────────────────────────────
with st.expander("🔍 Explorar Dados Brutos"):
    cols_show = ["incident_id","company_name","country_name","year","attack_vector_primary",
                 "industry_name","total_loss_usd","downtime_hours","data_compromised_records",
                 "quality_grade","is_public_company","days_to_price_recovery"]
    display_df = (fdf[[c for c in cols_show if c in fdf.columns]]
                  .sort_values("total_loss_usd", ascending=False)
                  .reset_index(drop=True))
    st.markdown(f"**{len(display_df):,} registros** com os filtros atuais")
    st.dataframe(display_df, use_container_width=True, height=350)
    csv_bytes = display_df.to_csv(index=False).encode()
    st.download_button("⬇ Download CSV filtrado", csv_bytes, "cyber_attacks_filtered.csv", "text/csv")