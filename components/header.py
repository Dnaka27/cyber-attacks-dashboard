import streamlit as st


def render_header(fdf) -> None:
    st.markdown("# Cyber Attacks")
    st.markdown("#### Financial & Market Impact Dashboard")
    st.markdown("---")

    if fdf.empty:
        st.warning("Nenhum dado com os filtros atuais. Ajuste a barra lateral.")
        st.stop()

    col_year, col_country = st.columns(2)

    with col_year:
        year_min = int(fdf["year"].min())
        year_max = int(fdf["year"].max())
        year_range = st.slider("Ano", year_min, year_max, (year_min, year_max))

    with col_country:
        all_countries = sorted(fdf["country_name"].dropna().unique())
        sel_countries = st.multiselect("Paises: ", all_countries, default=["Brazil", "United States", "United Kingdom"])

    mask = (
        fdf["year"].between(*year_range)
        & fdf["country_name"].isin(sel_countries)
    )

    return fdf[mask].copy()
