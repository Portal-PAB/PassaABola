import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Cria o Contexto
const AuthContext = createContext(null);

// 2. Cria o Provedor (Provider)
export function AuthProvider({ children }) {
  // O estado agora é inicializado como 'undefined' para representar "carregando"
  const [user, setUser] = useState(undefined);

  // --- LÓGICA DE PERSISTÊNCIA ADICIONADA AQUI ---
  useEffect(() => {
    // Esta função roda apenas uma vez, quando a aplicação carrega
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        // Se encontramos um usuário no localStorage, definimos ele como logado
        setUser(JSON.parse(storedUser));
      } else {
        // Se não encontramos, definimos o usuário como deslogado
        setUser(null);
      }
    } catch (error) {
      console.error("Falha ao ler o localStorage", error);
      setUser(null);
    }
  }, []); // O array vazio [] garante que rode apenas na montagem inicial

  const login = (userData) => {
    // Salva o usuário no estado do React
    setUser(userData);
    // E também salva no localStorage (convertendo para string)
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    // Remove o usuário do estado do React
    setUser(null);
    // E também remove do localStorage
    localStorage.removeItem('user');
  };

  // Enquanto o estado é 'undefined', podemos mostrar uma tela de carregamento
  // Isso evita um "piscar" na tela onde o usuário aparece deslogado por um instante
  if (user === undefined) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Hook customizado (continua o mesmo)
export function useAuth() {
  return useContext(AuthContext);
}