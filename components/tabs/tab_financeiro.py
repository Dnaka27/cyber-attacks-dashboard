import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st

from config.constants import PALETTE, PLOTLY_BASE


def render(fdf: pd.DataFrame) -> None:
    col_a, col_b = st.columns(2)

    with col_a:
        st.subheader("Distribuição de Perda Total (USD)")
        fig10 = px.histogram(
            fdf.dropna(subset=["total_loss_usd"]),
            x="total_loss_usd", color="attack_vector_primary",
            log_y=True, nbins=50, template="none",
            color_discrete_sequence=PALETTE, opacity=0.8, barmode="overlay",
            labels={"total_loss_usd": "Perda Total (USD)", "attack_vector_primary": "Ataque"},
        )
        fig10.update_layout(**PLOTLY_BASE)
        fig10.update_xaxes(tickformat="$.2s")
        st.plotly_chart(fig10, width='stretch')

    with col_b:
        st.subheader("Composição das Perdas (mediana USD)")
        loss_cols = {
            "Perda Direta":      "direct_loss_usd",
            "Custo Recuperação": "recovery_cost_usd",
            "Honorários Legais": "legal_fees_usd",
            "Multa Regulatória": "regulatory_fine_usd",
        }
        medians = {label: fdf[col].median() for label, col in loss_cols.items()}
        fig11 = go.Figure(go.Pie(
            labels=list(medians.keys()),
            values=list(medians.values()),
            hole=0.45,
            marker_colors=PALETTE[:4],
        ))
        fig11.update_layout(**PLOTLY_BASE)
        st.plotly_chart(fig11, width='stretch')

    col_c, col_d = st.columns(2)

    with col_c:
        st.subheader("Perda Mediana por Setor (USD)")
        sec_loss = (
            fdf.groupby("industry_name")["total_loss_usd"]
            .median()
            .sort_values(ascending=True)
            .reset_index()
        )
        fig12 = px.bar(
            sec_loss, x="total_loss_usd", y="industry_name", orientation="h",
            color="total_loss_usd",
            color_continuous_scale=["#1e2235", "#f4a261", "#e63946"],
            template="none",
            labels={"total_loss_usd": "Perda Mediana (USD)", "industry_name": "Setor"},
        )
        fig12.update_layout(**PLOTLY_BASE)
        fig12.update_coloraxes(showscale=False)
        fig12.update_xaxes(tickformat="$.2s")
        st.plotly_chart(fig12, width='stretch')

    with col_d:
        st.subheader("Ransom: Demandado vs Pago (USD)")
        ransom_df = fdf.dropna(subset=["ransom_demanded_usd", "ransom_paid_usd"])
        if not ransom_df.empty:
            mx = max(ransom_df["ransom_demanded_usd"].max(), ransom_df["ransom_paid_usd"].max())
            fig13 = px.scatter(
                ransom_df,
                x="ransom_demanded_usd", y="ransom_paid_usd",
                color="attack_vector_primary", size="total_loss_usd", size_max=20,
                color_discrete_sequence=PALETTE, template="none",
                hover_data=["company_name", "country_name", "year"],
                labels={
                    "ransom_demanded_usd": "Demandado (USD)",
                    "ransom_paid_usd":     "Pago (USD)",
                    "attack_vector_primary": "Ataque",
                },
            )
            fig13.add_trace(go.Scatter(
                x=[0, mx], y=[0, mx], mode="lines",
                line=dict(color="#6b7399", dash="dash", width=1),
                showlegend=False,
            ))
            fig13.update_layout(**PLOTLY_BASE)
            fig13.update_xaxes(tickformat="$.2s")
            fig13.update_yaxes(tickformat="$.2s")
            st.plotly_chart(fig13, width='stretch')
        else:
            st.info("Sem dados de ransom nos filtros atuais.")

    st.subheader("Perda Ajustada pela Inflação — Top 15 Países (USD)")
    country_loss = (
        fdf.groupby("country_name")["inflation_adjusted_usd"]
        .sum()
        .nlargest(15)
        .reset_index()
    )
    fig14 = px.bar(
        country_loss, x="country_name", y="inflation_adjusted_usd",
        color="inflation_adjusted_usd",
        color_continuous_scale=["#1e2235", "#457b9d", "#e63946"],
        template="none",
        labels={"country_name": "País", "inflation_adjusted_usd": "Perda Ajustada (USD)"},
    )
    fig14.update_layout(**PLOTLY_BASE)
    fig14.update_coloraxes(showscale=False)
    fig14.update_yaxes(tickformat="$.2s")
    st.plotly_chart(fig14, width='stretch')