import { useState, useMemo, useEffect } from 'react';

export const parsearFecha = (fechaStr) => {
  if (!fechaStr || fechaStr === 'Sin Fecha') return new Date(0);
  const partes = fechaStr.split('/');
  if (partes.length !== 3) return new Date(0);
  const dia = parseInt(partes[0], 10);
  const mes = parseInt(partes[1], 10) - 1;
  const anio = parseInt(partes[2], 10);
  return new Date(anio, mes, dia);
};

export function useMultifiltros(datosIniciales) {
  const datosCronologicos = useMemo(() => {
    return [...datosIniciales].sort((a, b) => parsearFecha(a.Fecha) - parsearFecha(b.Fecha));
  }, [datosIniciales]);

  // Límites absolutos de la base de datos completa
  const opcionesFechaAbsolutas = useMemo(() => {
    const fechas = datosCronologicos.map(f => String(f.Fecha || '').trim()).filter(v => v !== "");
    return [...new Set(fechas)];
  }, [datosCronologicos]);

  const [filtros, setFiltros] = useState({
    Fecha: { desde: '', hasta: '' },
    Partida: [],
    subPartida: [],
    PERIODO: [] 
  });

  // Inicialización por defecto de las fechas (primer inicio)
  useMemo(() => {
    if (opcionesFechaAbsolutas.length > 0 && !filtros.Fecha.desde) {
      filtros.Fecha.desde = opcionesFechaAbsolutas[0];
      filtros.Fecha.hasta = opcionesFechaAbsolutas[opcionesFechaAbsolutas.length - 1];
    }
  }, [opcionesFechaAbsolutas]);

  // --- EFECTO: Sincronizar Calendario en base a PERIODO ---
  useEffect(() => {
    if (filtros.PERIODO.length > 0) {
      const periodoSeleccionado = String(filtros.PERIODO[0]).trim();
      
      if (periodoSeleccionado.includes('_')) {
        const partes = periodoSeleccionado.split('_');
        const anio = parseInt(partes[0], 10);
        const mes = parseInt(partes[1], 10);

        if (!isNaN(anio) && !isNaN(mes)) {
          const primeraFechaStr = `1/${mes}/${anio}`;
          const ultimoDiaDate = new Date(anio, mes, 0);
          const ultimaFechaStr = `${ultimoDiaDate.getDate()}/${mes}/${anio}`;

          setFiltros(prev => ({
            ...prev,
            Fecha: { desde: primeraFechaStr, hasta: ultimaFechaStr }
          }));
          return;
        }
      }

      // FALLBACK LOGICAL
      const filasDelPeriodo = datosCronologicos.filter(fila => 
        filtros.PERIODO.includes(String(fila.PERIODO || '').trim())
      );

      if (filasDelPeriodo.length > 0) {
        const primeraFecha = filasDelPeriodo[0].Fecha;
        const ultimaFecha = filasDelPeriodo[filasDelPeriodo.length - 1].Fecha;

        setFiltros(prev => ({
          ...prev,
          Fecha: { desde: primeraFecha, hasta: ultimaFecha }
        }));
      }
    } else {
      if (opcionesFechaAbsolutas.length > 0) {
        setFiltros(prev => ({
          ...prev,
          Fecha: { 
            desde: opcionesFechaAbsolutas[0], 
            hasta: opcionesFechaAbsolutas[opcionesFechaAbsolutas.length - 1] 
          }
        }));
      }
    }
  }, [filtros.PERIODO, datosCronologicos, opcionesFechaAbsolutas]);

  const handleFiltroChange = (columna, nuevosValores) => {
    setFiltros(prev => ({ ...prev, [columna]: nuevosValores }));
  };

  const limpiarFiltros = () => {
    if (opcionesFechaAbsolutas.length > 0) {
      setFiltros({
        Fecha: { desde: opcionesFechaAbsolutas[0], hasta: opcionesFechaAbsolutas[opcionesFechaAbsolutas.length - 1] },
        Partida: [],
        subPartida: [],
        PERIODO: []
      });
    }
  };

  const cumpleFiltroFecha = (fila) => {
    const { desde, hasta } = filtros.Fecha;
    if (!desde && !hasta) return true;
    const fechaCelda = parsearFecha(fila.Fecha).getTime();
    const limiteInferior = desde ? parsearFecha(desde).getTime() : parsearFecha(opcionesFechaAbsolutas[0]).getTime();
    const limiteSuperior = hasta ? parsearFecha(hasta).getTime() : parsearFecha(opcionesFechaAbsolutas[opcionesFechaAbsolutas.length - 1]).getTime();
    return fechaCelda >= limiteInferior && fechaCelda <= limiteSuperior;
  };

  // --- OPCIONES CRUZADAS ---
  const opcionesPartidaCruzadas = useMemo(() => {
    const filtrados = datosCronologicos.filter(fila => {
      if (!cumpleFiltroFecha(fila)) return false;
      if (filtros.subPartida.length > 0 && !filtros.subPartida.includes(String(fila.subPartida || '').trim())) return false;
      if (filtros.PERIODO.length > 0 && !filtros.PERIODO.includes(String(fila.PERIODO || '').trim())) return false;
      return true;
    });
    return [...new Set(filtrados.map(f => String(f.Partida || '').trim()).filter(Boolean))].sort();
  }, [datosCronologicos, filtros.Fecha, filtros.subPartida, filtros.PERIODO, opcionesFechaAbsolutas]);

  const opcionesSubPartidaCruzadas = useMemo(() => {
    const filtrados = datosCronologicos.filter(fila => {
      if (!cumpleFiltroFecha(fila)) return false;
      if (filtros.Partida.length > 0 && !filtros.Partida.includes(String(fila.Partida || '').trim())) return false;
      if (filtros.PERIODO.length > 0 && !filtros.PERIODO.includes(String(fila.PERIODO || '').trim())) return false;
      return true;
    });
    return [...new Set(filtrados.map(f => String(f.subPartida || '').trim()).filter(Boolean))].sort();
  }, [datosCronologicos, filtros.Fecha, filtros.Partida, filtros.PERIODO, opcionesFechaAbsolutas]);

  const opcionesPeriodoCruzadas = useMemo(() => {
    const filtrados = datosCronologicos.filter(fila => {
      if (!cumpleFiltroFecha(fila)) return false;
      if (filtros.Partida.length > 0 && !filtros.Partida.includes(String(fila.Partida || '').trim())) return false;
      if (filtros.subPartida.length > 0 && !filtros.subPartida.includes(String(fila.subPartida || '').trim())) return false;
      return true;
    });
    return [...new Set(filtrados.map(f => String(f.PERIODO || '').trim()).filter(Boolean))].sort();
  }, [datosCronologicos, filtros.Fecha, filtros.Partida, filtros.subPartida, opcionesFechaAbsolutas]);

  // --- DATA FILTRADA FINAL ---
  const datosFiltrados = useMemo(() => {
    return datosCronologicos.filter(fila => {
      if (!cumpleFiltroFecha(fila)) return false;
      if (filtros.Partida.length > 0 && !filtros.Partida.includes(String(fila.Partida || '').trim())) return false;
      if (filtros.subPartida.length > 0 && !filtros.subPartida.includes(String(fila.subPartida || '').trim())) return false;
      if (filtros.PERIODO.length > 0 && !filtros.PERIODO.includes(String(fila.PERIODO || '').trim())) return false;
      return true;
    });
  }, [datosCronologicos, filtros, opcionesFechaAbsolutas]);

  return {
    filtros,
    datosFiltrados,
    opcionesFechaAbsolutas,
    opcionesPartidaCruzadas,
    opcionesSubPartidaCruzadas,
    opcionesPeriodoCruzadas,
    handleFiltroChange,
    limpiarFiltros
  };
}