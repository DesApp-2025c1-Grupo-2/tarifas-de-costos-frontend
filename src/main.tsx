import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";

import CrearTarifa from "./CrearTarifa";
import CargaCombustible from "./CargaCombustible";
import CrearZona from "./CrearZona";
import CrearCarga from "./CrearCarga";
import Reportes from "./Reportes";
import CrearAdicional from "./CrearAdicional";

import { customMuiTheme } from "./components/Config/customMuiTheme";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={customMuiTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/tarifas" />} />
          <Route path="/tarifas" element={<CrearTarifa />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/combustible" element={<CargaCombustible />} />{" "}
          <Route path="/tipos-de-carga" element={<CrearCarga />} />
          <Route path="/zonas" element={<CrearZona />} />
          <Route path="/adicionales" element={<CrearAdicional />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
