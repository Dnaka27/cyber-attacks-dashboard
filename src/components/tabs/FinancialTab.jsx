import Exhibit from "../Exhibit";
import LossCompositionDonut from "../charts/LossCompositionDonut";
import MedianLossBySectorBar from "../charts/MedianLossBySectorBar";

export default function FinancialTab({ fdf }) {
  return (
    <div className="exhibit-flow">
      <Exhibit tag="2.1" title="Composição da perda mediana">
        <LossCompositionDonut fdf={fdf} />
      </Exhibit>
      <Exhibit tag="2.2" title="Perda mediana por setor">
        <MedianLossBySectorBar fdf={fdf} />
      </Exhibit>
    </div>
  );
}
