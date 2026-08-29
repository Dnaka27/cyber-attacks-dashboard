import Exhibit from "../Exhibit";
import AbnormalReturnByVectorBar from "../charts/AbnormalReturnByVectorBar";
import RecoveryDaysHistogram from "../charts/RecoveryDaysHistogram";

export default function MarketTab({ fdf }) {
  const mdf = fdf.filter((r) => r.abnormal_return_1d !== null);

  if (mdf.length === 0) {
    return <p className="muted-note">No market data available with the current filters.</p>;
  }

  return (
    <div className="exhibit-flow">
      <Exhibit tag="3.1" title="Mean abnormal return, by attack vector">
        <AbnormalReturnByVectorBar fdf={mdf} />
      </Exhibit>
      <Exhibit tag="3.2" title="Stock price recovery time">
        <RecoveryDaysHistogram fdf={mdf} />
      </Exhibit>
    </div>
  );
}
