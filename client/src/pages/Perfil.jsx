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

  // Esta verificação agora é ainda mais importante
  if (!user) {
    // Para evitar um piscar da tela, podemos retornar null enquanto o contexto carrega
    return null; 
  }

  return (
    <div className="bg-white min-h-full p-8 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold mb-4">Bem-vindo!</h1>
        <p className="text-xl text-gray-600 mb-8">
          {/* Usando optional chaining: user?.email */}
          {/* Isso tenta ler 'user.email', mas se 'user' for nulo, ele para e não dá erro. */}
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