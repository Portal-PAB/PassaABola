import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

function GerenciarNoticias() {
  const [titulo, setTitulo] = useState('');
  const [resumo, setResumo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [imagens, setImagens] = useState(['']);
  const [destaque, setDestaque] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const handleImagemChange = (index, value) => {
    const novasImagens = [...imagens];
    novasImagens[index] = value;
    setImagens(novasImagens);
  };

  const addCampoImagem = () => {
    if (imagens.length < 5 && imagens[imagens.length - 1]) {
      setImagens([...imagens, '']);
    }
  };

  const removeCampoImagem = (index) => {
    const novasImagens = [...imagens];
    novasImagens.splice(index, 1);
    setImagens(novasImagens);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMensagem('');

    const noticiaData = {
      titulo,
      resumo,
      conteudo,
      imagens: imagens.filter(url => url.trim() !== ''),
      destaque,
    };

    try {
      const response = await fetch(`${API_URL}/api/noticias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noticiaData),
      });

      const data = await response.json();
      if (response.ok) {
        setMensagem({ type: 'success', text: data.success });
        setTitulo(''); setResumo(''); setConteudo(''); setImagens(['']); setDestaque(false);
      } else {
        setMensagem({ type: 'error', text: data.error });
      }
    } catch (error) {
      setMensagem({ type: 'error', text: 'Erro de conexão com o servidor.' });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Adicionar Nova Notícia</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título</label>
          <input type="text" id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" required />
        </div>

        <div>
          <label htmlFor="resumo" className="block text-sm font-medium text-gray-700">Resumo</label>
          <textarea id="resumo" value={resumo} onChange={(e) => setResumo(e.target.value)} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" required></textarea>
        </div>

        <p className="text-xs text-gray-500 mt-1">
          Dica: Para criar um novo parágrafo, pressione Enter duas vezes.
        </p>

        <div>
          <label htmlFor="conteudo" className="block text-sm font-medium text-gray-700">Conteúdo Completo</label>
          <textarea id="conteudo" value={conteudo} onChange={(e) => setConteudo(e.target.value)} rows="10" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500" required></textarea>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Imagens (URLs)</label>
          {imagens.map((url, index) => (
            <div key={index} className="flex items-center mb-2">
              <input type="text" placeholder="https://exemplo.com/imagem.jpg" value={url} onChange={(e) => handleImagemChange(index, e.target.value)} className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
              {imagens.length > 1 && (
                <button type="button" onClick={() => removeCampoImagem(index)} className="ml-2 text-red-500 hover:text-red-700 font-bold">&times;</button>
              )}
            </div>
          ))}
          {imagens.length < 5 && (
            <button type="button" onClick={addCampoImagem} className="text-sm text-purple-600 hover:text-purple-800">+ Adicionar outra imagem</button>
          )}
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input id="destaque" type="checkbox" checked={destaque} onChange={(e) => setDestaque(e.target.checked)} className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded" />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="destaque" className="font-medium text-gray-700">Marcar como Destaque do Dia?</label>
          </div>
        </div>

        <div>
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            Publicar Notícia
          </button>
        </div>

        {mensagem && (
          <p className={`text-center font-medium ${mensagem.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {mensagem.text}
          </p>
        )}
      </form>
    </div>
  );
}

export default GerenciarNoticias;