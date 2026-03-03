import pandas as pd
import streamlit as st

from config.constants import NAICS, COUNTRY_NAMES

_FINANCIAL_COLS = [
    "incident_id", "total_loss_usd", "direct_loss_usd", "recovery_cost_usd",
    "legal_fees_usd", "regulatory_fine_usd", "insurance_payout_usd",
    "ransom_demanded_usd", "ransom_paid_usd", "inflation_adjusted_usd",
]

_MARKET_COLS = [
    "incident_id", "abnormal_return_1d", "abnormal_return_7d", "abnormal_return_30d",
    "car_0_to_30", "car_0_to_90", "days_to_price_recovery", "market_cap_at_disclosure",
    "volume_ratio_disclosure", "pre_incident_volatility_30d", "post_incident_volatility_30d",
    "price_7d_before", "price_disclosure_day", "price_30d_after", "sector_index",
]


@st.cache_data
def load_data() -> pd.DataFrame:
    """
    Lê os três CSVs de data/, aplica transformações e retorna
    um DataFrame único com todas as colunas necessárias.
    """
    fi = pd.read_csv("data/financial_impact.csv")
    im = pd.read_csv("data/incidents_master.csv")
    mi = pd.read_csv("data/market_impact.csv")

    # ── Transformações em incidents_master ───────────────────────
    im["incident_date"] = pd.to_datetime(im["incident_date"], errors="coerce")
    im["year"] = im["incident_date"].dt.year

    im["industry_name"] = (
        im["industry_primary"].astype(str).map(NAICS)
        .fillna(im["industry_primary"].astype(str))
    )
    im["country_name"] = (
        im["country_hq"].map(COUNTRY_NAMES)
        .fillna(im["country_hq"])
    )
    im["attack_vector_primary"] = (
        im["attack_vector_primary"].str.replace("_", " ").str.title()
    )

    # ── Merges ────────────────────────────────────────────────────
    df = im.merge(fi[_FINANCIAL_COLS], on="incident_id", how="left")
    df = df.merge(mi[_MARKET_COLS],    on="incident_id", how="left")

    return df
