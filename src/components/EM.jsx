import React from 'react';
import { Link } from 'react-router-dom';

export default function EM() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-950 mb-4">Unidad: EM</h1>
        <p className="text-gray-600 mb-6">Panel de control, mapas y analíticas correspondientes a la unidad EM.</p>
        
        <Link 
          to="/" 
          className="inline-block bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
        >
          ← Volver al Panel
        </Link>
      </div>
    </div>
  );
}