import React, { useState } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
// Se eliminaron todas las importaciones de layout (Sidebar, Button, etc.)
import CatalogoAdicionales from "./components/reportes/CatalogoAdicionales";
import ComparativaCostosTransportistas from "./components/reportes/ComparativaCostosTransportistas";
import ComparativaAumentosReporte from "./components/reportes/ComparativaAumentosReporte";
import ReporteHistorialServicios from "./components/reportes/ReporteHistorialServicios";
import ReporteUsoCombustible from "./components/reportes/ReporteUsoCombustible";

// Se eliminó todo el layout (Box, Sidebar, Button, state, etc.)

const Reportes: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    // Solo se devuelve el contenido que va dentro del <Paper>
    <>
      {/* --- INICIO DE LA MODIFICACIÓN --- */}
      <Typography
        variant="h5"
        component="h1"
        gutterBottom
        sx={{ mb: 3, fontWeight: "bold" }} // <-- AÑADIDO fontWeight
      >
        Reportes Generales
      </Typography>
      {/* --- FIN DE LA MODIFICACIÓN --- */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="tabs reportes"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab label="Uso de Combustible" />
          <Tab label="Catálogo de Adicionales" />
          <Tab label="Comparativa por Transportista" />
          <Tab label="Análisis de Aumentos" />
          <Tab label="Historial de Servicios" />
        </Tabs>
      </Box>
      <Box sx={{ mt: 2 }}>
        {tabIndex === 0 && <ReporteUsoCombustible />}
        {tabIndex === 1 && <CatalogoAdicionales />}
        {tabIndex === 2 && <ComparativaCostosTransportistas />}
        {tabIndex === 3 && <ComparativaAumentosReporte />}
        {tabIndex === 4 && <ReporteHistorialServicios />}
      </Box>
    </>
  );
};

export default Reportes;
