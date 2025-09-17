import React, { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import { FormCrearTransportista } from "./components/formulario/TransportistaForm";
import { Box, Toolbar, Paper, Typography } from "@mui/material";

const CrearTransportista: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar isVisible={sidebarVisible} setIsVisible={setSidebarVisible} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: "auto" }}>
        <Toolbar />
        <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 3 }}>
            Gestionar Transportistas
          </Typography>
          <FormCrearTransportista />
        </Paper>
      </Box>
    </Box>
  );
};

export default CrearTransportista;