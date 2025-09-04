import React, { useState } from "react";
import { Tabs, Tab, Box, Typography, Toolbar } from "@mui/material";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header";
import CatalogoAdicionales from "./components/reportes/CatalogoAdicionales";
import ComparativaZonasCostos from "./components/reportes/ComparativaZonasCostos";
import { TransportistasMasUtilizadosReporte } from "./components/reportes/TransportistasMasUtilizadosReporte";
import ComparativaCostosTransportistas from "./components/reportes/ComparativaCostosTransportistas";
import ComparativaAumentosReporte from "./components/reportes/ComparativaAumentosReporte";
import ReporteHistorialServicios from "./components/reportes/ReporteHistorialServicios";

const Reportes: React.FC = () => {
  const [sidebarAbierta, setSidebarAbierta] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const toggleSidebar = () => {
    setSidebarAbierta((prev) => !prev);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ display: "flex", backgroundColor: "#f5f7fa", height: "100vh" }}>
      {/* <Header onMenuClick={toggleSidebar} /> */}
      <Sidebar open={sidebarAbierta} onClose={toggleSidebar} />

      <Box component="main" sx={{ flexGrow: 1, p: "2rem", overflow: "auto" }}>
        <Toolbar />
        <Typography variant="h4" component="h1" gutterBottom>
          Reportes Generales
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            aria-label="tabs reportes"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <Tab label="Comparativa Zonas y Costos" />
            <Tab label="Catálogo de Adicionales" />
            <Tab label="Transportistas Más Utilizados" />
            <Tab label="Comparativa por Transportista" />
            <Tab label="Análisis de Aumentos" />
            <Tab label="Historial de Servicios" />
          </Tabs>
        </Box>

        <Box sx={{ mt: 2 }}>
          {tabIndex === 0 && <ComparativaZonasCostos />}
          {tabIndex === 1 && <CatalogoAdicionales />}
          {tabIndex === 2 && <TransportistasMasUtilizadosReporte />}
          {tabIndex === 3 && <ComparativaCostosTransportistas />}
          {tabIndex === 4 && <ComparativaAumentosReporte />}
          {tabIndex === 5 && <ReporteHistorialServicios />}
        </Box>
      </Box>
    </Box>
  );
};

export default Reportes;
