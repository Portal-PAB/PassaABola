import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import './Header.css';
import Logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

const ProfileIcon = () => <div className="icon-placeholder profile-icon">👤</div>;

function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { user } = useAuth();

  return (
    <header className="header">
      <div className="header-container">
        <div className="icon-placeholder logo-icon"><img src={Logo} alt="Logo" className="logo-image" /></div>
        
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
            <li><Link to="/noticias">Notícias</Link></li>
            <li><Link to="/jogos">Jogos</Link></li>
            <li><a href="#">História</a></li>
            <li><Link to="/copa-pab">Copa PAB</Link></li>
            <li><a href="#">Sobre</a></li>
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