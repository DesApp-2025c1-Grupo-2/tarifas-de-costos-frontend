import React, { useEffect } from 'react';
import Sidebar from './components/Sidebar';
import HeaderConMenu from './components/Header';
import TarifaTable from './components/TarifaTable';
import Filtros from './components/Filtros';
import { BotonNuevaTarifa } from './components/Botones';
import Header from './components/Header';
import './css/App.css';

const App: React.FC = () => {

useEffect(() => {
  const testConnection = async () => {
    try {
      // Usar IP en lugar de localhost para evitar bloqueos
      const response = await fetch('http://127.0.0.1:7070/api/test', {
        cache: 'no-store', // Evitar caché
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest' // Evitar detección como script malicioso
        }
      });

      const rawData = await response.text();
      try {
        const jsonData = JSON.parse(rawData);
        console.log('✅ Conexión exitosa:', jsonData);
      } catch {
        console.log('⚠️ Respuesta no JSON:', rawData);
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error);
    }
  };

  testConnection();
}, []);
  return (
    <div className="app">
      <HeaderConMenu />
      {/* <Sidebar /> */}

      <Header />

      <main className="main">
        <div className="grid" style={{ textAlign: 'center', marginTop: '4em'}}>
          <BotonNuevaTarifa />
        </div>
      </main>
    </div>
  );
};

export default App;