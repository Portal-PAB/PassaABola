import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

// Componente para um card de partida
const CardPartida = ({ partida }) => (
  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex items-center text-center space-x-2">
    <div className="flex flex-col items-center w-1/3">
      <img src={partida.timeCasa.logo} alt={partida.timeCasa.nome} className="w-6 h-6 mb-1" />
      <span className="text-xs font-semibold">{partida.timeCasa.nome}</span>
    </div>
    <div className="text-center">
        <span className="text-sm font-bold text-gray-700">{partida.data}</span>
        <span className="block text-xs text-gray-500">{partida.hora}</span>
    </div>
    <div className="flex flex-col items-center w-1/3">
      <img src={partida.timeFora.logo} alt={partida.timeFora.nome} className="w-6 h-6 mb-1" />
      <span className="text-xs font-semibold">{partida.timeFora.nome}</span>
    </div>
  </div>
);


function Perfil() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  
  const [times, setTimes] = useState([]);
  const [timeSelecionado, setTimeSelecionado] = useState('');
  const [dadosDoTime, setDadosDoTime] = useState(null);
  const [minhasInscricoes, setMinhasInscricoes] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileData = useCallback(async () => {
    if (!user) {
        setLoading(false);
        return;
    }
    setLoading(true);
    try {
        const [resInscricoes, resTimes] = await Promise.all([
            fetch(`http://localhost:3001/api/usuario/minhas-inscricoes/${user.email}`),
            fetch('http://localhost:3001/api/ligas/74/times')
        ]);
        const dadosInscricoes = await resInscricoes.json();
        const dadosTimes = await resTimes.json();

        setMinhasInscricoes(dadosInscricoes);
        setTimes(dadosTimes.map(item => item.team));

        if (user.timeFavoritoId) {
            const [resTabela, resPartidas, resArtilharia] = await Promise.all([
                fetch('http://localhost:3001/api/tabela'),
                fetch(`http://localhost:3001/api/times/${user.timeFavoritoId}/partidas`),
                fetch('http://localhost:3001/api/artilharia')
            ]);
            const tabela = await resTabela.json();
            const partidas = await resPartidas.json();
            const artilharia = await resArtilharia.json();
            setDadosDoTime({ tabela, partidas, artilharia });
        }
    } catch (error) {
        console.error("Erro ao buscar dados do perfil:", error);
    } finally {
        setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleSalvarTime = async () => {
    const idParaSalvar = timeSelecionado || null;
    try {
        const response = await fetch('http://localhost:3001/api/usuario/favoritar-time', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, timeId: idParaSalvar })
        });
        const data = await response.json();
        if(response.ok) {
            login(data.user);
        }
    } catch (error) {
        console.error("Erro ao salvar time favorito:", error);
    }
  };

  const handleCancelarCopa = async () => {
    if (window.confirm("Tem certeza que deseja cancelar a inscrição da sua equipe na copa? Esta ação não pode ser desfeita.")) {
      try {
        const response = await fetch(`http://localhost:3001/api/inscricao-copa/${user.email}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Falha ao cancelar no servidor.');
        fetchProfileData();
      } catch (error) {
        console.error("Erro ao cancelar inscrição:", error);
        alert("Erro ao cancelar inscrição.");
      }
    }
  };

  const handleCancelarEncontro = async () => {
    if (window.confirm("Tem certeza que deseja cancelar sua inscrição no encontro?")) {
      try {
        const response = await fetch(`http://localhost:3001/api/inscricao-encontro/${user.email}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Falha ao cancelar no servidor.');
        fetchProfileData();
      } catch (error) {
        console.error("Erro ao cancelar inscrição:", error);
        alert("Erro ao cancelar inscrição.");
      }
    }
  };

  const handleCancelarParticipacao = async (timeId) => {
    if(window.confirm("Tem certeza que deseja cancelar sua participação nesta equipe?")){
        try {
            const response = await fetch(`http://localhost:3001/api/equipes/${timeId}/jogadora/${user.cpf}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Falha ao cancelar participação.');
            fetchProfileData();
        } catch (error) {
            console.error("Erro ao cancelar participação:", error);
            alert("Erro ao cancelar participação.");
        }
    }
  };

  const handleCancelarCopaAvulsa = async () => {
    if (window.confirm("Tem certeza que deseja cancelar sua inscrição avulsa na copa?")) {
      try {
        const response = await fetch(`http://localhost:3001/api/inscricao-jogadora/${user.email}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Falha ao cancelar no servidor.');
        fetchProfileData();
      } catch (error) {
        console.error("Erro ao cancelar inscrição avulsa:", error);
        alert("Erro ao cancelar inscrição.");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const timeFavoritoInfo = user?.timeFavoritoId ? times.find(t => t.id === parseInt(user.timeFavoritoId)) : null;

  if (loading) {
    return <div className="text-center p-12 bg-white">Carregando perfil...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-full p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-bold">Olá, {user?.nome || user?.email}!</h1>
            <p className="text-lg text-gray-500">Este é o seu espaço pessoal.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Seu Time do Coração</h2>
          {!user?.timeFavoritoId ? (
            <div className="flex items-center gap-4">
              <select onChange={(e) => setTimeSelecionado(e.target.value)} className="flex-1 p-2 border border-gray-300 rounded-md">
                <option value="">Selecione um time...</option>
                {times.map(time => <option key={time.id} value={time.id}>{time.name}</option>)}
              </select>
              <button onClick={handleSalvarTime} disabled={!timeSelecionado} className="py-2 px-6 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 disabled:bg-gray-400">Salvar</button>
            </div>
          ) : (
            <div>
              {loading ? <p>Buscando dados do seu time...</p> : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <img src={timeFavoritoInfo?.logo} alt="Logo" className="w-12 h-12" />
                      <h3 className="text-3xl font-bold">{timeFavoritoInfo?.name}</h3>
                    </div>
                    <button onClick={() => { setTimeSelecionado(null); handleSalvarTime(); }} className="text-sm text-red-500 hover:underline">Trocar de time</button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xl font-semibold mb-3">Próximas Partidas</h4>
                        <div className="space-y-2">{dadosDoTime?.partidas.slice(0, 5).map(p => <CardPartida key={p.id} partida={p} />)}</div>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold mb-3">Artilharia da Liga</h4>
                        <ul className="space-y-2">{dadosDoTime?.artilharia.slice(0, 5).map(a => (<li key={a.id} className="flex items-center justify-between bg-gray-50 p-2 rounded"><span className="text-sm">{a.jogadora}</span><span className="font-bold">{a.gols} gols</span></li>))}</ul>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-3">Tabela do Campeonato</h4>
                       <table className="w-full text-sm text-left"><thead className="text-xs text-gray-500 bg-gray-100"><tr><th className="p-2">#</th><th className="p-2">Clube</th><th className="p-2 text-center">P</th><th className="p-2 text-center">SG</th></tr></thead>
                          <tbody>{dadosDoTime?.tabela.map(item => (<tr key={item.pos} className={`border-t ${item.time.nome === timeFavoritoInfo?.name ? 'bg-purple-100 font-bold' : ''}`}><td className="p-2">{item.pos}</td><td className="p-2 flex items-center gap-2"><img src={item.time.logo} alt={item.time.nome} className="w-5 h-5" />{item.time.nome}</td><td className="p-2 text-center">{item.P}</td><td className="p-2 text-center">{item.SG}</td></tr>))}</tbody>
                        </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {minhasInscricoes && (minhasInscricoes.copa || minhasInscricoes.encontro || minhasInscricoes.copaAvulsa) && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Minhas Inscrições</h2>
            <div className="space-y-4">
              {minhasInscricoes.copa && (
                <div className="p-4 border rounded-lg bg-gray-50 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">Inscrição na Copa</h3>
                    <p>Time: <span className="font-bold">{minhasInscricoes.copa.nomeTime}</span></p>
                  </div>
                  {minhasInscricoes.copa.role === 'responsavel' ? (<button onClick={handleCancelarCopa} className="text-sm text-red-600 hover:underline font-semibold">Cancelar Inscrição do Time</button>) : (<button onClick={() => handleCancelarParticipacao(minhasInscricoes.copa.id)} className="text-sm text-red-600 hover:underline font-semibold">Cancelar Minha Participação</button>)}
                </div>
              )}
              {minhasInscricoes.encontro && (
                <div className="p-4 border rounded-lg bg-gray-50 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">Inscrição no Encontro PAB</h3>
                    <p>Evento: <span className="font-bold">{minhasInscricoes.encontro.nomeEncontro}</span></p>
                  </div>
                  <button onClick={handleCancelarEncontro} className="text-sm text-red-600 hover:underline font-semibold">Cancelar Inscrição</button>
                </div>
              )}
              {minhasInscricoes.copaAvulsa && (
                <div className="p-4 border rounded-lg bg-gray-50 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">Inscrição Avulsa na Copa</h3>
                    <p className="text-sm text-gray-600">Aguardando atribuição de time para a <span className="font-medium">{minhasInscricoes.copaAvulsa.nomeCopa}</span></p>
                  </div>
                  <button onClick={handleCancelarCopaAvulsa} className="text-sm text-red-600 hover:underline font-semibold">Cancelar Inscrição</button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-10 text-center">
            <Link to="/admin" className="inline-block bg-gray-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-800 mr-4">Painel de Admin</Link>
            <button onClick={handleLogout} className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700">Sair (Logout)</button>
        </div>
      </div>
    </div>
  );
}

export default Perfil;