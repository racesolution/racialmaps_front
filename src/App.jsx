import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Menu from './components/Menu';
import Mapa from './components/Mapa';
import './App.css';

const App = () => {
  return (
    <HelmetProvider>
      <Router>
        <div className="app-layout">
          
          {/* 1. Encabezado */}
          <Header />

          {/* 2. Menú de navegación */}
          <Menu />

          {/* 3. Vistas dinámicas */}
          <main className="main-content" style={{ marginTop: '110px', padding: '20px' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/mapa" replace />} />
              
              <Route path="/mapa" element={<Mapa />} />
              
              <Route path="/migraciones" element={
                <div style={{ color: 'white' }}><h2>Módulo de Migraciones</h2><p>En desarrollo...</p></div>
              } />
              
              <Route path="/raza" element={
                <div style={{ color: 'white' }}><h2>Módulo de Raza</h2><p>En desarrollo...</p></div>
              } />
              
              <Route path="/historia" element={
                <div style={{ color: 'white' }}><h2>Módulo de Historia</h2><p>En desarrollo...</p></div>
              } />

              <Route path="*" element={<Navigate to="/mapa" replace />} />
            </Routes>
          </main>

        </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;