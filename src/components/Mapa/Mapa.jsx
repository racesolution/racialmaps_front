import React, { useState, useEffect } from 'react';
import { Map, Marker } from 'pigeon-maps';
import './Mapa.css';

const Mapa = () => {
  const [puntos, setPuntos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);

  useEffect(() => {
    const obtenerDatosCSV = async () => {
      try {
        const respuesta = await fetch('/datos-mapa.csv');
        if (!respuesta.ok) throw new Error('No se pudo leer el archivo de datos.');
        
        const texto = await respuesta.text();
        const lineas = texto.split(/\r?\n/).filter(linea => linea.trim() !== '');
        
        if (lineas.length === 0) throw new Error('El archivo CSV está vacío.');

        // Limpiamos encabezados eliminando comillas y espacios extras
        const encabezados = lineas[0].split(',').map(e => e.replace(/['"]+/g, '').trim().toLowerCase());

        // Buscamos los índices de las columnas requeridas
        const idxCiudad = encabezados.indexOf('ciudad');
        const idxLat = encabezados.indexOf('latitud');
        const idxLng = encabezados.indexOf('longitud');
        const idxPoblacion = encabezados.indexOf('poblacion');
        
        // Columnas de Razas (porcentaje de 0 a 100)
        const idxBlanca = encabezados.indexOf('razablanca');
        const idxNegra = encabezados.indexOf('razanegra');
        const idxRoja = encabezados.indexOf('razaroja');
        const idxAmarilla = encabezados.indexOf('razaamarilla');

        if (idxLat === -1 || idxLng === -1 || idxPoblacion === -1 || idxBlanca === -1 || idxNegra === -1 || idxRoja === -1 || idxAmarilla === -1 || idxCiudad === -1) {
          throw new Error("El CSV debe contener exactamente las columnas: ciudad, latitud, longitud, Poblacion, RazaBlanca, RazaNegra, RazaRoja y RazaAmarilla.");
        }

        const registrosCargados = lineas.slice(1).map((linea, index) => {
          // Dividimos la línea controlando celdas con comillas
          const columnas = linea.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          
          const lat = parseFloat(columnas[idxLat]?.replace(/['"]+/g, '').trim());
          const lng = parseFloat(columnas[idxLng]?.replace(/['"]+/g, '').trim());
          
          // Extraemos la ciudad eliminando comillas y espacios en blanco invisibles
          const ciudadLimpia = columnas[idxCiudad]?.replace(/['"]+/g, '').trim();
          // Si el campo viene vacío o indefinido en esta fila, ponemos un texto de respaldo indicando el ID de fila
          const ciudad = ciudadLimpia ? ciudadLimpia : `Región Interna N° ${index + 1}`;
          
          const poblacionTotal = parseFloat(columnas[idxPoblacion]?.replace(/['"]+/g, '').trim()) || 0;

          if (!isNaN(lat) && !isNaN(lng)) {
            const relBlanca = parseFloat(columnas[idxBlanca]) || 0;
            const relNegra = parseFloat(columnas[idxNegra]) || 0;
            const relRoja = parseFloat(columnas[idxRoja]) || 0;
            const relAmarilla = parseFloat(columnas[idxAmarilla]) || 0;

            const absBlanca = Math.round((relBlanca / 100) * poblacionTotal);
            const absNegra = Math.round((relNegra / 100) * poblacionTotal);
            const absRoja = Math.round((relRoja / 100) * poblacionTotal);
            const absAmarilla = Math.round((relAmarilla / 100) * poblacionTotal);

            return {
              id: index,
              coordenadas: [lat, lng],
              ciudad,
              totalPoblacion: poblacionTotal,
              razas: {
                blanca: { nombre: 'Raza Blanca', relativo: relBlanca, absoluto: absBlanca, color: '#60a5fa' },
                negra: { nombre: 'Raza Negra', relativo: relNegra, absoluto: absNegra, color: '#a855f7' },
                roja: { nombre: 'Raza Roja', relativo: relRoja, absoluto: absRoja, color: '#f87171' },
                amarilla: { nombre: 'Raza Amarilla', relativo: relAmarilla, absoluto: absAmarilla, color: '#facc15' }
              }
            };
          }
          return null;
        }).filter(registro => registro !== null);

        setPuntos(registrosCargados);
        setCargando(false);
      } catch (err) {
        console.error("Error al procesar el mapa demográfico:", err);
        setError(err.message);
        setCargando(false);
      }
    };

    obtenerDatosCSV();
  }, []);

  if (cargando) return <div className="loading-view">Cargando mapa...</div>;
  if (error) return <div className="error-view">Error: {error}</div>;

  const centroInicial = puntos.length > 0 ? puntos[0].coordenadas : [0, 0];

  return (
    <div className="mapa-container">
      <div className="mapa-wrapper">
        <Map height={600} defaultCenter={centroInicial} defaultZoom={4} metaWheelZoom={true}>
          {puntos.map((punto) => (
            <Marker 
              key={punto.id} 
              anchor={punto.coordenadas} // Pigeon Maps necesita esto para ubicar el pin
              
              // 💡 ESTA ES LA CLAVE: El payload debe ser 'punto' (todo el objeto), NO 'punto.coordenadas'
              payload={punto} 
              
              onClick={({ payload }) => {
                console.log("Datos reales del punto clicado:", payload); 
                setPuntoSeleccionado(payload);
              }}
            />
          ))}
        </Map>
      </div>

      {puntoSeleccionado && (
        <div className="modal-overlay" onClick={() => setPuntoSeleccionado(null)}>
          <div className="modal-centro-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setPuntoSeleccionado(null)}>×</button>
            
            <div className="modal-header-section">
              <h3 className="modal-title">
                {puntoSeleccionado.ciudad}
              </h3>
            </div>
            
            <div className="modal-divider"></div>
            
            <div className="modal-body">
              <div className="modal-tabla-header">
                <span>Grupo Étnico</span>
                <span style={{ textAlign: 'right' }}>Absoluto / Relativo</span>
              </div>

              <div className="modal-razas-lista">
                {Object.values(puntoSeleccionado.razas).map((raza, i) => (
                  <div key={i} className="modal-raza-row">
                    <div className="raza-identificador">
                      <i style={{ backgroundColor: raza.color }} className="raza-indicador-color"></i>
                      <span className="raza-nombre-texto">{raza.nombre}</span>
                    </div>
                    <div className="raza-valores">
                      <span className="valor-absoluto">{raza.absoluto.toLocaleString()} hab.</span>
                      <span className="valor-relativo" style={{ color: raza.color }}>{raza.relativo}%</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="modal-footer-info">
                <p>Población total de la región: <strong>{puntoSeleccionado.totalPoblacion.toLocaleString()}</strong> habitantes.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mapa;