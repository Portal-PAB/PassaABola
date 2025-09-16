import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Cadastro.css';

const API_URL = import.meta.env.VITE_API_URL;

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [cpf, setCpf] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMensagem('');

    if (senha !== confirmarSenha) {
      setMensagem('As senhas não coincidem!');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/cadastro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, cpf }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
        navigate('/login');
      } else {
        setMensagem(data.error);
      }
    } catch (error) {
      setMensagem('Erro de conexão com o servidor.', error);
    }
  };

  return (
    <div className="cadastro-container">
      <form className="cadastro-form" onSubmit={handleSubmit}>
        <h1 className="form-title">Cadastro</h1>
        
        <div className="input-group-classic">
          <label htmlFor="nome">Nome:</label>
          <input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>

        <div className="input-group-classic">
          <label htmlFor="cpf">CPF:</label>
          <input id="cpf" type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} required />
        </div>

        <div className="input-group-classic">
          <label htmlFor="email">Email:</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="input-group-classic">
          <label htmlFor="senha">Senha:</label>
          <input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </div>
        
        <div className="input-group-classic">
          <label htmlFor="confirmarSenha">Confirmar senha:</label>
          <input id="confirmarSenha" type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} required />
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