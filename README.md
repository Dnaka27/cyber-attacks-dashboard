# Cyber Attacks — Financial & Market Impact Dashboard

Interactive web dashboard for the [Kaggle Cyber Attacks dataset](https://www.kaggle.com/datasets/aryanmdev/cyber-attacks-financial-and-market-impact/data).

---

## Technologies

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## About

Visualizes financial and market impact data from cyber attacks as a tabbed report that fits the screen (no page scroll on desktop): an Overview with a 3D globe and KPIs, then tabs with animated SVG charts. A filter drawer holds the year range, country, sector, attack vector, quality grade, and public companies, with removable chips for the active ones. Clicking a country on the globe shows that country's KPIs; clicking one in the ranking also toggles it in the country filter.

| Tab | Content |
|---|---|
| Panorama | Financial loss over time, attack vector ranking |
| Financial Impact | Loss composition, median loss by sector |
| Market Impact | Abnormal stock return by vector, price recovery time |
| Docket | Raw filtered incident data, CSV export |

Data is 100% static: the dataset is pre-processed once (from the original pandas pipeline) into `src/data/data.json`, and all filtering/aggregation runs client-side. No backend, no database.

---

## Installation

```bash
npm install
npm run dev
```

```bash
npm run build    # production build to dist/
```

---

## License

This project is licensed under the MIT License.

---

## Contact

[![LinkedIn](https://img.shields.io/badge/LinkedIn-78d?style=for-the-badge&logo=linkedin&logoColor=0A0AAF)](https://www.linkedin.com/in/diogo-oike-kanefuku-23639b223/) 
[![E-mail](https://img.shields.io/badge/-Email-e9a?style=for-the-badge&logo=gmail&logoColor=E94D5F)](mailto:diogooikejapan@gmail.com)
