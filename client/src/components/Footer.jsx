import React from 'react';
import './Footer.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faXTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faCopyright } from "@fortawesome/free-regular-svg-icons";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="copyright-text"><FontAwesomeIcon icon={faCopyright} /> 2025 Passa a Bola. Todos os direitos reservados</p>
        <div className="social-links">
          <a href="https://www.instagram.com/passaabola/" target="_blank" className='Insta'>
            <FontAwesomeIcon icon={faInstagram} size="2x" />
          </a>
          <a href="https://x.com/passaabola" target="_blank" className='X'>
            <FontAwesomeIcon icon={faXTwitter} size='2x' />
          </a>
          <a href="https://www.youtube.com/@passabola" target="_blank">
            <FontAwesomeIcon icon={faYoutube} size='2x'/>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;