import React from "react";
import { FormCrearZona } from "./components/formulario/ZonaForm";
import { Typography } from "@mui/material";

// Se eliminó todo el layout (Box, Sidebar, Button, state, etc.)

const CrearZona: React.FC = () => {
  return (
    // Solo se devuelve el contenido que va dentro del <Paper>
    <>
      <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 3 }}>
        Gestionar Zonas
      </Typography>
      <FormCrearZona />
    </>
  );
};

export default CrearZona;
