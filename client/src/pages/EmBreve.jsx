import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTools, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function EmBreve() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white text-center p-4">

      <div className="mb-6 text-purple-500">
        <FontAwesomeIcon icon={faTools} className="text-6xl animate-pulse" />
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        Página em Construção
      </h1>

      <p className="text-lg text-gray-500 mb-8 max-w-md">
        Nossa equipe está trabalhando duro para trazer esta novidade para você. Volte em breve para conferir!
      </p>

      <Link 
        to="/" 
        className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        Voltar para a Página Inicial
      </Link>

    </div>
  );
}

export default EmBreve;