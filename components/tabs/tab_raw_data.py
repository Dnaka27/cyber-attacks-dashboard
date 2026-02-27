import pandas as pd
import streamlit as st

_COLS_SHOW = [
    "incident_id", "company_name", "country_name", "year",
    "attack_vector_primary", "industry_name", "total_loss_usd",
    "downtime_hours", "data_compromised_records",
    "quality_grade", "is_public_company", "days_to_price_recovery",
]


def render(fdf: pd.DataFrame) -> None:
    """Expander com tabela filtrável e botão de download."""
    with st.expander("🔍 Explorar Dados Brutos"):
        cols = [c for c in _COLS_SHOW if c in fdf.columns]
        display_df = (
            fdf[cols]
            .sort_values("total_loss_usd", ascending=False)
            .reset_index(drop=True)
        )

        st.markdown(f"**{len(display_df):,} registros** com os filtros atuais")
        st.dataframe(display_df, use_container_width=True, height=350)

        csv_bytes = display_df.to_csv(index=False).encode()
        st.download_button(
            "⬇ Download CSV filtrado",
            csv_bytes,
            "cyber_attacks_filtered.csv",
            "text/csv",
        )