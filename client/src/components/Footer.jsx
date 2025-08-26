import React from 'react';
import './Footer.css';

const SocialIcon = ({ children }) => <a href="#" className="social-icon">{children}</a>;

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="copyright-text">© 2025 Passa a Bola. Todos os direitos reservados</p>
        <div className="social-links">
          <SocialIcon>In</SocialIcon>
          <SocialIcon>Tw</SocialIcon>
          <SocialIcon>Fb</SocialIcon>
        </div>
      </div>
    </footer>
  );
}

export default Footer;