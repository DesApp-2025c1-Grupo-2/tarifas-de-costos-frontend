import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import CrearTarifa from './CrearTarifa'; // 👈 Importá la nueva página
import './App.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/crear-tarifa" element={<CrearTarifa />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);