// En: src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

import CrearTarifa from "./CrearTarifa";
import CrearTransportista from "./CrearTransportista";
import CrearVehiculo from "./CrearVehiculo";
import CrearZona from "./CrearZona";
import CrearCarga from "./CrearCarga";
import Tarifas from "./Tarifas";
import Reportes from "./Reportes";
import Inicio from "./Inicio";
import CrearAdicional from "./CrearAdicional";

// Es una buena práctica crear un tema, aunque sea el default.
const theme = createTheme();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      {/* --- AÑADÍ ESTE COMPONENTE --- */}
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/generar-tarifa" element={<CrearTarifa />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/tarifas" element={<Tarifas />} />
          <Route path="/crear-tarifa" element={<CrearTarifa />} />
          <Route path="/crear-transportista" element={<CrearTransportista />} />
          <Route path="/crear-vehiculo" element={<CrearVehiculo />} />
          <Route path="/crear-carga" element={<CrearCarga />} />
          <Route path="/crear-zona" element={<CrearZona />} />
          <Route path="/crear-adicional" element={<CrearAdicional />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
