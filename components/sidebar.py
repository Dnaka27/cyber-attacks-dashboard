import pandas as pd
import streamlit as st


def render_sidebar(df: pd.DataFrame) -> pd.DataFrame:
    """
    Renderiza os widgets de filtro na sidebar e retorna
    o DataFrame já filtrado (fdf).
    """
    with st.sidebar:
        st.markdown("## 🛡️ Filtros")
        st.markdown("---")

        # ── Ano ───────────────────────────────────────────────────
        year_min = int(df["year"].min())
        year_max = int(df["year"].max())
        year_range = st.slider("Ano", year_min, year_max, (year_min, year_max))

        # ── Vetor de ataque ───────────────────────────────────────
        all_attacks = sorted(df["attack_vector_primary"].dropna().unique())
        sel_attacks = st.multiselect("Vetor de Ataque", all_attacks, default=all_attacks)

        # ── Setor ─────────────────────────────────────────────────
        all_industries = sorted(df["industry_name"].dropna().unique())
        sel_industries = st.multiselect("Setor (NAICS)", all_industries, default=all_industries)

        # ── País ──────────────────────────────────────────────────
        all_countries = sorted(df["country_name"].dropna().unique())
        sel_countries = st.multiselect("País (HQ)", all_countries, default=all_countries)

        # ── Quality grade ─────────────────────────────────────────
        all_grades = ["Gold", "Silver", "Bronze"]
        sel_grades = st.multiselect("Quality Grade", all_grades, default=all_grades)

        st.markdown("---")
        only_public = st.checkbox("Apenas empresas públicas", value=False)

    # ── Aplicar filtros ───────────────────────────────────────────
    mask = (
        df["year"].between(*year_range)
        & df["attack_vector_primary"].isin(sel_attacks)
        & df["industry_name"].isin(sel_industries)
        & df["country_name"].isin(sel_countries)
        & df["quality_grade"].isin(sel_grades)
    )
    if only_public:
        mask &= df["is_public_company"] == True

    return df[mask].copy()