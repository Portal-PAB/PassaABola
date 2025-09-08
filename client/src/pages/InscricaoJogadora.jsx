import React, { useState } from 'react';

function InscricaoJogadora() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMensagem('');

    const jogadoraData = { nome, cpf, email, telefone };

    try {
      const response = await fetch('http://localhost:3001/inscricao-jogadora', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jogadoraData),
      });

      const data = await response.json();
      if (response.ok) {
        setMensagem({ type: 'success', text: data.success });

        setNome(''); setCpf(''); setEmail(''); setTelefone('');
      } else {
        setMensagem({ type: 'error', text: data.error });
      }
    } catch (error) {
      setMensagem({ type: 'error', text: 'Erro de conexão com o servidor.' });
    }
  };

  return (
    <div className="bg-white min-h-full py-12 px-4">
      <div className="w-full max-w-xl mx-auto bg-white p-8 md:p-10 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Inscrição de Jogadora Avulsa
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Não tem um time? Inscreva-se aqui e poderemos te encaixar em uma equipe.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome completo:</label>
            <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" required />
          </div>
          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">CPF:</label>
            <input type="text" id="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" required />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" required />
          </div>
          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">Telefone:</label>
            <input type="tel" id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
          </div>
          <button type="submit" className="w-full bg-purple-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-800 transition duration-300">
            Enviar Inscrição
          </button>
          {mensagem && (
            <p className={`text-center font-medium ${mensagem.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{mensagem.text}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default InscricaoJogadora;