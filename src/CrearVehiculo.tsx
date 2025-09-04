import React, { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header";
import { FormCrearTipoVehiculo } from "./components/formulario/TipoVehiculoForm";
import { Box, Toolbar } from "@mui/material";

const CrearVehiculo: React.FC = () => {
  const [sidebarAbierta, setSidebarAbierta] = useState(false);

  const toggleSidebar = () => {
    setSidebarAbierta((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex", backgroundColor: "#f5f7fa", height: "100vh" }}>
      {/* <Header onMenuClick={toggleSidebar} /> */}
      <Sidebar open={sidebarAbierta} onClose={toggleSidebar} />

      <Box component="main" sx={{ flexGrow: 1, p: "2rem", overflow: "auto" }}>
        <Toolbar />
        <FormCrearTipoVehiculo />
      </Box>
    </Box>
  );
};

export default CrearVehiculo;
