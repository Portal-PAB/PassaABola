import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

function VerInscricoes() {
  const [equipes, setEquipes] = useState([]);
  const [jogadorasAvulsas, setJogadorasAvulsas] = useState([]);
  const [timeSelecionado, setTimeSelecionado] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const MAX_JOGADORAS = 15;

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resEquipes, resJogadoras] = await Promise.all([
        fetch(`${API_URL}/api/equipes`),
        fetch(`${API_URL}/api/jogadoras-avulsas`)
      ]);
      const dadosEquipes = await resEquipes.json();
      const dadosJogadoras = await resJogadoras.json();
      setEquipes(dadosEquipes);
      setJogadorasAvulsas(dadosJogadoras);
    } catch (err) {
      setError('Erro ao carregar os dados das inscrições.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdicionarJogadora = async (jogadora) => {
    const idDoTime = timeSelecionado[jogadora.id];
    if (!idDoTime) {
      alert('Por favor, selecione um time.');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/equipes/${idDoTime}/adicionar-jogadora`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jogadora)
      });
      if (response.ok) {
        fetchData();
        setTimeSelecionado(prev => ({ ...prev, [jogadora.id]: '' }));
      } else {
        alert('Erro ao adicionar jogadora.');
      }
    } catch (err) {
      alert('Erro de conexão ao adicionar jogadora.');
    }
  };

  const handleSelectChange = (jogadoraId, timeId) => {
    setTimeSelecionado(prev => ({ ...prev, [jogadoraId]: timeId }));
  };

  if (loading) return <p>Carregando inscrições...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const timesComVaga = equipes.filter(e => e.jogadoras.length < MAX_JOGADORAS);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Inscrições para a Copa</h1>
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
              <div className="mt-4 flex gap-2">
                <select 
                  className="flex-1 border border-gray-300 rounded-md py-1 px-2"
                  value={timeSelecionado[jogadora.id] || ''}
                  onChange={(e) => handleSelectChange(jogadora.id, e.target.value)}
                >
                  <option value="" disabled>Selecione um time...</option>
                  {timesComVaga.map(time => (
                    <option key={time.id} value={time.id}>
                      {time.nomeTime} ({time.jogadoras.length}/{MAX_JOGADORAS})
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
            </div>
          )) : <p className="text-gray-500">Nenhuma jogadora avulsa inscrita.</p>}
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Equipes Inscritas ({equipes.length})</h2>
          {equipes.length > 0 ? equipes.map(equipe => (
            <div key={equipe.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-xl">{equipe.nomeTime}</h3>
                <span className={`font-bold text-lg ${equipe.jogadoras.length === MAX_JOGADORAS ? 'text-red-500' : 'text-green-600'}`}>
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
                    <li key={index}>{jogadora.nome}</li>
                  ))}
                </ul>
              </div>
            </div>
          )) : <p className="text-gray-500">Nenhuma equipe inscrita.</p>}
        </div>

      </div>
    </div>
  );
}

export default VerInscricoes;