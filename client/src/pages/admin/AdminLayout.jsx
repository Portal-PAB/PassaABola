import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Admin</h1>
          <span className="text-sm text-gray-400">{user?.email}</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin/copas" className="block py-2 px-4 rounded hover:bg-gray-700">Gerenciar Copas</Link>
          <Link to="/admin/noticias" className="block py-2 px-4 rounded hover:bg-gray-700">Gerenciar Notícias</Link>
          <Link to="/admin/inscricoes" className="block py-2 px-4 rounded hover:bg-gray-700">Ver Inscrições</Link>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button onClick={logout} className="w-full text-left py-2 px-4 rounded bg-red-600 hover:bg-red-700">
            Sair (Logout)
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;