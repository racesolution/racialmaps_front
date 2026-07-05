import React from 'react';
import { NavLink } from 'react-router-dom';
import './Menu.css';

const Menu = () => {
  const opciones = [
    { nombre: 'Mapa', ruta: '/mapa' },
    { nombre: 'Migraciones', ruta: '/migraciones' },
    { nombre: 'Raza', ruta: '/raza' },
    { nombre: 'Historia', ruta: '/historia' }
  ];

  return (
    <nav className="main-menu" style={{ position: 'fixed', top: '60px', left: 0, right: 0, height: '45px', backgroundColor: '#020617', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', padding: '0 24px', zIndex: 1010 }}>
      <div className="menu-list" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: '8px' }}>
        {opciones.map((opcion) => (
          <NavLink
            key={opcion.ruta}
            to={opcion.ruta}
            className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
          >
            {opcion.nombre}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Menu;