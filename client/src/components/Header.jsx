import React, { useState } from 'react';
import './Header.css';

const LogoIcon = () => <div className="icon-placeholder logo-icon">⚽</div>;
const ProfileIcon = () => <div className="icon-placeholder profile-icon">👤</div>;

function Header() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <LogoIcon />
        
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
            <li><a href="#">Notícias</a></li>
            <li><a href="#">Jogos</a></li>
            <li><a href="#">História</a></li>
            <li><a href="#">Copa PNB</a></li>
            <li><a href="#">Sobre</a></li>
          </ul>
        </nav>
        
        <div className="profile-section">
          <ProfileIcon />
        </div>
      </div>
    </header>
  );
}

export default Header;