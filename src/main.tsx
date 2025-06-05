import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import CrearTarifa from './CrearTarifa';
import CrearTransportista from './CrearTransportista';
import CrearZona from './CrearZona';
import Tarifas from './Tarifas';
import './css/app.css';
import Inicio from './Inicio';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/generar-tarifa" element={<CrearTarifa />} />
        {/* <Route path="/" element={<App />} /> */}
        <Route path="/tarifas" element={<Tarifas />} />
        <Route path="/crear-tarifa" element={<CrearTarifa />} />
        <Route path="/crear-transportista" element={<CrearTransportista />} />
        <Route path="/crear-zona" element={<CrearZona />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);