import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMensagem('');

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();
      if (response.ok) {
        const userData = { email };
        login(userData);
        navigate('/perfil');
      } else {
        setMensagem(data.error);
      }
    } catch (error) {
      setMensagem('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="form-title">Login</h1>

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

        <a href="#" className="forgot-password-link">Esqueceu a senha?</a>

        <button type="submit" className="submit-button">Entrar</button>

        {mensagem && <p className="mensagem-feedback">{mensagem}</p>}

        <p className="register-link">
          Ainda não tem uma conta? <Link to="/cadastro">Cadastre-se agora!</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;