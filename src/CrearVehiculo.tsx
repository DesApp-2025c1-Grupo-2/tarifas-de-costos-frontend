import React, { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import { FormCrearTipoVehiculo } from "./components/formulario/TipoVehiculoForm";
import { Box, Toolbar, Paper, Typography } from "@mui/material";

const CrearVehiculo: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar isVisible={sidebarVisible} setIsVisible={setSidebarVisible} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: "auto" }}>
        <Toolbar />
        <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 3 }}>
            Gestionar Tipos de Vehículo
          </Typography>
          <FormCrearTipoVehiculo />
        </Paper>
      </Box>
    </Box>
  );
};

export default CrearVehiculo;