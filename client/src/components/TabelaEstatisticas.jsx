import TabelaData from "./TabelaData";

function TabelaEstatisticas({ titulo, headerUm, headerDois, dados }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-bold text-[var(--roxo-principal)] "> {titulo}</h3>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse ">
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th className="text-[var(--cinza-texto)] text-xs">{headerUm}</th>
              <th className="text-[var(--cinza-texto)] text-xs">
                {headerDois}
              </th>
            </tr>
          </thead>
          <tbody>
            {dados.map((item) => (
              <TabelaData key={item.classificacao} {...item} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TabelaEstatisticas;
