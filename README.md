# 🛡️ Cyber Attacks — Financial & Market Impact Dashboard

Interactive Streamlit dashboard for the [Kaggle dataset](https://www.kaggle.com/datasets/aryanmdev/cyber-attacks-financial-and-market-impact/data).

## Quick start

```bash
pip install -r requirements.txt
streamlit run app.py
```

## Usando o dataset real do Kaggle

1. Baixe `cyber_attacks.csv` do Kaggle e salve na mesma pasta que `app.py`.
2. Substitua a função `load_data()` em `app.py` pela linha abaixo:

```python
@st.cache_data
def load_data():
    return pd.read_csv("cyber_attacks.csv")
```

> Os nomes das colunas podem variar — ajuste os `groupby`, `x=`, `y=` de acordo com o CSV real.

## Features

| Tab | Conteúdo |
|-----|----------|
| 📈 Trends | Área acumulada de incidentes por ano, perda financeira ao longo do tempo, distribuição de severidade |
| 🎯 Attack Analysis | Ranking por tipo de ataque, heatmap setor × ataque, boxplot de recuperação, scatter detecção × recuperação |
| 💸 Financial Impact | Histograma de perdas, taxa de pagamento de ransom, market cap × queda de ação, correlação numérica |
| 🌍 Geographic | Choropleth mundial, perda por país, ataque por país |

## Sidebar filters
- Intervalo de anos
- Setor, tipo de ataque, severidade
- Perda financeira mínima