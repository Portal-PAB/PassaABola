import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <-- A LINHA QUE FALTAVA

function GerenciarEncontros() {
  const [nome, setNome] = useState('');
  const [data, setData] = useState('');
  const [local, setLocal] = useState('');
  const [limiteInscritos, setLimiteInscritos] = useState(20);
  const [mensagem, setMensagem] = useState('');
  const [encontros, setEncontros] = useState([]);

  const fetchData = () => {
    fetch('http://localhost:3001/api/encontros')
      .then(res => res.json())
      .then(data => setEncontros(data.sort((a, b) => b.id - a.id))); // Ordena aqui
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const encontroData = { nome, data, local, limiteInscritos };
    try {
      const response = await fetch('http://localhost:3001/api/encontros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(encontroData),
      });
      const result = await response.json();
      if (response.ok) {
        setMensagem({ type: 'success', text: result.success });
        setNome(''); 
        setData(''); 
        setLocal(''); 
        setLimiteInscritos(20);
        fetchData();
      } else {
        setMensagem({ type: 'error', text: result.error });
      }
    } catch (error) {
      setMensagem({ type: 'error', text: 'Erro de conexão.' });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gerenciar Encontros PAB</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">Criar Novo Encontro</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome do Encontro</label>
            <input 
              type="text" 
              id="nome" 
              value={nome} 
              onChange={e => setNome(e.target.value)} 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" 
              required 
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="data" className="block text-sm font-medium text-gray-700">Data do Evento</label>
              <input 
                type="date" 
                id="data" 
                value={data} 
                onChange={e => setData(e.target.value)} 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" 
                required 
              />
            </div>
            <div>
              <label htmlFor="local" className="block text-sm font-medium text-gray-700">Local</label>
              <input 
                type="text" 
                id="local" 
                value={local} 
                onChange={e => setLocal(e.target.value)} 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" 
                required 
              />
            </div>
            <div>
              <label htmlFor="limiteInscritos" className="block text-sm font-medium text-gray-700">Nº de Vagas</label>
              <input 
                type="number" 
                id="limiteInscritos" 
                value={limiteInscritos} 
                onChange={e => setLimiteInscritos(e.target.value)} 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" 
                required 
              />
            </div>
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700">
            Criar e Abrir Inscrições para Encontro
          </button>
          {mensagem && <p className={`text-center font-medium mt-2 ${mensagem.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{mensagem.text}</p>}
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Histórico de Encontros</h2>
        <ul className="space-y-2">
            {encontros.map(encontro => (
                <li key={encontro.id} className="p-3 border rounded-md flex justify-between items-center">
                    <div>
                        <p className="font-bold">{encontro.nome}</p>
                        <p className="text-sm text-gray-500">{new Date(encontro.data).toLocaleDateString('pt-BR')} - {encontro.local}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to={`/admin/encontros/${encontro.id}/inscritos`} className="text-sm text-purple-600 hover:underline">
                            Ver Inscritos
                        </Link>
                        <span className={`px-3 py-1 text-sm rounded-full text-white ${encontro.status === 'aberta' ? 'bg-green-500' : 'bg-gray-400'}`}>
                            {encontro.status}
                        </span>
                    </div>
                </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default GerenciarEncontros;