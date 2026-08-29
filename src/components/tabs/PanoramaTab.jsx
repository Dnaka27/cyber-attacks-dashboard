import Exhibit from "../Exhibit";
import TotalLossByYearLine from "../charts/TotalLossByYearLine";
import AttackVectorBarH from "../charts/AttackVectorBarH";

export default function PanoramaTab({ fdf }) {
  return (
    <div className="exhibit-flow">
      <Exhibit tag="1.1" title="Total loss recorded by year">
        <TotalLossByYearLine fdf={fdf} />
      </Exhibit>
      <Exhibit tag="1.2" title="Most common attack vectors">
        <AttackVectorBarH fdf={fdf} />
      </Exhibit>
    </div>
  );
}
