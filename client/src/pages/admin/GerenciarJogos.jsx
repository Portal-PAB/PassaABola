import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faTrophy, faListOl, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function GerenciarJogos() {
  return (
    <div className="bg-white p-6 rounded-lg shadow text-center">

      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Gerenciamento de Jogos e Tabelas
      </h1>

      <p className="text-lg text-gray-600 mb-8">
        Esta seção está em desenvolvimento.
      </p>

      <div className="max-w-2xl mx-auto text-left bg-gray-50 p-6 rounded-lg border">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Na próxima atualização, você poderá:</h2>
        
        <ul className="space-y-4">
          <li className="flex items-start gap-4">
            <FontAwesomeIcon icon={faPlusSquare} className="text-purple-500 text-xl mt-1" />
            <div>
              <h3 className="font-semibold">Adicionar Jogos Manualmente</h3>
              <p className="text-gray-600 text-sm">Cadastre partidas de campeonatos que não estão na nossa API principal.</p>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <FontAwesomeIcon icon={faTrophy} className="text-purple-500 text-xl mt-1" />
            <div>
              <h3 className="font-semibold">Atualizar Resultados</h3>
              <p className="text-gray-600 text-sm">Insira os placares finais das partidas para manter tudo atualizado em tempo real.</p>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <FontAwesomeIcon icon={faListOl} className="text-purple-500 text-xl mt-1" />
            <div>
              <h3 className="font-semibold">Montar Tabelas de Classificação</h3>
              <p className="text-gray-600 text-sm">Crie e gerencie tabelas de pontos corridos ou de grupos para suas competições personalizadas.</p>
            </div>
          </li>
        </ul>
        
        <p className="text-sm text-gray-500 mt-6 pt-4 border-t">
          <strong>Objetivo:</strong> Dar flexibilidade para cobrir torneios locais ou qualquer competição que não tenha cobertura automática pela API externa.
        </p>
      </div>

    </div>
  );
}

export default GerenciarJogos;