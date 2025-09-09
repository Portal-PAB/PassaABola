import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';

export default function PageLayout() {
  return (
    <div className="app-container">
      <Header />
      {/* O Outlet renderiza a página atual (Cadastro, Login, etc.) aqui dentro */}
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}