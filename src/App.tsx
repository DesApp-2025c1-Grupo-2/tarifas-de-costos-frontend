import React from 'react';
import Header from './components/Header';
import { BotonNuevaTarifa, BotonTarifas} from './components/Botones';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <div className="grid" style={{ textAlign: 'center', marginTop: '4em'}}>
        <BotonTarifas />
        </div>
      </main>
    </div>
  );
};

export default App;