import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function VerInscritosEncontro() {
  const { id } = useParams();
  const [inscritos, setInscritos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInscritos = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/encontros/${id}/inscritos`);
        const data = await response.json();
        setInscritos(data);
      } catch (error) {
        console.error("Erro ao buscar inscritos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInscritos();
  }, [id]);

  if (loading) return <p>Carregando inscritos...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inscritos no Encontro</h1>
        <div className="flex gap-4">
          <button
            onClick={() => window.open(`http://localhost:3001/api/encontros/${id}/inscritos/excel`, "_blank")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Exportar Excel
          </button>
          <button
            onClick={() => window.open(`http://localhost:3001/api/encontros/${id}/inscritos/pdf`, "_blank")}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Exportar PDF
          </button>
        </div>
        <Link to="/admin/encontros" className="text-sm text-gray-600 hover:underline">&larr; Voltar</Link>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-4">Nome</th>
              <th className="p-4">CPF</th>
              <th className="p-4">Email</th>
              <th className="p-4">Telefone</th>
            </tr>
          </thead>
          <tbody>
            {inscritos.length > 0 ? inscritos.map(inscrito => (
              <tr key={inscrito.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{inscrito.nome}</td>
                <td className="p-4">{inscrito.cpf}</td>
                <td className="p-4">{inscrito.email}</td>
                <td className="p-4">{inscrito.telefone || 'N/A'}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">Nenhuma inscrição encontrada para este encontro.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VerInscritosEncontro;