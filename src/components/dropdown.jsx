import React, { useState, useRef, useEffect } from 'react';

export default function DropdownFiltro({ titulo, opciones, valoresSeleccionados, onFiltroChange }) {
  const [abierto, setAbierto] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar el dropdown si el usuario hace clic afuera de él
  useEffect(() => {
    const handleClicAfuera = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAbierto(false);
      }
    };
    document.addEventListener('mousedown', handleClicAfuera);
    return () => document.removeEventListener('mousedown', handleClicAfuera);
  }, []);

  const handleCheckboxChange = (opcion) => {
    let nuevasSelecciones = [...valoresSeleccionados];
    if (nuevasSelecciones.includes(opcion)) {
      nuevasSelecciones = nuevasSelecciones.filter(item => item !== opcion);
    } else {
      nuevasSelecciones.push(opcion);
    }
    onFiltroChange(nuevasSelecciones); // Devuelve el array limpio al padre
  };

  const limpiarFiltro = (e) => {
    e.stopPropagation();
    onFiltroChange([]);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">{titulo}</label>
      
      {/* Botón Principal */}
      <div 
        onClick={() => setAbierto(!abierto)}
        className="w-full flex items-center justify-between text-sm border border-gray-300 rounded-lg p-2 bg-white cursor-pointer hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 min-h-[38px] select-none"
      >
        <span className="truncate text-gray-700 max-w-[180px]">
          {valoresSeleccionados.length === 0 
            ? "Todos" 
            : `Seleccionados (${valoresSeleccionados.length})`
          }
        </span>
        <div className="flex items-center gap-1">
          {valoresSeleccionados.length > 0 && (
            <button 
              onClick={limpiarFiltro}
              className="text-xs text-gray-400 hover:text-red-500 px-1 font-bold mb-0.5"
              title="Limpiar filtro"
            >
              ✕
            </button>
          )}
          <span className="text-gray-400 text-xs translate-y-[1px]">▼</span>
        </div>
      </div>

      {/* Menú Flotante */}
      {abierto && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto p-2">
          {opciones.length === 0 ? (
            <div className="text-xs text-gray-400 p-2 text-center">No hay opciones</div>
          ) : (
            opciones.map((opcion, idx) => (
              <label 
                key={idx} 
                className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded cursor-pointer text-sm text-gray-800"
              >
                <input 
                  type="checkbox" 
                  checked={valoresSeleccionados.includes(opcion)}
                  onChange={() => handleCheckboxChange(opcion)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-gray-300"
                />
                <span className="truncate">{opcion}</span>
              </label>
            ))
          )}
        </div>
      )}
    </div>
  );
}