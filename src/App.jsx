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
          <p className="empty-state">No incidents match the current filters. Adjust the filters in the sidebar.</p>
        ) : (
          <>
            <Kpis fdf={fdf} />
            <Tabs
              tabs={[
                { label: "I. Panorama", content: <PanoramaTab fdf={fdf} /> },
                { label: "II. Financial Impact", content: <FinancialTab fdf={fdf} /> },
                { label: "III. Market Impact", content: <MarketTab fdf={fdf} /> },
                { label: "Docket", content: <RawDataTable fdf={fdf} /> },
              ]}
            />
          </>
        )}

        <footer className="report-footer">
          Source: Kaggle — Cyber Attacks Financial &amp; Market Impact Dataset. Static data,
          processed once.
        </footer>
      </div>
    </div>
  );
}

export default App;
