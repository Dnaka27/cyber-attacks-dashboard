import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st

from config.constants import PALETTE, PLOTLY_BASE


def render(fdf: pd.DataFrame) -> None:
    mdf = fdf.dropna(subset=["abnormal_return_1d"])

    if mdf.empty:
        st.info("Nenhum dado de mercado disponível com os filtros atuais.")
        return

    col_a, col_b = st.columns(2)

    with col_a:
        st.subheader("Retorno Anormal Médio por Vetor de Ataque")
        ar_atk = (
            mdf.groupby("attack_vector_primary")
            [["abnormal_return_1d", "abnormal_return_7d", "abnormal_return_30d"]]
            .mean()
            .reset_index()
        )
        ar_melt = ar_atk.melt(
            id_vars="attack_vector_primary",
            var_name="Janela",
            value_name="Retorno",
        )
        ar_melt["Janela"] = ar_melt["Janela"].map({
            "abnormal_return_1d":  "1 dia",
            "abnormal_return_7d":  "7 dias",
            "abnormal_return_30d": "30 dias",
        })
        fig15 = px.bar(
            ar_melt, x="attack_vector_primary", y="Retorno", color="Janela",
            barmode="group", template="none", color_discrete_sequence=PALETTE,
            labels={"attack_vector_primary": "Vetor"},
        )
        fig15.update_layout(**PLOTLY_BASE)
        fig15.update_xaxes(tickangle=-30)
        fig15.update_yaxes(tickformat=".1%")
        st.plotly_chart(fig15, use_container_width=True)

    with col_b:
        st.subheader("CAR 0→30 dias por Setor S&P 500")
        mi_sec = mdf.dropna(subset=["car_0_to_30", "sector_index"])
        fig16 = px.box(
            mi_sec, x="sector_index", y="car_0_to_30",
            color="sector_index", color_discrete_sequence=PALETTE, template="none",
            labels={"sector_index": "Índice", "car_0_to_30": "CAR 0→30d"},
        )
        fig16.update_layout(**PLOTLY_BASE, showlegend=False)
        fig16.update_xaxes(tickangle=-30)
        fig16.update_yaxes(tickformat=".1%")
        st.plotly_chart(fig16, use_container_width=True)

    col_c, col_d = st.columns(2)

    with col_c:
        st.subheader("Distribuição: Dias para Recuperação do Preço")
        rec_df = mdf.dropna(subset=["days_to_price_recovery"])
        med = rec_df["days_to_price_recovery"].median()
        fig17 = px.histogram(
            rec_df, x="days_to_price_recovery", color="attack_vector_primary",
            nbins=30, template="none",
            color_discrete_sequence=PALETTE, opacity=0.8,
            labels={"days_to_price_recovery": "Dias", "attack_vector_primary": "Ataque"},
        )
        fig17.add_vline(
            x=med, line_dash="dash", line_color="#e63946",
            annotation_text=f"Mediana: {med:.0f}d",
            annotation_font_color="#e63946",
        )
        fig17.update_layout(**PLOTLY_BASE)
        st.plotly_chart(fig17, use_container_width=True)

    with col_d:
        st.subheader("Volatilidade: Pré vs Pós Incidente")
        vol_df = mdf.dropna(subset=["pre_incident_volatility_30d", "post_incident_volatility_30d"])
        mx_vol = max(
            vol_df["pre_incident_volatility_30d"].max(),
            vol_df["post_incident_volatility_30d"].max(),
        )
        fig18 = px.scatter(
            vol_df,
            x="pre_incident_volatility_30d", y="post_incident_volatility_30d",
            color="attack_vector_primary", size="market_cap_at_disclosure", size_max=18,
            color_discrete_sequence=PALETTE, template="none",
            hover_data=["company_name", "year"],
            labels={
                "pre_incident_volatility_30d":  "Volatilidade Pré (30d)",
                "post_incident_volatility_30d": "Volatilidade Pós (30d)",
                "attack_vector_primary":        "Ataque",
            },
        )
        fig18.add_trace(go.Scatter(
            x=[0, mx_vol], y=[0, mx_vol], mode="lines",
            line=dict(color="#6b7399", dash="dash", width=1),
            showlegend=False,
        ))
        fig18.update_layout(**PLOTLY_BASE)
        st.plotly_chart(fig18, use_container_width=True)
        