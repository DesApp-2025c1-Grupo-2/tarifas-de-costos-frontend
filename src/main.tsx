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
import Reportes from "./Reportes";
import Inicio from "./Inicio";
import CrearAdicional from "./CrearAdicional";

import { customMuiTheme } from "./components/Config/customMuiTheme";

// Tema personalizado con colores corporativos y tipografía
// const customTheme = createTheme({
//   palette: {
//     primary: {
//       main: "#F39237",
//     },
//     secondary: {
//       main: "#1B2A41",
//     },
//   },
//   typography: {
//     fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
//   },
// });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={customMuiTheme}>
      {/* --- AÑADÍ ESTE COMPONENTE --- */}
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/tarifas" element={<CrearTarifa />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/transportistas" element={<CrearTransportista />} />
          <Route path="/vehiculos" element={<CrearVehiculo />} />
          <Route path="/tipos-de-carga" element={<CrearCarga />} />
          <Route path="/zonas" element={<CrearZona />} />
          <Route path="/adicionales" element={<CrearAdicional />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
