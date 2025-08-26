import React from 'react';
import './Footer.css';
import Insta from '../assets/instagram.png';
import X from '../assets/x.png';
import Youtube from '../assets/youtube.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="copyright-text">© 2025 Passa a Bola. Todos os direitos reservados</p>
        <div className="social-links">
          <a href="https://www.instagram.com/passaabola/" target="_blank" className='Insta'>
            <img src={Insta} alt="Instagram"/>
          </a>
          <a href="https://x.com/passaabola" target="_blank" className='X'>
            <img src={X} alt="X"/>
          </a>
          <a href="https://www.youtube.com/@passabola" target="_blank">
            <img src={Youtube} alt="Youtube"/>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;