import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { AdicionalForm } from "./components/formulario/adicionales/AdicionalForm";
import { Box, Toolbar } from "@mui/material";

const CrearAdicional: React.FC = () => {
  const [sidebarAbierta, setSidebarAbierta] = useState(false);

  const toggleSidebar = () => {
    setSidebarAbierta((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex", backgroundColor: "#f5f7fa", height: "100vh" }}>
      <Header onMenuClick={toggleSidebar} />
      <Sidebar open={sidebarAbierta} onClose={toggleSidebar} />

      <Box component="main" sx={{ flexGrow: 1, p: "2rem", overflow: "auto" }}>
        <Toolbar />
        <AdicionalForm />
      </Box>
    </Box>
  );
};

export default CrearAdicional;
