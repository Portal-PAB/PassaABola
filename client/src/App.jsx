import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PageLayout from './components/layout/PageLayout';
import AdminLayout from './pages/admin/AdminLayout';

// Autenticação
import ProtectedRoute from './components/auth/ProtectedRoute';

// Páginas Públicas
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import Perfil from './pages/Perfil';
import Noticias from './pages/Noticias';
import NoticiaDetalhe from './pages/NoticiaDetalhe';
import Jogos from './pages/Jogos';
import CopaPAB from './pages/CopaPAB';
import EscolhaInscricao from './pages/EscolhaInscricao';
import InscricaoCopa from './pages/InscricaoCopa';
import InscricaoJogadora from './pages/InscricaoJogadora';

// Páginas de Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import GerenciarNoticias from './pages/admin/GerenciarNoticias';
import VerInscricoes from './pages/admin/VerInscricoes';

import './App.css'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Rotas Públicas (todas usam o PageLayout) --- */}
        <Route element={<PageLayout />}>
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/noticias/:id" element={<NoticiaDetalhe />} />
          <Route path="/jogos" element={<Jogos />} />
          <Route path="/copa-pab" element={<CopaPAB />} />
          <Route path="/inscricao" element={<EscolhaInscricao />} />
          <Route path="/inscricao-time" element={<InscricaoCopa />} />
          <Route path="/inscricao-jogadora" element={<InscricaoJogadora />} />
          <Route path="/" element={<Navigate to="/noticias" />} /> {/* Rota inicial agora é /noticias */}
        </Route>

        {/* --- Rotas de Admin (Protegidas e com Layout Próprio) --- */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="noticias" element={<GerenciarNoticias />} />
          <Route path="inscricoes" element={<VerInscricoes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;