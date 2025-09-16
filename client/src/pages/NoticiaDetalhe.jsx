import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const API_URL = import.meta.env.VITE_API_URL;

function NoticiaDetalhe() {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);

  useEffect(() => {
    const fetchNoticia = async () => {
      try {
        const response = await fetch(`${API_URL}/api/noticias/${id}`);
        const noticiaEncontrada = await response.json();
        setNoticia(noticiaEncontrada);
      } catch (error) {
        console.error("Erro ao carregar detalhe da notícia:", error);
        setNoticia(null);
      }
    };

    if (id) {
      fetchNoticia();
    }
  }, [id]);

  if (!noticia) {
    return <div className="text-center p-10">Carregando notícia...</div>;
  }

  const paragrafos = noticia.conteudo ? noticia.conteudo.split('\n') : [];
  const primeiraImagem = noticia.imagens && noticia.imagens.length > 0 ? noticia.imagens[0] : null;
  const restoDasImagens = noticia.imagens && noticia.imagens.length > 1 ? noticia.imagens.slice(1) : [];

  return (
    <div className="bg-white min-h-full py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/noticias" className="text-purple-600 hover:text-purple-800 mb-8 inline-block">
          <FontAwesomeIcon icon={faArrowLeft} /> Voltar para todas as notícias
        </Link>

        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          {noticia.titulo}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {noticia.resumo}
        </p>

        {primeiraImagem && (
          <div className="my-8">
            <img 
              src={primeiraImagem} 
              alt={`Imagem principal da notícia`}
              className="w-full h-auto object-cover rounded-lg shadow-md"
            />
          </div>
        )}

        <div className="text-lg text-gray-800 leading-relaxed space-y-6">
          {paragrafos.map((paragrafo, index) => (
            <React.Fragment key={index}>
              <p>{paragrafo}</p>
              {restoDasImagens[index] && (
                <div className="my-8">
                  <img 
                    src={restoDasImagens[index]} 
                    alt={`Imagem ${index + 2} da notícia`}
                    className="w-full h-auto object-cover rounded-lg shadow-md"
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NoticiaDetalhe;