import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const MAX_JOGADORAS = 15;

function VerInscritosCopa() {
  const { id } = useParams(); // Pega o ID da copa da URL
  const [equipes, setEquipes] = useState([]);
  const [jogadorasAvulsas, setJogadorasAvulsas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInscritos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/api/copas/${id}/inscritos`);
        if (!response.ok) {
          throw new Error('Falha ao buscar dados da copa.');
        }
        const data = await response.json();
        setEquipes(data.equipes || []);
        setJogadorasAvulsas(data.jogadorasAvulsas || []);
      } catch (err) {
        setError('Erro ao carregar os dados das inscrições.');
        console.error("Erro ao buscar inscritos da copa:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInscritos();
  }, [id]);

  if (loading) return <p>Carregando inscrições...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inscritos na Copa</h1>
        <Link to="/admin/copas" className="text-sm text-gray-600 hover:underline">&larr; Voltar para a lista de copas</Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Coluna de Jogadoras Avulsas (Apenas Visualização) */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Jogadoras Avulsas ({jogadorasAvulsas.length})</h2>
          {jogadorasAvulsas.length > 0 ? jogadorasAvulsas.map(jogadora => (
            <div key={jogadora.id} className="bg-white p-4 rounded-lg shadow">
              <p className="font-bold text-lg">{jogadora.nome}</p>
              <div className="text-sm text-gray-600 border-t mt-2 pt-2">
                <p><strong>CPF:</strong> {jogadora.cpf}</p>
                <p><strong>Email:</strong> {jogadora.email}</p>
                <p><strong>Telefone:</strong> {jogadora.telefone || 'Não informado'}</p>
              </div>
            </div>
          )) : <p className="text-gray-500 bg-white p-4 rounded-lg shadow">Nenhuma jogadora avulsa inscrita nesta copa.</p>}
        </div>

        {/* Coluna de Equipes Inscritas (Apenas Visualização) */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Equipes Inscritas ({equipes.length})</h2>
          {equipes.length > 0 ? equipes.map(equipe => (
            <div key={equipe.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-xl">{equipe.nomeTime}</h3>
                <span className={`font-bold text-lg ${equipe.jogadoras.length >= MAX_JOGADORAS ? 'text-red-500' : 'text-green-600'}`}>
                  {equipe.jogadoras.length}/{MAX_JOGADORAS}
                </span>
              </div>
              <div className="text-sm text-gray-600 border-t mt-2 pt-2">
                <p><strong>Responsável:</strong> {equipe.responsavel}</p>
                <p><strong>CPF:</strong> {equipe.cpf}</p>
                <p><strong>Email:</strong> {equipe.email}</p>
                <p><strong>Telefone:</strong> {equipe.telefone || 'Não informado'}</p>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Jogadoras:</h4>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {equipe.jogadoras.map((jogadora, index) => (
                    <li key={index}>{jogadora.nome} ({jogadora.cpf})</li>
                  ))}
                </ul>
              </div>
            </div>
          )) : <p className="text-gray-500 bg-white p-4 rounded-lg shadow">Nenhuma equipe inscrita nesta copa.</p>}
        </div>
      </div>
    </div>
  );
}

export default VerInscritosCopa;