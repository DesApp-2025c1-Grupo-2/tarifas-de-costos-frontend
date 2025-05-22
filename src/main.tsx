import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import CrearTarifa from './CrearTarifa'; 
import Tarifas from './Tarifas';
import CrearTarifa from './CrearTarifa'; // 👈 Importá la nueva página
import './App.css';
import Inicio from './components/Inicio';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/generar-tarifa" element={<CrearTarifa />} />
        <Route path="/" element={<App />} />
        <Route path="/tarifas" element={<Tarifas />} />
        <Route path="/crear-tarifa" element={<CrearTarifa />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);