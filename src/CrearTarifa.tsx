import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import { HeaderConMenu } from "./components/Header";
import { FormCrearTarifa } from "./components/formulario/TarifaForm";
import { Box } from "@mui/material";

const CrearTarifa: React.FC = () => {
  const [sidebarAbierta, setSidebarAbierta] = useState(false);

  const toggleSidebar = () => {
    setSidebarAbierta((prev) => !prev);
  };

  return (
    <Box sx={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      {/* Este 'Backdrop' es la capa oscura que aparece detrás del menú */}
      {/* y permite cerrarlo al hacer clic. */}
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
            zIndex: 1000, // Debe estar debajo del sidebar pero sobre el contenido
          }}
        />
      )}

      <HeaderConMenu onImagenClick={toggleSidebar} />
      <Sidebar isOpen={sidebarAbierta} toggleSidebar={toggleSidebar} />

      {/* El contenido principal ya NO tiene 'marginLeft' y no se moverá */}
      <Box component="main" sx={{ padding: "2rem" }}>
        <FormCrearTarifa />
      </Box>
    </Box>
  );
};

export default CrearTarifa;
