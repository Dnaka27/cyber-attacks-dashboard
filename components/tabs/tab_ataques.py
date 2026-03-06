import pandas as pd
import streamlit as st
import altair as alt


def render(fdf: pd.DataFrame) -> None:
    col_a, col_b = st.columns(2)

    with col_a:
        st.subheader("Vetores de Ataque Mais Comuns")

        atk_counts = (
            fdf["attack_vector_primary"]
            .value_counts()
            .reset_index()
        )
        atk_counts.columns = ["attack", "count"]

        chart1 = (
            alt.Chart(atk_counts)
            .mark_bar()
            .encode(
                x=alt.X("count:Q", title="Incidentes"),
                y=alt.Y("attack:N", sort="-x", title="Vetor"),
                color=alt.Color(
                    "attack:N",
                    scale=alt.Scale(scheme="category10"),
                    legend=None,
                ),
            )
        )

        labels = (
            alt.Chart(atk_counts)
            .mark_text(
                align="left",
                baseline="middle",
                dx=3,
                size=12,
                color="white",
                fontWeight="bold",
            )
            .encode(
                x="count:Q",
                y=alt.Y("attack:N", sort="-x"),
                text="count:Q",
            )
        )

        st.altair_chart(chart1 + labels, width="stretch")

        downtime_avg = (
            fdf.dropna(subset=["downtime_hours"])
            .groupby("attack_vector_primary")["downtime_hours"]
            .mean()
            .reset_index()
        )

        chart2 = (
            alt.Chart(downtime_avg)
            .mark_bar()
            .encode(
                x=alt.X("attack_vector_primary:N", title="Ataque"),
                y=alt.Y("downtime_hours:Q", title="Horas"),
                color=alt.Color(
                    "attack_vector_primary:N",
                    scale=alt.Scale(scheme="category10"),
                    legend=None,
                ),
            )
        )

        labels2 = (
            alt.Chart(downtime_avg)
            .mark_text(
                align="center",
                dy=-12,
                size=12,
                color="white",
                fontWeight="bold"
            )
            .encode(
                x="attack_vector_primary:N",
                y=alt.Y("downtime_hours:Q", sort="-x"),
                text=alt.Text("downtime_hours:Q", format=".2f"),
            )
        )

        st.subheader("Downtime por Vetor de Ataque (horas)")
        st.altair_chart(chart2 + labels2, width='stretch')

    with col_b:
        st.subheader("Heatmap: Ataque × Setor")

        heat = (
            fdf.groupby(["industry_name", "attack_vector_primary"])
            .size()
            .reset_index(name="count")
        )

        chart3 = (
            alt.Chart(heat)
            .mark_rect()
            .encode(
                x=alt.X("attack_vector_primary:N", title="Vetor"),
                y=alt.Y("industry_name:N", title="Setor"),
                color=alt.Color(
                    "count:Q",
                    scale=alt.Scale(range=["#1e2235", "#e63946"]),
                    title="Incidentes",
                ),
            )
        )

        st.altair_chart(chart3, width='stretch', height="stretch")

    col_c, col_d = st.columns([1, 2])

    with col_c:
        st.subheader("Confiança de Atribuição")

        conf_counts = (
            fdf["attribution_confidence"]
            .value_counts()
            .reset_index()
        )
        conf_counts.columns = ["confiança", "count"]

        total = conf_counts["count"].sum()

        chart4 = (
            alt.Chart(conf_counts)
            .mark_arc(innerRadius=60, outerRadius=120)
            .encode(
                theta="count:Q",
                color=alt.Color(
                    "confiança:N",
                    scale=alt.Scale(scheme="category10"),
                )
            )
        )

        center_text = (
            alt.Chart({"values": [{"x": 0, "y": 0, "total": total}]})
            .mark_text(
                size=24,
                color="white",
                fontWeight="bold",
                align="center"
            )
            .encode(
                x=alt.value(0),
                y=alt.value(0),
                text=alt.Text("total:Q")
            )
        )

        st.altair_chart(chart4 + center_text, width="stretch")

    with col_d:
        st.subheader("Registros Comprometidos por Setor")

        sec_rec = (
            fdf.groupby("industry_name")["data_compromised_records"]
            .sum()
            .reset_index()
        )

        chart5 = (
            alt.Chart(sec_rec)
            .mark_bar()
            .encode(
                x=alt.X("industry_name:N", sort="-y", title="Setor"),
                y=alt.Y("data_compromised_records:Q", title="Registros"),
                color=alt.Color(
                    "data_compromised_records:Q",
                    scale=alt.Scale(range=["#1e2235", "#f4a261", "#e63946"]),
                    legend=None,
                ),
            )
        )

        st.altair_chart(chart5, width='stretch')
