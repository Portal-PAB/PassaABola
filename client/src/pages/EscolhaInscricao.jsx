import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function EscolhaInscricao() {
  const [copaAberta, setCopaAberta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verificarCopaAberta = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/copas/aberta');
        const data = await response.json();
        setCopaAberta(data);
      } catch (error) {
        console.error("Erro ao verificar copa aberta:", error);
      } finally {
        setLoading(false);
      }
    };
    verificarCopaAberta();
  }, []);

  if (loading) {
    return <div className="text-center p-12 bg-white">Verificando status das inscrições...</div>;
  }
  
  return (
    <div className="bg-white min-h-full py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {copaAberta ? (
          // Se existe uma copa aberta, mostra as opções de inscrição
          <>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Inscrições Abertas: {copaAberta.nome}
            </h1>
            <p className="text-gray-600 mb-12">
              O evento acontecerá em <span className="font-semibold">{copaAberta.local}</span> no dia <span className="font-semibold">{new Date(copaAberta.data).toLocaleDateString('pt-BR')}</span>.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Link to="/inscricao-time" className="block p-8 rounded-2xl shadow-lg border-2 border-gray-200 text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:border-purple-500">
                <div className="text-5xl mb-4">👨‍👩‍👧‍👧</div>
                <h2 className="text-2xl font-bold text-gray-800">Inscrever um Time</h2>
                <p className="text-gray-500 mt-2">Reúna suas jogadoras e inscreva a equipe completa na copa.</p>
              </Link>
              <Link to="/inscricao-jogadora" className="block p-8 rounded-2xl shadow-lg border-2 border-gray-200 text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-500">
                <div className="text-5xl mb-4">🙋‍♀️</div>
                <h2 className="text-2xl font-bold text-gray-800">Inscrever como Jogadora</h2>
                <p className="text-gray-500 mt-2">Não tem um time? Cadastre-se e buscaremos uma equipe para você.</p>
              </Link>
            </div>
          </>
        ) : (
          // Se NÃO existe copa aberta, mostra esta mensagem
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Inscrições Encerradas
            </h1>
            <p className="text-lg text-gray-600">
              No momento, não há nenhuma copa com inscrições abertas. Fique de olho para futuros anúncios!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EscolhaInscricao;