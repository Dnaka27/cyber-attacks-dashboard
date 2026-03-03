import streamlit as st

from config.styles import inject_css
from data_loader.loader import load_data
from components.sidebar import render_sidebar
from components.kpis import render_kpis
from components.tabs import (
    tab_tendencias,
    tab_ataques,
    tab_financeiro,
    tab_mercado,
    tab_raw_data,
)

st.set_page_config(
    page_title="Cyber Attacks · Financial & Market Impact",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded",
)

inject_css()

# ── Carregar dados
try:
    df = load_data()
except FileNotFoundError as e:
    st.error(
        f"Arquivo não encontrado: {e}\n\n"
        "Verifique se a pasta `data/` contém os três CSVs."
    )
    st.stop()

fdf = render_sidebar(df)

# ── Header
st.markdown("# Cyber Attacks")
st.markdown("#### Financial & Market Impact Dashboard")
st.markdown("---")

if fdf.empty:
    st.warning("Nenhum dado com os filtros atuais. Ajuste a barra lateral.")
    st.stop()

# ── KPIs
render_kpis(fdf)
st.markdown("---")

# ── Tabs
tab1, tab2, tab3, tab4 = st.tabs([
    "Tendências",
    "Ataques",
    "Impacto Financeiro",
    "Impacto de Mercado",
])

with tab1:
    tab_tendencias.render(fdf)

with tab2:
    tab_ataques.render(fdf)

with tab3:
    tab_financeiro.render(fdf)

with tab4:
    tab_mercado.render(fdf)

# ── Raw data
st.divider()
tab_raw_data.render(fdf)
