import React from 'react';

import Sidebar from './components/Sidebar';
import HeaderConMenu from './components/Header';
import TarifaTable from './components/TarifaTable';
import Filtros from './components/Filtros';
import { BotonNuevaTarifa } from './components/Botones';
import Header from './components/Header';
import './App.css';

const App: React.FC = () => {
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