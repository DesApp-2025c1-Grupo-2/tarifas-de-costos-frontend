import React from 'react';
import Header from './components/Header';
import TarifaTable from './components/TarifaTable';
import Filtros from './components/Filtros';
import { BotonNuevaTarifa} from './components/Botones';
import './css/App.css';

const Tarifas: React.FC = () => {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <div className="grid" >
          <Filtros />     
          <BotonNuevaTarifa />
          <TarifaTable />
        </div>
      </main>
    </div>
  );
};

//holaa

export default Tarifas;