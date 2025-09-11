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
      // 1. Primeiro, verifica se a senha está correta
      const loginResponse = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        throw new Error(errorData.error || 'Senha incorreta.');
      }

      // 2. Se a senha está correta, busca os dados completos do usuário
      const userResponse = await fetch(`http://localhost:3001/api/usuario/${email}`);
      const userData = await userResponse.json();
      
      // 3. Salva os dados completos no contexto global
      login(userData);
      
      // 4. Redireciona para o perfil
      navigate('/perfil');

    } catch (error) {
      setMensagem(error.message);
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