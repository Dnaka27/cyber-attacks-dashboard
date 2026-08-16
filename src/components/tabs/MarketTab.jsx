import Exhibit from "../Exhibit";
import AbnormalReturnByVectorBar from "../charts/AbnormalReturnByVectorBar";
import RecoveryDaysHistogram from "../charts/RecoveryDaysHistogram";

export default function MarketTab({ fdf }) {
  const mdf = fdf.filter((r) => r.abnormal_return_1d !== null);

  if (mdf.length === 0) {
    return <p className="muted-note">Nenhum dado de mercado disponível com os filtros atuais.</p>;
  }

  return (
    <div className="exhibit-flow">
      <Exhibit tag="3.1" title="Retorno anormal médio, por vetor de ataque">
        <AbnormalReturnByVectorBar fdf={mdf} />
      </Exhibit>
      <Exhibit tag="3.2" title="Tempo de recuperação do preço da ação">
        <RecoveryDaysHistogram fdf={mdf} />
      </Exhibit>
    </div>
  );
}
