import React, { useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import Sidebar from "./components/Sidebar";
import { HeaderConMenu } from "./components/Header";
import CatalogoAdicionales from "./components/reportes/CatalogoAdicionales";
import ComparativaZonasCostos from "./components/reportes/ComparativaZonasCostos";
import { FrecuenciaAdicionalesReporte } from "./components/reportes/FrecuenciaAdicionalesReporte";
import { TransportistasMasUtilizadosReporte } from "./components/reportes/TransportistasMasUtilizadosReporte";

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
    <Box sx={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      {sidebarAbierta && (
        <Box
          onClick={toggleSidebar}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          }}
        />
      )}

      <HeaderConMenu onImagenClick={toggleSidebar} />
      <Sidebar isOpen={sidebarAbierta} toggleSidebar={toggleSidebar} />

      <Box component="main" sx={{ padding: "2rem" }}>
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
            <Tab label="Frecuencia de Adicionales" />
            <Tab label="Transportistas Más Utilizados" />
          </Tabs>
        </Box>

        <Box sx={{ mt: 2 }}>
          {tabIndex === 0 && <ComparativaZonasCostos />}
          {tabIndex === 1 && <CatalogoAdicionales />}
          {tabIndex === 2 && <FrecuenciaAdicionalesReporte />}
          {tabIndex === 3 && <TransportistasMasUtilizadosReporte />}
        </Box>
      </Box>
    </Box>
  );
};

export default Reportes;
