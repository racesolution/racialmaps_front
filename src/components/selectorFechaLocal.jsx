import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { parsearFecha } from '../hooks/useMultiFiltros';

export default function SelectorFechaLocal({ titulo, opciones, filtrosFecha, onFiltroChange }) {
  if (!opciones || opciones.length === 0) return null;

  // Convertimos las strings de "DD/MM/YYYY" a objetos Date reales para el DatePicker
  const startDate = filtrosFecha.desde ? parsearFecha(filtrosFecha.desde) : null;
  const endDate = filtrosFecha.hasta ? parsearFecha(filtrosFecha.hasta) : null;

  const minAbsoluto = parsearFecha(opciones[0]);
  const maxAbsoluto = parsearFecha(opciones[opciones.length - 1]);

  const handleCambioRango = (update) => {
    const [start, end] = update;
    
    // Formateador interno para devolver la fecha a string "D/M/YYYY" compatible con tu BD
    const formatearAStr = (dateObj) => {
      if (!dateObj) return '';
      const d = String(dateObj.getDate()).padStart(2, '0');
      const m = String(dateObj.getMonth() + 1).padStart(2, '0');
      const y = dateObj.getFullYear();
      return `${d}/${m}/${y}`; // Asegura formato 01/05/2026
    };

    onFiltroChange({
      desde: start ? formatearAStr(start) : '',
      hasta: end ? formatearAStr(end) : ''
    });
  };

  return (
    <div className="col-span-1 flex flex-col justify-end">
      <label className="block text-xs font-bold uppercase mb-1.5 text-center tracking-wide text-gray-700">
        {titulo}
      </label>
      <div 
        className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-gray-200 shadow-sm relative cursor-pointer hover:border-gray-300 transition-all"
        style={{ minHeight: '42px' }}
      >
        <span className="text-gray-400">📅</span>
        <DatePicker
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          minDate={minAbsoluto}
          maxDate={maxAbsoluto}
          onChange={handleCambioRango}
          // openToDate fuerza al calendario a abrirse en el mes de la fecha 'desde' recalculada
          openToDate={startDate || minAbsoluto} 
          dateFormat="dd/MM/yyyy"
          className="w-full text-xs font-medium bg-transparent text-gray-900 border-none p-0 cursor-pointer focus:ring-0 focus:outline-none"
          placeholderText="Selecciona rango de fechas"
        />
      </div>
    </div>
  );
}