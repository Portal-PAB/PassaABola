import React, { useState } from 'react';
import '../styles/Cadastro.css';
import { Link } from 'react-router-dom';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [termos, setTermos] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMensagem('');

    if (senha !== confirmarSenha) {
      setMensagem('As senhas não coincidem!');
      return;
    }
    if (!termos) {
      setMensagem('Você precisa aceitar os termos de uso.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha }),
      });
      const data = await response.json();
      if (response.ok) {
        setMensagem(data.success);
        setNome(''); setEmail(''); setSenha(''); setConfirmarSenha(''); setTermos(false);
      } else {
        setMensagem(data.error);
      }
    } catch (error) {
      setMensagem('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="cadastro-container">
      <form className="cadastro-form" onSubmit={handleSubmit}>
        <h1 className="form-title">Cadastro</h1>
        
        <div className="input-group-classic">
          <label htmlFor="nome">Nome:</label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div className="input-group-classic">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group-classic">
          <label htmlFor="senha">Senha:</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        
        <div className="input-group-classic">
          <label htmlFor="confirmarSenha">Confirmar senha:</label>
          <input
            id="confirmarSenha"
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
          />
        </div>

        <div className="checkbox-group">
          <input 
            type="checkbox" 
            id="termos"
            checked={termos}
            onChange={(e) => setTermos(e.target.checked)}
          />
          <label htmlFor="termos">Aceito os Termos de Uso</label>
        </div>
        
        <button type="submit" className="submit-button">Cadastrar</button>

        {mensagem && <p className="mensagem-feedback">{mensagem}</p>}
        
        <p className="login-link">
            Já tem uma conta? <Link to="/login">Faça login para continuar.</Link>
        </p>

      </form>
    </div>
  );
}

export default Cadastro;