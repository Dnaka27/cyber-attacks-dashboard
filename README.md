# Cyber Attacks — Financial & Market Impact Dashboard

Interactive Streamlit dashboard for the [Kaggle Cyber Attacks dataset](https://www.kaggle.com/datasets/aryanmdev/cyber-attacks-financial-and-market-impact/data).

---

## Technologies

![Python](https://img.shields.io/badge/Python-1F2194?style=for-the-badge&logo=python&logoColor=white)
![Streamlit](https://img.shields.io/badge/Streamlit-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white)
![Plotly](https://img.shields.io/badge/Plotly-5B00E8?style=for-the-badge&logo=plotly&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=pandas&logoColor=white)

---

## About

Visualizes financial and market impact data from cyber attacks across four tabs. Sidebar filters allow scoping by year range, sector, attack type, severity, and minimum financial loss.

| Tab | Content |
|---|---|
| Trends | Cumulative incidents by year, financial loss over time, severity distribution |
| Attack Analysis | Ranking by attack type, sector x attack heatmap, recovery boxplot |
| Financial Impact | Loss histogram, ransom payment rate, market cap vs stock drop, correlation matrix |
| Geographic | World choropleth, loss by country, attacks by country |

---

## Installation

```bash
pip install -r requirements.txt
```

Download `cyber_attacks.csv` from [Kaggle](https://www.kaggle.com/datasets/aryanmdev/cyber-attacks-financial-and-market-impact/data) and place it in the same folder as `app.py`.

```bash
streamlit run app.py
```

---

## License

This project is licensed under the MIT License.

---

## Contact

[![LinkedIn](https://img.shields.io/badge/LinkedIn-78d?style=for-the-badge&logo=linkedin&logoColor=0A0AAF)](https://www.linkedin.com/in/diogo-oike-kanefuku-23639b223/) 
[![E-mail](https://img.shields.io/badge/-Email-e9a?style=for-the-badge&logo=gmail&logoColor=E94D5F)](mailto:diogooikejapan@gmail.com)
