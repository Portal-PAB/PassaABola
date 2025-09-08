import React from 'react';
import { Link } from 'react-router-dom';

function EscolhaInscricao() {
  return (
    <div className="bg-white min-h-full py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
          Escolha o Tipo de Inscrição
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Você pode inscrever uma equipe completa ou se cadastrar como uma jogadora avulsa.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link 
            to="/inscricao-time" 
            className="block p-8 rounded-2xl shadow-lg border-2 border-gray-200 text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:border-purple-500"
          >
            <div className="text-5xl mb-4">👨‍👩‍👧‍👧</div>
            <h2 className="text-2xl font-bold text-gray-800">Inscrever um Time</h2>
            <p className="text-gray-500 mt-2">Reúna suas jogadoras e inscreva a equipe completa na copa.</p>
          </Link>

          <Link 
            to="/inscricao-jogadora"
            className="block p-8 rounded-2xl shadow-lg border-2 border-gray-200 text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-500"
          >
            <div className="text-5xl mb-4">🙋‍♀️</div>
            <h2 className="text-2xl font-bold text-gray-800">Inscrever como Jogadora</h2>
            <p className="text-gray-500 mt-2">Não tem um time? Cadastre-se e buscaremos uma equipe para você.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EscolhaInscricao;