import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import { HeaderConMenu } from "./components/Header";
import { FormCrearCarga } from "./components/formulario/CargaForm";
import { Box } from "@mui/material";

const CrearCarga: React.FC = () => {
  const [sidebarAbierta, setSidebarAbierta] = useState(false);

  const toggleSidebar = () => {
    setSidebarAbierta((prev) => !prev);
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
        <FormCrearCarga />
      </Box>
    </Box>
  );
};

export default CrearCarga;
