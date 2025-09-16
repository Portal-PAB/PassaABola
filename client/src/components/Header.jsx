import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import './Header.css';
import Logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const ProfileIcon = () => <div className="icon-placeholder profile-icon"><FontAwesomeIcon icon={faUser} /></div>;

function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { user } = useAuth();

  // Função para fechar o menu ao clicar em um link
  const fecharMenu = () => setMenuAberto(false);

  return (
    <header className="header">
      <div className="header-container">
        <div className="icon-placeholder logo-icon">
          <Link to="/" onClick={fecharMenu}>
            <img src={Logo} alt="Logo" className="logo-image" />
          </Link>
        </div>
        
        <button 
          className="menu-hamburguer" 
          onClick={() => setMenuAberto(!menuAberto)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`menu-nav ${menuAberto ? 'ativo' : ''}`}>
          <ul>
            <li><Link to="/noticias" onClick={fecharMenu}>Notícias</Link></li>
            <li><Link to="/jogos" onClick={fecharMenu}>Jogos</Link></li>
            <li><Link to="/historia" onClick={fecharMenu}>História</Link></li>
            <li><Link to="/copa-pab" onClick={fecharMenu}>Copa PAB</Link></li>
            <li><Link to="/encontro-pab" onClick={fecharMenu}>Encontro PAB</Link></li>
            <li><Link to="/sobre" onClick={fecharMenu}>Sobre</Link></li>
            
            {/* ATUALIZADO: Item de perfil adicionado para o menu mobile */}
            <li className="item-menu-perfil">
              {user ? (
                <Link to="/perfil" onClick={fecharMenu}>
                  Perfil / Minha Conta
                </Link>
              ) : (
                <Link to="/login" onClick={fecharMenu}>
                  Login / Cadastro
                </Link>
              )}
            </li>
          </ul>
        </nav>
        
        <div className="profile-section">
          {user ? (
            <Link to="/perfil">
              <ProfileIcon />
            </Link>
          ) : (
            <Link to="/login">
              <ProfileIcon />
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}

export default Header;