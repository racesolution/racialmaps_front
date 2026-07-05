import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="main-header">
      <div className="header-left">
        <span className="header-tagline">Plataforma Analítica Global</span>
      </div>
      
      <div className="header-right">
        <img 
          src="/racialmaps.png" 
          alt="RacialMaps Logo" 
          className="header-logo"
          onClick={() => navigate('/mapa')}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </header>
  );
};

export default Header;