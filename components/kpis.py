import pandas as pd
import streamlit as st


def render_kpis(fdf: pd.DataFrame) -> None:
    """Renderiza a linha de 6 KPIs no topo do dashboard."""
    c1, c2, c3, c4, c5, c6 = st.columns(6)

    c1.metric("Incidentes",           f"{len(fdf):,}")
    c2.metric("Perda Total",          f"${fdf['total_loss_usd'].sum() / 1e9:.2f}B")
    c3.metric("Perda Mediana",        f"${fdf['total_loss_usd'].median() / 1e6:.1f}M")
    c4.metric("Registros Vazados",    f"{fdf['data_compromised_records'].sum() / 1e6:.1f}M")
    c5.metric("Retorno Anormal (1d)", f"{fdf['abnormal_return_1d'].mean() * 100:.2f}%")
    c6.metric("Recuperação Mediana",  f"{fdf['days_to_price_recovery'].median():.0f} dias")