import React, { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header";
import { FormCrearZona } from "./components/formulario/ZonaForm";
import { Box, Toolbar } from "@mui/material";

const CrearZona: React.FC = () => {
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
        <FormCrearZona />
      </Box>
    </Box>
  );
};

export default CrearZona;
