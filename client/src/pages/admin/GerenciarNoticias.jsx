import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

function GerenciarNoticias() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNoticias = async () => {
    try {
      const response = await fetch(`${API_URL}/api/noticias`);
      const data = await response.json();
      setNoticias(data.sort((a, b) => b.id - a.id));
    } catch (error) {
      console.error("Erro ao buscar notícias:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNoticias();
  }, []);

  const handleToggleDestaque = async (id) => {
    try {
      await fetch(`${API_URL}/api/noticias/${id}/toggle-destaque`, {
        method: 'PATCH',
      });
      fetchNoticias();
    } catch (error) {
      console.error("Erro ao alternar destaque:", error);
    }
  };

  if (loading) return <p>Carregando notícias...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Notícias</h1>
        <Link to="/admin/noticias/nova" className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300">
          + Adicionar Nova
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-4">Título</th>
              <th className="p-4 text-center">Destaque</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {noticias.map(noticia => (
              <tr key={noticia.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{noticia.titulo}</td>
                <td className="p-4 text-center">
                  <button onClick={() => handleToggleDestaque(noticia.id)} className={`px-3 py-1 text-xs rounded-full text-white ${noticia.destaque ? 'bg-green-500' : 'bg-gray-400'}`}>
                    {noticia.destaque ? 'Sim' : 'Não'}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <Link to={`/admin/noticias/editar/${noticia.id}`} className="text-purple-600 hover:underline">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GerenciarNoticias;