import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

// Importamos los componentes desde la carpeta components
import KALA from './components/KALA';
import ST from './components/ST';
import EM from './components/EM';
import LR from './components/LR';
import EDP from './components/EDP';

// Vista principal (Parrilla)
function Home() {
  const unidades = [
    { id: 1, nombre: 'KALA', path: '/kala', descripcion: 'Descripción o detalles de la unidad KALA' },
    { id: 2, nombre: 'ST',   path: '/st',   descripcion: 'Descripción o detalles de la unidad ST' },
    { id: 3, nombre: 'EM',   path: '/em',   descripcion: 'Descripción o detalles de la unidad EM' },
    { id: 4, nombre: 'LR',   path: '/lr',   descripcion: 'Descripción o detalles de la unidad LR' },
    { id: 5, nombre: 'EDP',  path: '/edp',  descripcion: 'Descripción o detalles de la unidad EDP' },
  ];

  return (
    <div className="bg-gray-100 p-6 h-full">
      <div className="mb-8 text-center mt-4">
        <h1 className="text-3xl font-bold text-gray-800">Panel de Unidades</h1>
        <p className="text-gray-600 mt-2">Vista de parrilla para el control de módulos</p>
      </div>

      {/* La Parrilla (Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {unidades.map((unidad) => (
          <div 
            key={unidad.id} 
            className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
                  ID: {unidad.id}
                </span>
                <span className="h-3 w-3 rounded-full bg-green-500" title="Activo"></span>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
                {unidad.nombre}
              </h2>
              
              <p className="text-gray-600 text-sm">
                {unidad.descripcion}
              </p>
            </div>

            <div className="mt-6">
              <Link 
                to={unidad.path} 
                className="block text-center w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Ver Detalles
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function HeaderDinamico() {
  const location = useLocation(); // Hook para obtener la URL actual

  // EL DICCIONARIO (Puedes editar los nombres de KALA, EM y LR como prefieras)
  const nombresUnidades = {
    '/': '',
    '/st': 'SANTA TERESA',
    '/edp': 'DUPLO',
    '/kala': 'KALA',
    '/em': 'MONTESQUIEU',
    '/lr': 'LA ROSA',
  };

  // Buscamos la ruta en el diccionario. 
  // Si alguien entra a una ruta que no existe en el dict, puedes dejar un fallback (ej. 'PRANA GROUP' o '')
  const tituloHeader = nombresUnidades[location.pathname] !== undefined 
    ? nombresUnidades[location.pathname] 
    : '';

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Lado Izquierdo: Logo + Título Dinámico */}
        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <img src="/prana.png" alt="Logo Prana" className="h-10 w-auto object-contain" />
          
          {/* Solo renderizamos el span si hay un texto que mostrar */}
          {tituloHeader && (
            <span className="font-extrabold text-xl tracking-tight text-gray-900 uppercase border-l-2 border-gray-300 pl-3 ml-1">
              {tituloHeader}
            </span>
          )}
        </Link>

        {/* Lado Derecho: Info o Usuario */}
        <div className="hidden sm:flex items-center text-sm font-medium text-gray-500">
          Sistema Central de Control
        </div>
      </div>
    </header>
  );
}

// Configuración del Enrutador Global
export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        
        {/* Insertamos nuestro Header Dinámico AQUÍ, ya dentro del Router */}
        <HeaderDinamico />

        {/* CONTENIDO DINÁMICO */}
        <main className="flex-grow relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/kala" element={<KALA />} />
            <Route path="/st" element={<ST />} />
            <Route path="/em" element={<EM />} />
            <Route path="/lr" element={<LR />} />
            <Route path="/edp" element={<EDP />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}