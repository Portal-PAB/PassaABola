import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Perfil() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null; 
  }

  return (
    <div className="bg-white min-h-full p-8 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold mb-4">Bem-vindo!</h1>
        <p className="text-xl text-gray-600 mb-8">
          Você está logado com o email: <span className="font-semibold">{user?.email}</span>
        </p>
        
        <Link to="/admin" className="inline-block bg-purple-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-800 transition duration-300 mr-4">
          Painel de Admin
        </Link>

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