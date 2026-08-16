import Masthead from "./components/layout/Masthead";
import FilterBar from "./components/layout/FilterBar";
import Tabs from "./components/layout/Tabs";
import Kpis from "./components/layout/Kpis";
import PanoramaTab from "./components/tabs/PanoramaTab";
import FinancialTab from "./components/tabs/FinancialTab";
import MarketTab from "./components/tabs/MarketTab";
import RawDataTable from "./components/RawDataTable";
import { useFilteredData } from "./lib/useFilteredData";

function App() {
  const fdf = useFilteredData();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Masthead />
        <FilterBar />
      </aside>
      <div className="main">
        {fdf.length === 0 ? (
          <p className="empty-state">Nenhum incidente com os filtros atuais. Ajuste os filtros ao lado.</p>
        ) : (
          <>
            <Kpis fdf={fdf} />
            <Tabs
              tabs={[
                { label: "I. Panorama", content: <PanoramaTab fdf={fdf} /> },
                { label: "II. Impacto financeiro", content: <FinancialTab fdf={fdf} /> },
                { label: "III. Impacto de mercado", content: <MarketTab fdf={fdf} /> },
                { label: "Docket", content: <RawDataTable fdf={fdf} /> },
              ]}
            />
          </>
        )}

        <footer className="report-footer">
          Fonte: Kaggle — Cyber Attacks Financial &amp; Market Impact Dataset. Dados estáticos,
          processados uma única vez.
        </footer>
      </div>
    </div>
  );
}

export default App;
