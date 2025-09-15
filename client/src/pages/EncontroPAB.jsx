import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

function EncontroPAB() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [encontro, setEncontro] = useState(null);
  const [inscritos, setInscritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState('');

  const [isRegistering, setIsRegistering] = useState(false);

  const [formNome, setFormNome] = useState('');
  const [formCpf, setFormCpf] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTelefone, setFormTelefone] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resEncontro, resInscritos] = await Promise.all([
        fetch(`${API_URL}/api/encontros/aberto`),
        fetch(`${API_URL}/api/encontros/aberto/inscricoes`)
      ]);
      const dataEncontro = await resEncontro.json();
      const dataInscritos = await resInscritos.json();
      setEncontro(dataEncontro);
      setInscritos(dataInscritos);
    } catch (error) {
      console.error("Erro ao carregar dados do encontro:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStartRegistration = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setFormEmail(user.email || '');
    // Corrigido para user.nome, que é o padrão que estamos usando
    setFormNome(user.nome || ''); 
    setIsRegistering(true);
  };

  const handleInscricao = async (event) => {
    event.preventDefault();
    setMensagem('');
    const inscricaoData = { nome: formNome, cpf: formCpf, email: formEmail, telefone: formTelefone };
    
    try {
        const response = await fetch(`${API_URL}/inscricao-encontro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inscricaoData)
        });
        const result = await response.json();
        if (response.ok) {
            await fetchData();
            setIsRegistering(false);
        } else {
            setMensagem({ type: 'error', text: result.error });
        }
    } catch(error) {
        setMensagem({ type: 'error', text: 'Erro de conexão.' });
    }
  };

  if (loading) {
    return <div className="text-center p-12 bg-white">Carregando informações do encontro...</div>;
  }

  // ATUALIZADO: A MUDANÇA ESTÁ AQUI
  // Usamos parseInt() para garantir que o limite de inscritos seja um número
  const vagasDisponiveis = encontro ? parseInt(encontro.limite_inscritos, 10) - inscritos.length : 0;
  const jaInscrito = user && inscritos.some(i => i.email === user.email);

  return (
    <div className="bg-white min-h-full py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        
        {isRegistering ? (
          <div className="text-left max-w-xl mx-auto">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Confirmar Inscrição para "{encontro.nome}"
            </h1>
            <form onSubmit={handleInscricao} className="space-y-4 bg-gray-50 p-6 rounded-lg shadow">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome completo</label>
                <input type="text" id="nome" value={formNome} onChange={(e) => setFormNome(e.target.value)} className="w-full p-2 border border-gray-300 rounded mt-1" required />
              </div>
              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">CPF</label>
                <input type="text" id="cpf" value={formCpf} onChange={(e) => setFormCpf(e.target.value)} className="w-full p-2 border border-gray-300 rounded mt-1" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded mt-1" required />
              </div>
              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone</label>
                <input type="tel" id="telefone" value={formTelefone} onChange={(e) => setFormTelefone(e.target.value)} className="w-full p-2 border rounded mt-1" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsRegistering(false)} className="w-full py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400">
                  Cancelar
                </button>
                <button type="submit" className="w-full py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700">
                  Confirmar minha vaga
                </button>
              </div>
              {mensagem && <p className={`text-center font-medium mt-2 ${mensagem.type === 'error' ? 'text-red-600' : ''}`}>{mensagem.text}</p>}
            </form>
          </div>
        ) : (
          <div>
            {!encontro ? (
              <div>
                <h1 className="text-4xl font-bold text-gray-800">Nenhum Encontro PAB agendado</h1>
                <p className="text-lg text-gray-600 mt-4">Fique de olho em nossas redes para futuros anúncios!</p>
              </div>
            ) : (
              <div>
                <h1 className="text-4xl font-bold text-gray-800">{encontro.nome}</h1>
                <p className="text-xl text-gray-600 mt-2">
                  {new Date(encontro.data).toLocaleDateString('pt-BR', { dateStyle: 'full' })} | {encontro.local}
                </p>
                <div className="my-8 p-6 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-800">{vagasDisponiveis > 0 ? `${vagasDisponiveis} vagas restantes` : 'Inscrições Esgotadas'}</p>
                  {/* Corrigido para limite_inscritos (snake_case) para consistência */}
                  <p className="text-sm text-gray-500">de {encontro.limite_inscritos} vagas no total</p>
                </div>
                
                <button
                  onClick={handleStartRegistration}
                  disabled={vagasDisponiveis <= 0 || jaInscrito}
                  className="py-3 px-8 bg-purple-600 text-white font-bold rounded-lg text-xl hover:bg-purple-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {jaInscrito ? 'Você já está inscrito!' : (vagasDisponiveis > 0 ? 'Quero me inscrever!' : 'Inscrições Esgotadas')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default EncontroPAB;