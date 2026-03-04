import pandas as pd
import streamlit as st


def map_countries():
    pass


def render_sidebar(df: pd.DataFrame) -> pd.DataFrame:
    """
    Renderiza os widgets de filtro na sidebar e retorna
    o DataFrame já filtrado (fdf).
    """
    with st.sidebar:
        st.markdown("## 🛡️ Filtros")
        st.markdown("---")

        # ── Vetor de ataque ───────────────────────────────────────
        all_attacks = sorted(df["attack_vector_primary"].dropna().unique())
        sel_attacks = st.multiselect("Vetor de Ataque", all_attacks, default=all_attacks)

        # ── Setor ─────────────────────────────────────────────────
        all_industries = sorted(df["industry_name"].dropna().unique())
        sel_industries = st.multiselect("Setor (NAICS)", all_industries, default=all_industries)

        # ── Quality grade ─────────────────────────────────────────
        all_grades = ["Gold", "Silver", "Bronze"]
        sel_grades = st.multiselect("Quality Grade", all_grades, default=all_grades)

        st.markdown("---")
        only_public = st.checkbox("Apenas empresas públicas", value=False)

    # ── Aplicar filtros ───────────────────────────────────────────
    mask = (
        df["attack_vector_primary"].isin(sel_attacks)
        & df["industry_name"].isin(sel_industries)
        & df["quality_grade"].isin(sel_grades)
    )
    if only_public:
        mask = mask & (df["is_public_company"] == True)

    return df[mask].copy()
