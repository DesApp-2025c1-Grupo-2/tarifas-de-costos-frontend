import React from "react";
import { FormCrearTarifa } from "./components/formulario/TarifaForm";
import { Typography } from "@mui/material";

// Se eliminó todo el layout (Box, Sidebar, Button, state, etc.)

const CrearTarifa: React.FC = () => {
  return (
    // Solo se devuelve el contenido que va dentro del <Paper>
    <>
      <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 3 }}>
        Gestionar Tarifas
      </Typography>
      <FormCrearTarifa />
    </>
  );
};

export default CrearTarifa;
