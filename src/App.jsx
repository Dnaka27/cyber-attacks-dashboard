import { useState } from "react";
import FilterDock from "./components/layout/FilterDock";
import ActiveFilters from "./components/layout/ActiveFilters";
import Hero from "./components/layout/Hero";
import Chapter from "./components/layout/Chapter";
import TabBar from "./components/layout/TabBar";
import Exhibit from "./components/Exhibit";
import TotalLossByYearLine from "./components/charts/TotalLossByYearLine";
import AttackVectorBarH from "./components/charts/AttackVectorBarH";
import LossCompositionDonut from "./components/charts/LossCompositionDonut";
import MedianLossBySectorBar from "./components/charts/MedianLossBySectorBar";
import AbnormalReturnByVectorBar from "./components/charts/AbnormalReturnByVectorBar";
import RecoveryDaysHistogram from "./components/charts/RecoveryDaysHistogram";
import RawDataTable from "./components/RawDataTable";
import { useFilteredData } from "./lib/useFilteredData";
import { useFilters } from "./context/FilterContext";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "panorama", label: "Panorama" },
  { id: "financial", label: "Financial" },
  { id: "market", label: "Market" },
  { id: "docket", label: "Docket" },
];

function EmptyState({ children }) {
  const { reset } = useFilters();
  return (
    <div className="empty-state">
      <p>{children}</p>
      <button type="button" className="drawer-reset" onClick={reset}>
        Reset filters
      </button>
    </div>
  );
}

function App() {
  const fdf = useFilteredData();
  const mdf = fdf.filter((r) => r.abnormal_return_1d !== null);
  const [tab, setTab] = useState("overview");

  function selectTab(id) {
    setTab(id);
    window.scrollTo({ top: 0 });
  }

  return (
    <div className="app">
      <TabBar
        tabs={TABS}
        active={tab}
        onChange={selectTab}
        onHome={() => selectTab("overview")}
        actions={<FilterDock />}
      />
      <ActiveFilters />
      <main className="page">
        <div
          key={tab}
          className="tab-panel"
          role="tabpanel"
          id={`panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
        >
          {tab === "overview" ? (
            <Hero fdf={fdf} />
          ) : fdf.length === 0 ? (
            <EmptyState>No incidents match the current filters.</EmptyState>
          ) : (
            <>
              {tab === "panorama" && (
                <Chapter
                  number="01"
                  title="Panorama"
                  blurb="How much was lost each year, and through which doors attackers got in."
                >
                  <div className="exhibit-flow">
                    <Exhibit tag="1.1" title="Total loss recorded by year">
                      <TotalLossByYearLine fdf={fdf} />
                    </Exhibit>
                    <Exhibit tag="1.2" title="Most common attack vectors">
                      <AttackVectorBarH fdf={fdf} />
                    </Exhibit>
                  </div>
                </Chapter>
              )}

              {tab === "financial" && (
                <Chapter
                  number="02"
                  title="Financial impact"
                  blurb="What a typical incident costs, and which sectors carry the heaviest bills."
                >
                  <div className="exhibit-flow">
                    <Exhibit tag="2.1" title="Median loss composition">
                      <LossCompositionDonut fdf={fdf} />
                    </Exhibit>
                    <Exhibit tag="2.2" title="Median loss by sector">
                      <MedianLossBySectorBar fdf={fdf} />
                    </Exhibit>
                  </div>
                </Chapter>
              )}

              {tab === "market" && (
                <Chapter
                  number="03"
                  title="Market impact"
                  blurb="How listed companies' stock prices reacted, and how long they took to recover."
                >
                  {mdf.length === 0 ? (
                    <EmptyState>
                      No market data with the current filters. Stock reactions exist only for
                      public companies.
                    </EmptyState>
                  ) : (
                    <div className="exhibit-flow">
                      <Exhibit tag="3.1" title="Mean abnormal return, by attack vector">
                        <AbnormalReturnByVectorBar fdf={mdf} />
                      </Exhibit>
                      <Exhibit tag="3.2" title="Stock price recovery time">
                        <RecoveryDaysHistogram fdf={mdf} />
                      </Exhibit>
                    </div>
                  )}
                </Chapter>
              )}

              {tab === "docket" && (
                <Chapter
                  number="04"
                  title="Docket"
                  blurb="The underlying records. Click a column header to sort."
                >
                  <RawDataTable fdf={fdf} />
                </Chapter>
              )}
            </>
          )}
        </div>

        <footer className="report-footer">
          Source: Kaggle — Cyber Attacks Financial &amp; Market Impact Dataset. Static data,
          processed once.
        </footer>
      </main>
    </div>
  );
}

export default App;
