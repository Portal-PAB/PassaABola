import React, { useState, useEffect } from 'react';

const CardPartida = ({ partida }) => (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col items-center text-center space-y-2">
        <span className="text-xs text-gray-500">{partida.campeonato}</span>
        <div className="flex items-center justify-around w-full">
            <div className="flex flex-col items-center w-1/3">
                <img src={partida.timeCasa.logo} alt={partida.timeCasa.nome} className="w-8 h-8 mb-1" />
                <span className="text-sm font-semibold">{partida.timeCasa.nome}</span>
            </div>
            <span className="text-2xl font-bold text-gray-400">vs</span>
            <div className="flex flex-col items-center w-1/3">
                <img src={partida.timeFora.logo} alt={partida.timeFora.nome} className="w-8 h-8 mb-1" />
                <span className="text-sm font-semibold">{partida.timeFora.nome}</span>
            </div>
        </div>
        <div className="text-sm font-bold text-purple-700">
            <span>{partida.data}</span> - <span>{partida.hora}</span>
        </div>
        <div className="text-xs text-gray-500">Status: {partida.status}</div>
    </div>
);

function Jogos() {
    const [partidas, setPartidas] = useState([]);
    const [tabela, setTabela] = useState([]);
    const [artilharia, setArtilharia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                setLoading(true);
                const [resPartidas, resTabela, resArtilharia] = await Promise.all([
                    fetch('http://localhost:3001/api/partidas'),
                    fetch('http://localhost:3001/api/tabela'),
                    fetch('http://localhost:3001/api/artilharia'),
                ]);

                if (!resPartidas.ok || !resTabela.ok || !resArtilharia.ok) {
                    throw new Error('Falha ao buscar dados do servidor.');
                }

                const dadosPartidas = await resPartidas.json();
                const dadosTabela = await resTabela.json();
                const dadosArtilharia = await resArtilharia.json();

                setPartidas(dadosPartidas);
                setTabela(dadosTabela);
                setArtilharia(dadosArtilharia);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error("Erro ao carregar dados:", err);
            } finally {
                setLoading(false);
            }
        };

        carregarDados();
    }, []);

    if (loading) {
        return <div className="text-center text-white p-10">Carregando dados...</div>;
    }

    if (error) {
        return <div className="text-center text-red-400 p-10">Erro: {error}</div>;
    }

    return (
        <div className="bg-white min-h-full p-4 sm:p-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Jogos</h2>
                        <div className="space-y-4">
                            {partidas.map(partida => (
                                <CardPartida key={partida.id} partida={partida} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Campeonatos</h2>
                        <ul className="space-y-2 text-purple-700 font-semibold">
                            <li className="p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                                Campeonato Brasileiro Feminino - Série A1 (2025)
                            </li>
                            <li className="p-3 rounded-lg cursor-pointer hover:bg-gray-200">Copa do Mundo Feminina</li>
                            <li className="p-3 rounded-lg cursor-pointer hover:bg-gray-200">Copa América Feminina</li>
                        </ul>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                        <h2 className="text-lg font-bold text-center mb-4">Tabela - BR Feminino A1</h2>
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase">
                                <tr>
                                    <th className="p-2">#</th>
                                    <th className="p-2">Clube</th>
                                    <th className="p-2 text-center">P</th>
                                    <th className="p-2 text-center">J</th>
                                    <th className="p-2 text-center">V</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tabela.map(item => (
                                    <tr key={item.pos} className="border-t border-gray-200">
                                        <td className="p-2 font-semibold">{item.pos}</td>
                                        <td className="p-2 flex items-center gap-2">
                                            <img src={item.time.logo} alt={item.time.nome} className="w-5 h-5" />
                                            {item.time.nome}
                                        </td>
                                        <td className="p-2 text-center font-bold">{item.P}</td>
                                        <td className="p-2 text-center">{item.J}</td>
                                        <td className="p-2 text-center">{item.V}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                        <h2 className="text-lg font-bold text-center mb-4">Artilharia</h2>
                        <ul className="space-y-2">
                            {artilharia.map((jogadora, index) => (
                                <li key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <img src={jogadora.logo} alt={jogadora.time} className="w-6 h-6" />
                                        <span className="text-sm font-semibold">{jogadora.jogadora}</span>
                                        <span className="text-xs text-gray-500">({jogadora.time})</span>
                                    </div>
                                    <span className="font-bold text-purple-700">{jogadora.gols} gols</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Jogos;