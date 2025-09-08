import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import CopaPAB from './pages/CopaPAB';
import InscricaoCopa from './pages/InscricaoCopa';
import InscricaoJogadora from './pages/InscricaoJogadora';
import EscolhaInscricao from './pages/EscolhaInscricao';
import Perfil from './pages/Perfil';

import './App.css'; 

const PageLayout = ({ children }) => (
  <div className="app-container">
    <Header />
    <main className="main-content">{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cadastro" element={<PageLayout><Cadastro /></PageLayout>} />
        <Route path="/login" element={<PageLayout><Login /></PageLayout>} />
        <Route path="/copa-pab" element={<PageLayout><CopaPAB /></PageLayout>} />
        <Route path="/perfil" element={<PageLayout><Perfil /></PageLayout>} />
        
        <Route path="/inscricao" element={<PageLayout><EscolhaInscricao /></PageLayout>} />
        <Route path="/inscricao-time" element={<PageLayout><InscricaoCopa /></PageLayout>} />
        <Route path="/inscricao-jogadora" element={<PageLayout><InscricaoJogadora /></PageLayout>} />

        <Route path="*" element={<Navigate to="/cadastro" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;