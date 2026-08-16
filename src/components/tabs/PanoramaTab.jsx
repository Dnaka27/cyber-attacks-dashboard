import Exhibit from "../Exhibit";
import TotalLossByYearLine from "../charts/TotalLossByYearLine";
import AttackVectorBarH from "../charts/AttackVectorBarH";

export default function PanoramaTab({ fdf }) {
  return (
    <div className="exhibit-flow">
      <Exhibit tag="1.1" title="Perda total apurada por ano">
        <TotalLossByYearLine fdf={fdf} />
      </Exhibit>
      <Exhibit tag="1.2" title="Vetores de ataque mais comuns">
        <AttackVectorBarH fdf={fdf} />
      </Exhibit>
    </div>
  );
}
