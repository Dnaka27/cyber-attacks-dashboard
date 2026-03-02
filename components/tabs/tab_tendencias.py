import pandas as pd
import streamlit as st
import altair as alt


PALETTE = [
    "#1e2235",
    "#457b9d",
    "#a8dadc",
    "#f4a261",
    "#e63946",
]


def render(fdf: pd.DataFrame) -> None:
    col_a, col_b = st.columns(2)

    with col_a:
        st.subheader("Incidentes por Ano")

        year_atk = (
            fdf.groupby(["year", "attack_vector_primary"])
            .size()
            .reset_index(name="count")
        )

        categorias = (
            year_atk["attack_vector_primary"]
            .dropna()
            .unique()
            .tolist()
        )

        chart1 = (
            alt.Chart(year_atk)
            .mark_area(opacity=0.85)
            .encode(
                x=alt.X("year:O", title="Ano"),
                y=alt.Y("count:Q", title="Incidentes", stack="zero"),
                color=alt.Color(
                    "attack_vector_primary:N",
                    scale=alt.Scale(
                        domain=categorias,
                        scheme="category20",
                    ),
                    title="Ataque",
                ),
                tooltip=[
                    alt.Tooltip("year:O", title="Ano"),
                    alt.Tooltip("attack_vector_primary:N", title="Ataque"),
                    alt.Tooltip("count:Q", title="Incidentes"),
                ],
            )
        )

        st.altair_chart(chart1, width='stretch')

    with col_b:
        st.subheader("Perda Total por Ano (USD)")

        loss_yr = (
            fdf.groupby("year")["total_loss_usd"]
            .sum()
            .reset_index()
        )

        base = alt.Chart(loss_yr).encode(
            x=alt.X("year:O", title="Ano"),
            y=alt.Y(
                "total_loss_usd:Q",
                title="Total Loss (USD)",
                axis=alt.Axis(format="$,.2s"),
            ),
        )

        line = base.mark_line(
            color="#e63946",
            strokeWidth=2
        )

        points = base.mark_circle(
            size=60,
            color="#e63946"
        )

        labels = base.mark_text(
            align="center",
            dy=-12,
            size=12,
            color="white"
        ).encode(
            text=alt.Text("total_loss_usd:Q", format="$.2s")
        )

        chart = line + points + labels

        st.altair_chart(chart, width='stretch')

    col_c, col_d = st.columns(2)

    with col_c:
        st.subheader("Empresas Públicas vs Privadas por Ano")

        pub_yr = (
            fdf.groupby(["year", "is_public_company"])
            .size()
            .reset_index(name="count")
        )

        pub_yr["tipo"] = pub_yr["is_public_company"].map({
            True: "Pública",
            False: "Privada"
        })

        base = alt.Chart(pub_yr).encode(
            x=alt.X("year:O", title="Ano"),
            y=alt.Y("count:Q", title="Incidentes", stack="zero"),
            color=alt.Color(
                "tipo:N",
                scale=alt.Scale(
                    domain=["Pública", "Privada"],
                    scheme="category20",
                ),
                title="Tipo",
            ),
        )

        bars = base.mark_bar()

        labels = base.mark_text(
            dy=-6,
            size=12,
            fontWeight="bold",
            color="white"
        ).encode(
            text="count:Q"
        )

        st.altair_chart(bars + labels, width='stretch')

    with col_d:
        st.subheader("Quality Grade dos Dados por Ano")

        grade_yr = (
            fdf.groupby(["year", "quality_grade"])
            .size()
            .reset_index(name="count")
        )

        base = alt.Chart(grade_yr).encode(
            x=alt.X("year:O", title="Ano"),
            y=alt.Y("count:Q", title="Incidentes"),
            xOffset="quality_grade:N",
            color=alt.Color(
                "quality_grade:N",
                scale=alt.Scale(
                    domain=["Gold", "Silver", "Bronze"],
                    scheme="category20",
                ),
                title="Grade",
            ),
        )

        bars = base.mark_bar()

        labels = base.mark_text(
            dy=-6,
            size=9,
        ).encode(
            text="count:Q"
        )

        st.altair_chart(bars + labels, width='stretch')
