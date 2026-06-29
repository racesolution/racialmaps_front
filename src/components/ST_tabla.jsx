import React, { useMemo } from 'react';
import { parsearFecha } from '../hooks/useMultiFiltros';

export default function ST_tabla({ datosFiltrados, columnasVisibles }) {
  
  const datosOrdenados = useMemo(() => {
    return [...datosFiltrados].sort((a, b) => {
      const fechaA = parsearFecha(a.Fecha).getTime();
      const fechaB = parsearFecha(b.Fecha).getTime();

      if (fechaB !== fechaA) {
        return fechaB - fechaA;
      }
      return 0;
    });
  }, [datosFiltrados]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold tracking-wider">
            <tr>
              {columnasVisibles.map((col, idx) => (
                <th key={idx} className="px-6 py-4">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-gray-900">
            {datosOrdenados.length === 0 ? (
              <tr>
                <td colSpan={columnasVisibles.length} className="p-12 text-center text-gray-500">
                  Ningún registro coincide con los filtros aplicados.
                </td>
              </tr>
            ) : (
              datosOrdenados.map((fila, idxFila) => (
                <tr key={idxFila} className="hover:bg-gray-50 transition-colors">
                  {columnasVisibles.map((col, idxCol) => {
                    const valor = fila[col];
                    const esNumero = typeof valor === 'number';

                    let clasesMonto = "";
                    if (col === 'Monto' && esNumero) {
                      clasesMonto = valor < 0 
                        ? "text-red-600 font-bold" 
                        : "text-emerald-700 font-bold";
                    }

                    if (col === 'Link') {
                      if (!valor) return <td key={idxCol} className="px-6 py-3 whitespace-nowrap"></td>;
                      const linksArray = String(valor).split(',').map(l => l.trim()).filter(Boolean);
                      if (linksArray.length === 0) return <td key={idxCol} className="px-6 py-3 whitespace-nowrap"></td>;

                      return (
                        <td key={idxCol} className="px-6 py-3 whitespace-nowrap flex gap-1.5 justify-start items-center">
                          {linksArray.map((link, idxLink) => (
                            <a
                              key={idxLink}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="cursor-pointer text-base hover:opacity-70 transition-opacity duration-150"
                              title={`Abrir documento adjunto ${idxLink + 1}`}
                            >
                              📜
                            </a>
                          ))}
                        </td>
                      );
                    }

                    return (
                      <td key={idxCol} className={`px-6 py-3 whitespace-nowrap ${clasesMonto}`}>
                        {esNumero ? valor.toFixed(2) : String(valor || '')}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}