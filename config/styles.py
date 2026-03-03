import streamlit as st
from pathlib import Path


def inject_css() -> None:
    """Lê o arquivo styles.css e injeta no Streamlit."""

    # pega a raiz do projeto (volta uma pasta a partir de config/)
    base_path = Path(__file__).resolve().parent.parent
    
    css_path = base_path / "styles" / "styles.css"

    with open(css_path, encoding="utf-8") as f:
        css = f.read()

    st.markdown(f"<style>{css}</style>", unsafe_allow_html=True)