import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TarifaTable from './components/TarifaTable';
import Filtros from './components/Filtros';
import { BotonNuevaTarifa } from './components/Botones';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <Header />
      {/* <Sidebar /> */}
      <main className="main">
        <div className="grid">
          <Filtros />     
          <BotonNuevaTarifa />
          <TarifaTable />
        </div>
      </main>
    </div>
  );
};

//hola

export default App;