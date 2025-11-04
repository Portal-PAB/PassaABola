import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

function InscricaoCopa() {
  const [nomeTime, setNomeTime] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [jogadoras, setJogadoras] = useState([{ nome: '', cpf: '' }]);
  const [mensagem, setMensagem] = useState('');
  const MAX_JOGADORAS = 15;

  const handleJogadoraChange = (index, event) => {
    const novasJogadoras = [...jogadoras];
    novasJogadoras[index][event.target.name] = event.target.value;
    setJogadoras(novasJogadoras);
  };

  const addJogadora = () => {
    if (jogadoras.length < MAX_JOGADORAS) {
      setJogadoras([...jogadoras, { nome: '', cpf: '' }]);
    }
  };

  const removeJogadora = (index) => {
    const novasJogadoras = [...jogadoras];
    novasJogadoras.splice(index, 1);
    setJogadoras(novasJogadoras);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMensagem('');

    const inscricaoData = { nomeTime, responsavel, cpf, email, telefone, jogadoras };

    try {
      const response = await fetch(`${API_URL}/inscricao-copa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inscricaoData),
      });

      const data = await response.json();
      if (response.ok) {
        setMensagem({ type: 'success', text: data.success });
        setNomeTime(''); setResponsavel(''); setCpf(''); setEmail(''); setTelefone('');
        setJogadoras([{ nome: '', cpf: '' }]);
      } else {
        setMensagem({ type: 'error', text: data.error });
      }
    } catch (error) {
      setMensagem({ type: 'error', text: 'Erro de conexão com o servidor.' }, error);
    }
  };

  return (
    <div className="bg-white min-h-full py-12 px-4">
      <div className="w-full max-w-3xl mx-auto bg-white p-8 md:p-10 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Formulário de Inscrição - Copa Passa a Bola
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset className="space-y-6 border-b-2 pb-6 border-gray-200">
            <legend className="text-xl font-semibold text-gray-700 mb-4">Dados da Equipe</legend>
            <div>
              <label htmlFor="nomeTime" className="block text-sm font-medium text-gray-700 mb-1">Nome do time:</label>
              <input type="text" id="nomeTime" value={nomeTime} onChange={(e) => setNomeTime(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" required />
            </div>
          </fieldset>

          <fieldset className="space-y-6 border-b-2 pb-6 border-gray-200">
            <legend className="text-xl font-semibold text-gray-700 mb-4">Dados da Responsável</legend>
            <div>
              <label htmlFor="responsavel" className="block text-sm font-medium text-gray-700 mb-1">Nome da responsável:</label>
              <input type="text" id="responsavel" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" required />
            </div>
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">CPF da responsável:</label>
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
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-xl font-semibold text-gray-700 mb-4">Dados das Jogadoras ({jogadoras.length}/{MAX_JOGADORAS})</legend>
            {jogadoras.map((jogadora, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-50 space-y-4 relative">
                <h3 className="font-semibold text-gray-600">Jogadora {index + 1}</h3>
                {jogadoras.length > 1 && (
                  <button type="button" onClick={() => removeJogadora(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl">
                    &times;
                  </button>
                )}
                <div>
                  <label htmlFor={`jogadora-nome-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Nome da jogadora:</label>
                  <input type="text" name="nome" id={`jogadora-nome-${index}`} value={jogadora.nome} onChange={(e) => handleJogadoraChange(index, e)} className="w-full p-3 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label htmlFor={`jogadora-cpf-${index}`} className="block text-sm font-medium text-gray-700 mb-1">CPF da jogadora:</label>
                  <input type="text" name="cpf" id={`jogadora-cpf-${index}`} value={jogadora.cpf} onChange={(e) => handleJogadoraChange(index, e)} className="w-full p-3 border border-gray-300 rounded-lg" required />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addJogadora}
              className="w-full bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              disabled={jogadoras.length >= MAX_JOGADORAS}
            >
              + Adicionar mais uma jogadora
            </button>
            {jogadoras.length >= MAX_JOGADORAS && (
              <p className="text-center text-sm text-red-600 mt-2">Você atingiu o número máximo de 15 jogadoras.</p>
            )}
          </fieldset>

          <div>
            <button type="submit" className="w-full bg-purple-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-800 transition duration-300 text-lg">
              Finalizar Inscrição
            </button>

            {mensagem && (
              <p className={`text-center font-medium mt-4 ${mensagem.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {mensagem.text}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default InscricaoCopa;