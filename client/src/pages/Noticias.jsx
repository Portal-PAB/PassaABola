import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// NOVO: Define a URL da API a partir da variável de ambiente
const API_URL = import.meta.env.VITE_API_URL;

function Noticias() {
  const [destaque, setDestaque] = useState(null);
  const [outrasNoticias, setOutrasNoticias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ATUALIZADO: Função para buscar notícias da API
    const fetchNoticias = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/noticias`);
        const dadosNoticias = await response.json();

        const noticiaDestaque = dadosNoticias.find(n => n.destaque === true);
        const restoDasNoticias = dadosNoticias.filter(n => n.destaque === false);
        
        setDestaque(noticiaDestaque);
        setOutrasNoticias(restoDasNoticias);
      } catch (error) {
        console.error("Erro ao carregar notícias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticias();
  }, []);

  if (loading) {
    return <div className="text-center p-10">Carregando notícias...</div>;
  }

  return (
    <div className="bg-white min-h-full p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        {destaque && ( 
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-purple-600 pl-3">
              Destaque do dia
            </h2>

            <Link to={`/noticias/${destaque.id}`} className="block group">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="overflow-hidden rounded-lg">
                  <img 
                    src={destaque.imagens[0]}
                    alt={destaque.titulo} 
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110" 
                  />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors duration-300">
                    {destaque.titulo}
                  </h3>
                  <p className="text-gray-600 mt-4 text-lg">
                    {destaque.resumo}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-purple-600 pl-3">
            Mais notícias
          </h2>
          <div className="space-y-6">
            {outrasNoticias.map(noticia => (
              <Link to={`/noticias/${noticia.id}`} key={noticia.id} className="block group">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center p-2 rounded-lg hover:bg-gray-50 transition-colors duration-300">

                  <div className="sm:col-span-1 overflow-hidden rounded-md">
                    <img 
                      src={noticia.imagens[0]} 
                      alt={noticia.titulo}
                      className="w-full h-24 object-cover" 
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <h4 className="text-xl font-semibold text-gray-800 group-hover:text-purple-700">
                      {noticia.titulo}
                    </h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Noticias;