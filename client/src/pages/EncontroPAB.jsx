import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function EncontroPAB() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [encontro, setEncontro] = useState(null);
  const [inscritos, setInscritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState('');
  
  // Novo estado para controlar a exibição do formulário
  const [isRegistering, setIsRegistering] = useState(false);

  // Estados para o formulário
  const [formNome, setFormNome] = useState('');
  const [formCpf, setFormCpf] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTelefone, setFormTelefone] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resEncontro, resInscritos] = await Promise.all([
        fetch('http://localhost:3001/api/encontros/aberto'),
        fetch('http://localhost:3001/api/encontros/aberto/inscricoes')
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

  // Preenche o formulário com dados do usuário logado
  const handleStartRegistration = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setFormEmail(user.email || '');
    setFormNome(user.name || ''); // Assumindo que o contexto possa ter o nome
    setIsRegistering(true); // Mostra o formulário
  };

  const handleInscricao = async (event) => {
    event.preventDefault();
    setMensagem('');
    const inscricaoData = { nome: formNome, cpf: formCpf, email: formEmail, telefone: formTelefone };
    
    try {
        const response = await fetch('http://localhost:3001/inscricao-encontro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inscricaoData)
        });
        const result = await response.json();
        if (response.ok) {
            await fetchData(); // Atualiza a contagem de inscritos
            setIsRegistering(false); // Volta para a tela de detalhes
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

  const vagasDisponiveis = encontro ? encontro.limiteInscritos - inscritos.length : 0;
  const jaInscrito = user && inscritos.some(i => i.email === user.email);

  return (
    <div className="bg-white min-h-full py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        
        {isRegistering ? (
          // --- VISUALIZAÇÃO DO FORMULÁRIO DE INSCRIÇÃO ---
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
          // --- VISUALIZAÇÃO DOS DETALHES DO ENCONTRO ---
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
                  <p className="text-sm text-gray-500">de {encontro.limiteInscritos} vagas no total</p>
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