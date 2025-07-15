// src/components/Sidebar.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";

// Anchos ajustados
const DESKTOP_DRAWER_WIDTH = 240;
const MOBILE_DRAWER_WIDTH = 220; // Más angosto para que no ocupe tanto

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <Box
      component="aside"
      sx={{
        position: "fixed",
        top: 0,
        // Ancho y posición 'left' responsivos
        width: { xs: MOBILE_DRAWER_WIDTH, md: DESKTOP_DRAWER_WIDTH },
        left: isOpen
          ? 0
          : {
              xs: `-${MOBILE_DRAWER_WIDTH}px`,
              md: `-${DESKTOP_DRAWER_WIDTH}px`,
            },
        height: "100%",
        backgroundColor: "#1B2A41",
        color: "white",
        padding: "4em 0",
        boxShadow: "2px 0 5px rgba(0,0,0,0.2)",
        transition: "left 0.3s ease-in-out",
        zIndex: 1001, // z-index alto para que esté por encima de todo
        display: "flex",
        flexDirection: "column",
        a: {
          color: "white",
          textDecoration: "none",
          padding: "12px 20px",
          display: "block",
          transition: "background-color 0.3s ease",
          "&:hover": {
            backgroundColor: "#F39237",
          },
        },
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        sx={{ color: "white", paddingLeft: "0.8em", marginBottom: "1.5rem" }}
      >
        Menú Principal
      </Typography>

      <Link to="/reportes">Reportes</Link>
      <Link to="/crear-tarifa">Tarifas</Link>
      <Link to="/crear-adicional">Adicionales</Link>
      <Link to="/crear-transportista">Transportistas</Link>
      <Link to="/crear-vehiculo">Vehiculos</Link>
      <Link to="/crear-zona">Zonas</Link>
      <Link to="/crear-carga">Carga</Link>
    </Box>
  );
};

export default Sidebar;
