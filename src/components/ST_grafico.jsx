import React from 'react';
import { ResponsiveContainer, ComposedChart, Line, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function ST_grafico({ dataGrafico, onClickBarra, referenciaTabla }) {
  
  // Modificamos el manejador para recibir directamente los datos de la barra clickeada
  const handleBarClick = (data) => {
    // data.Fecha contiene el string exacto de la barra (ej: "15/05/2026")
    if (data && data.Fecha && onClickBarra) {
      onClickBarra(data.Fecha);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900">Flujo de Caja</h3>
        <p className="text-xs text-gray-500">Ingresos vs Egresos</p>
      </div>
      
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            key={JSON.stringify(dataGrafico)}
            data={dataGrafico} 
            margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
            // Quitamos el onClick global de aquí para evitar falsos clics en el fondo
          >
            <defs>
              <marker id="flecha-derecha" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#9ca3af" />
              </marker>
              <marker id="flecha-izquierda" viewBox="0 0 10 10" refX="0" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 10 1 L 0 5 L 10 9 z" fill="#9ca3af" />
              </marker>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            
            <XAxis 
              dataKey="Fecha" 
              stroke="#374151" 
              fontSize={11} 
              tick={{ fill: '#374151', fontWeight: '500' }}
              tickLine={false} 
              axisLine={{ 
                stroke: '#9ca3af', 
                strokeWidth: 1.5,
                markerEnd: 'url(#flecha-derecha)',   
                markerStart: 'url(#flecha-izquierda)' 
              }}
              type="category" 
            />
            
            <YAxis yAxisId="left" stroke="#4b5563" fontSize={11} tick={{ fill: '#1f2937', fontWeight: '700' }} tickLine={false} axisLine={false} />
            <YAxis yAxisId="right" orientation="right" stroke="#7957b9" fontSize={11} tick={{ fill: '#7957b9', fontWeight: '800' }} tickLine={false} axisLine={false} />
            
            <Tooltip 
              formatter={(value, name) => {
                if (value === undefined || value === null) return ['', ''];
                const valorFormateado = Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                return name === "Flujo Diario" ? [valorFormateado, "Flujo"] : [valorFormateado, "Saldo"];
              }}
              contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '2px solid #1f2937', padding: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              itemStyle={{ color: '#111827', fontWeight: '700', fontSize: '13px' }}
              labelStyle={{ color: '#374151', fontWeight: '800', marginBottom: '6px', fontSize: '12px', textAlign: 'center' }} 
            />

            <Legend 
              wrapperStyle={{ fontSize: '12px', pt: 4 }} 
              iconSize={0}        
              iconType="none"     
              formatter={(value) => (
                <span className="text-gray-700 font-medium" style={{ marginLeft: '6px' }}>🟣 {value}</span>
              )}
            />
            
            {/* MOVIMOS EL onClick AQUÍ: Ahora escucha el evento directamente sobre la barra */}
            <Bar 
              yAxisId="left" 
              name="Flujo Diario" 
              dataKey="Movimientos" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={33}
              className="cursor-pointer"
              legendType="none"
              onClick={handleBarClick} // <--- Vinculación directa y precisa
            >
              {dataGrafico.map((entrada, index) => {
                const colorBarra = entrada.Movimientos < 0 ? '#f43f5e' : '#10b981';
                return <Cell key={`cell-${index}`} fill={colorBarra} />;
              })}
            </Bar>
            
            <Line yAxisId="right" name="Saldo en Cuenta" type="stepAfter" dataKey="Balance" stroke="#7957b9" strokeWidth={3} dot={{ r: 3, stroke: '#7957b9', fill: '#7957b9', strokeWidth: 1 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}