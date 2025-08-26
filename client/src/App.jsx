import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import './App.css'; 

// Componente de Layout
const PageLayout = ({ children }) => (
  <div className="app-container">
    <Header />
    <main className="main-content">
      {children}
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cadastro" element={<PageLayout><Cadastro /></PageLayout>} />
        <Route path="/login" element={<PageLayout><Login /></PageLayout>} />
        <Route path="*" element={<Navigate to="/cadastro" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;