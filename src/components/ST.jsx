import React, { useState, useEffect, useRef, useMemo } from 'react'; 
import { Link } from 'react-router-dom';
import { pranaBD } from '../services/pranaBD';
import { useMultifiltros } from '../hooks/useMultiFiltros'; 
import ST_tabla from './ST_tabla';      
import ST_grafico from './ST_grafico'; 
import Dropdown from './dropdown';      
import SelectorFechaLocal from './selectorFechaLocal'; 

export default function ST() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [vista, setVista] = useState('tabla');
  const tablaRef = useRef(null);

  const {
    filtros,
    datosFiltrados,
    opcionesFechaAbsolutas,
    opcionesPartidaCruzadas,
    opcionesSubPartidaCruzadas,
    opcionesPeriodoCruzadas,
    handleFiltroChange,
    limpiarFiltros
  } = useMultifiltros(datos);

  // Generación local y limpia de los datos estructurados para el componente Recharts
  const dataGrafico = useMemo(() => {
    if (!datosFiltrados.length) return [];

    const fechasUnicas = [...new Set(datosFiltrados.map(f => f.Fecha))];

    return fechasUnicas.map(fecha => {
      const filasDelDia = datosFiltrados.filter(f => f.Fecha === fecha);
      const saldoCierre = filasDelDia[0]?.Saldo || 0;
      const totalMovimientos = filasDelDia.reduce((sum, f) => sum + (Number(f.Monto) || 0), 0);

      return {
        Fecha: fecha,
        Movimientos: Number(totalMovimientos.toFixed(2)),
        Balance: Number(saldoCierre)
      };
    }).sort((a, b) => {
      const [dA, mA, yA] = a.Fecha.split('/');
      const [dB, mB, yB] = b.Fecha.split('/');
      return new Date(yA, mA - 1, dA) - new Date(yB, mB - 1, dB);
    });
  }, [datosFiltrados]);

  const handleFiltrarPorBarra = (fechaSeleccionada) => {
    handleFiltroChange('PERIODO', []);
    handleFiltroChange('Fecha', { desde: fechaSeleccionada, hasta: fechaSeleccionada });
    setVista('tabla');
  };

  useEffect(() => {
    pranaBD('ST')
      .then((data) => {
        setDatos(data);
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }, []);

  useEffect(() => {
    if (vista === 'tabla' && tablaRef.current) {
      const timer = setTimeout(() => {
        tablaRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 150); 
      return () => clearTimeout(timer);
    }
  }, [vista, filtros.Fecha]);

  const columnasVisibles = ['Fecha', 'Descripción operación', 'Monto', 'Saldo', 'Partida', 'subPartida', 'Link'];

  const kpis = useMemo(() => {
    return datosFiltrados.reduce(
      (acc, fila) => {
        const monto = typeof fila.Monto === 'number' ? fila.Monto : 0;
        if (monto > 0) acc.ingresos += monto;
        else acc.egresos += monto;
        return acc;
      },
      { ingresos: 0, egresos: 0 }
    );
  }, [datosFiltrados]);

  const totalBalance = kpis.ingresos + kpis.egresos;

  return (
    <div className="bg-transparent p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado Compacto */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-500 text-sm hidden sm:block font-medium">
            Contabilidad y Finanzas
          </p>
          <Link to="/" className="inline-flex items-center justify-center bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors shadow-sm ml-auto">
            ← Volver al Panel
          </Link>
        </div>

        {/* KPIs y Selector de Vistas */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm flex items-center inline-flex self-start">
            <div className="flex bg-gray-50 p-1 rounded-lg">
              <button onClick={() => setVista('tabla')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${vista === 'tabla' ? 'bg-white text-gray-950 shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-900'}`}>
                📊 Vista Tabla
              </button>
              <button onClick={() => setVista('grafico')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${vista === 'grafico' ? 'bg-white text-gray-950 shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-900'}`}>
                📈 Vista Gráfico
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex-grow md:flex-grow-0 gap-y-2 gap-x-6 items-center">
            <div className="text-center sm:text-left md:border-r md:border-gray-100 md:pr-4">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Movimientos</span>
              <span className="text-base font-black text-indigo-600">{datosFiltrados.length}</span>
            </div>
            <div className="text-center sm:text-left md:border-r md:border-gray-100 md:pr-4">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ingresos</span>
              <span className="text-base font-black text-emerald-600">+{kpis.ingresos.toFixed(2)}</span>
            </div>
            <div className="text-center sm:text-left md:border-r md:border-gray-100 md:pr-4">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Egresos</span>
              <span className="text-base font-black text-rose-600">{kpis.egresos.toFixed(2)}</span>
            </div>
            <div className="text-center sm:text-left">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Saldo Neto</span>
              <span className={`text-base font-black ${totalBalance >= 0 ? 'text-gray-900' : 'text-rose-700'}`}>
                {totalBalance >= 0 ? '+' : ''}{totalBalance.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Panel de Mandos */}
        {!cargando && !error && (
          <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-3 mb-6 bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 flex-grow">
              <SelectorFechaLocal 
                titulo="Rango de Fechas" 
                opciones={opcionesFechaAbsolutas} 
                filtrosFecha={filtros.Fecha} 
                onFiltroChange={(nuevosValores) => handleFiltroChange('Fecha', nuevosValores)} 
              />

              <Dropdown 
                titulo="Periodo" 
                opciones={opcionesPeriodoCruzadas} 
                valoresSeleccionados={filtros.PERIODO} 
                onFiltroChange={(nuevosValores) => handleFiltroChange('PERIODO', nuevosValores)} 
              />

              <Dropdown 
                titulo="Partida" 
                opciones={opcionesPartidaCruzadas} 
                valoresSeleccionados={filtros.Partida} 
                onFiltroChange={(nuevosValores) => handleFiltroChange('Partida', nuevosValores)} 
              />
              
              <Dropdown 
                titulo="Subpartida" 
                opciones={opcionesSubPartidaCruzadas} 
                valoresSeleccionados={filtros.subPartida} 
                onFiltroChange={(nuevosValores) => handleFiltroChange('subPartida', nuevosValores)} 
              />
            </div>

            <div className="flex flex-col justify-end min-w-[120px]">
              <button
                onClick={limpiarFiltros}
                className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-950 text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all shadow-sm"
                style={{ height: '42px' }}
                title="Restaurar todos los filtros"
              >
                🧹 Limpiar
              </button>
            </div>
          </div>
        )}

        {cargando && <div className="text-center p-12 text-gray-500 bg-white rounded-xl border border-gray-200 shadow-sm">Procesando registros...</div>}
        {error && <div className="bg-red-50 text-red-800 p-6 rounded-xl border border-red-200 shadow-sm">Error: {error}</div>}

        {/* Renderizado de Contenido Dinámico */}
        {!cargando && !error && (
          vista === 'tabla' 
            ? (
              <div ref={tablaRef} className="scroll-mt-6 shadow-sm rounded-xl overflow-hidden">
                <ST_tabla datosFiltrados={datosFiltrados} columnasVisibles={columnasVisibles} />
              </div>
            )
            : (
              <div className="shadow-sm rounded-xl bg-white border border-gray-200 p-4">
                <ST_grafico 
                  dataGrafico={dataGrafico} 
                  onClickBarra={handleFiltrarPorBarra} 
                  referenciaTabla={tablaRef} 
                />
              </div>
            )
        )}

      </div>
    </div>
  );
}