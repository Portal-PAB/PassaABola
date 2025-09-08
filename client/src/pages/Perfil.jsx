import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Perfil() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="bg-white min-h-full p-8 text-center">
        <h1 className="text-2xl font-bold">Você não está logado.</h1>
        <p>Redirecionando para a página de login...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-full p-8 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold mb-4">Bem-vindo!</h1>
        <p className="text-xl text-gray-600 mb-8">
          Você está logado com o email: <span className="font-semibold">{user.email}</span>
        </p>
        <button 
          onClick={handleLogout}
          className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300"
        >
          Sair (Logout)
        </button>
      </div>
    </div>
  );
}

export default Perfil;