import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;
const MAX_JOGADORAS = 15;

function VerInscritosCopa() {
  const { id } = useParams();
  const [equipes, setEquipes] = useState([]);
  const [jogadorasAvulsas, setJogadorasAvulsas] = useState([]);
  // NOVO: Estado para controlar qual time está selecionado para cada jogadora
  const [timeSelecionado, setTimeSelecionado] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ATUALIZADO: Agora a função fetchData pode ser chamada para recarregar os dados
  const fetchInscritos = async () => {
    try {
      // Removido o setLoading(true) daqui para evitar piscar a tela ao recarregar
      const response = await fetch(`${API_URL}/api/copas/${id}/inscritos`);
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

  useEffect(() => {
    setLoading(true);
    fetchInscritos();
  }, [id]);

  // NOVO: Função para lidar com a seleção de time no dropdown
  const handleSelectChange = (jogadoraId, timeId) => {
    setTimeSelecionado(prev => ({ ...prev, [jogadoraId]: timeId }));
  };

  // NOVO: Função para enviar a jogadora para o time selecionado
  const handleAdicionarJogadora = async (jogadora) => {
    const idDoTime = timeSelecionado[jogadora.id];
    if (!idDoTime) {
      alert('Por favor, selecione um time para adicionar a jogadora.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/equipes/${idDoTime}/adicionar-jogadora`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jogadora)
      });

      if (response.ok) {
        // Recarrega os dados da página para refletir a mudança
        await fetchInscritos();
        // Limpa a seleção para essa jogadora
        setTimeSelecionado(prev => ({ ...prev, [jogadora.id]: '' }));
      } else {
        const data = await response.json();
        alert(`Erro: ${data.error || 'Não foi possível adicionar a jogadora.'}`);
      }
    } catch (err) {
      console.error("Erro ao adicionar jogadora:", err);
      alert('Erro de conexão ao tentar adicionar a jogadora.');
    }
  };


  if (loading) return <p>Carregando inscrições...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // NOVO: Filtra apenas os times que ainda têm vagas
  const timesComVaga = equipes.filter(e => e.jogadoras.length < MAX_JOGADORAS);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inscritos na Copa</h1>
        <div className="flex gap-4">
          <button
            onClick={() => window.open(`${API_URL}/api/copas/${id}/inscritos/excel`, "_blank")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Exportar Excel
          </button>
          <button
            onClick={() => window.open(`${API_URL}/api/copas/${id}/inscritos/pdf`, "_blank")}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Exportar PDF
          </button>
        </div>
        <Link to="/admin/copas" className="text-sm text-gray-600 hover:underline">&larr; Voltar para a lista de copas</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
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

              {/* NOVO: Dropdown e botão para adicionar jogadora */}
              <div className="mt-4 flex gap-2">
                <select
                  className="flex-1 border border-gray-300 rounded-md py-1 px-2"
                  value={timeSelecionado[jogadora.id] || ''}
                  onChange={(e) => handleSelectChange(jogadora.id, e.target.value)}
                  disabled={timesComVaga.length === 0}
                >
                  <option value="" disabled>Selecione um time...</option>
                  {timesComVaga.map(time => (
                    <option key={time.id} value={time.id}>
                      {time.nome_time} ({time.jogadoras.length}/{MAX_JOGADORAS})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleAdicionarJogadora(jogadora)}
                  className="bg-purple-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-purple-700 disabled:bg-gray-400"
                  disabled={!timeSelecionado[jogadora.id]}
                >
                  Adicionar
                </button>
              </div>
              {timesComVaga.length === 0 && <p className="text-xs text-red-500 mt-2">Nenhum time com vagas disponíveis.</p>}
            </div>
          )) : <p className="text-gray-500 bg-white p-4 rounded-lg shadow">Nenhuma jogadora avulsa inscrita nesta copa.</p>}
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Equipes Inscritas ({equipes.length})</h2>
          {equipes.length > 0 ? equipes.map(equipe => (
            <div key={equipe.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-xl">{equipe.nome_time}</h3>
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