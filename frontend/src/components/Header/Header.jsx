import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './header.css'; // Stil dosyasını ayrıca oluşturacağız.

import KariyerLogo from '../../assets/kariyer_orj.png'

import { IoCloseSharp } from "react-icons/io5";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa"; // Düzeltildi
import { FaYoutube } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";

const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <Link to="/"><img className='Headerlogo' src={KariyerLogo} alt="Önder Logo" /></Link>
      <div className='menu-right'>
        <div className='social-media-icons-div'>
          <a href="https://www.facebook.com/onderiho" target='_blank' rel="noreferrer"><FaFacebookF className='social-media-icons' /></a>
          <a href="https://www.instagram.com/onderihl" target='_blank' rel="noreferrer"><FaInstagram className='social-media-icons' /></a>
          <a href="https://x.com/ONDERihl target='_blank'" rel="noreferrer"><FaTwitter className='social-media-icons' /></a>
          <a href="https://www.youtube.com/user/onderimamhatip" target='_blank' rel="noreferrer"><FaYoutube className='social-media-icons' /></a>
          <a href=" https://whatsapp.com/channel/0029Va640Ct0gcfIO3kVpO1s" target='_blank' rel="noreferrer"><FaWhatsapp className='social-media-icons' /></a>
        </div>
        <div className={`menu-icon ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          {isMenuOpen ? <IoCloseSharp /> : '☰'} {/* Buraya ikon eklendi */}
        </div>
      </div>
      <div className={`fullscreen-menu ${isMenuOpen ? 'active' : ''}`}>
      <div className='social-media-icons-toggle-menu'>
          <a href="https://www.facebook.com/onderiho" target='_blank' rel="noreferrer"><FaFacebookF className='social-media-icons' /></a>
          <a href="https://www.instagram.com/onderihl" target='_blank' rel="noreferrer"><FaInstagram className='social-media-icons' /></a>
          <a href="https://x.com/ONDERihl" target='_blank' rel="noreferrer"><FaTwitter className='social-media-icons' /></a>
          <a href="https://www.youtube.com/user/onderimamhatip" target='_blank' rel="noreferrer"><FaYoutube className='social-media-icons' /></a>
          <a href=" https://whatsapp.com/channel/0029Va640Ct0gcfIO3kVpO1s" target='_blank' rel="noreferrer"><FaWhatsapp className='social-media-icons' /></a>
        </div>
        <nav className='toggle-menu-nav'>
          <ul>
            <li>
              <Link to="/hakkımızda" onClick={toggleMenu}>Hakkımızda</Link>
            </li>
            <li>
              <Link to="/politika" onClick={toggleMenu}>Politikamız</Link>
            </li>
            <li>
              <Link to="https://www.onder.org.tr/iletisim" onClick={toggleMenu}>İletişim</Link>
            </li>
          </ul>
        </nav>
        <div>
        <img className='toggle-dekor' src="https://www.onder.org.tr/build/assets/search-bg-842c8fc7.svg" alt='Önder Logo' />
        </div>
      </div>
    </header>
  );
};

export default Header;
