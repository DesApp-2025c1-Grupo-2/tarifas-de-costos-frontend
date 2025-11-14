import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";

// 1. Importar el Layout General
import AppLayout from "./AppLayout";

// 2. Importar las páginas
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
          {/* Redirección principal */}
          <Route path="/" element={<Navigate to="/tarifas" />} />

          {/* 3. Envolver cada página con el AppLayout */}
          <Route
            path="/tarifas"
            element={
              <AppLayout>
                <CrearTarifa />
              </AppLayout>
            }
          />
          <Route
            path="/reportes"
            element={
              <AppLayout>
                <Reportes />
              </AppLayout>
            }
          />
          <Route
            path="/combustible"
            element={
              <AppLayout>
                <CargaCombustible />
              </AppLayout>
            }
          />
          <Route
            path="/tipos-de-carga"
            element={
              <AppLayout>
                <CrearCarga />
              </AppLayout>
            }
          />
          <Route
            path="/zonas"
            element={
              <AppLayout>
                <CrearZona />
              </AppLayout>
            }
          />
          <Route
            path="/adicionales"
            element={
              <AppLayout>
                <CrearAdicional />
              </AppLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
