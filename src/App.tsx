import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TarifaTable from './components/TarifaTable';
import Filtros from './components/Filtros';
import Boton from './components/BotonNuevaTarifa';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <Header />
      {/* <Sidebar /> */}
      <main className="main">
        <div className="grid">
          <Filtros />     
          <Boton direccion="./crear-tarifa" texto='+ Nueva Tarifa'/>
          <TarifaTable />
        </div>
      </main>
    </div>
  );
};

export default App;