import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TarifaTable from './components/TarifaTable';
import Filtros from './components/Filtros';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <Header />
      <Sidebar />
      <main className="main">
        <div className="grid">
        <Filtros />
          <TarifaTable />
        </div>
      </main>
    </div>
  );
};

export default App;