import React from "react";
import { FormCrearCarga } from "./components/formulario/CargaForm";
import { Typography } from "@mui/material";

// Se eliminó todo el layout (Box, Sidebar, Button, state, etc.)

const CrearCarga: React.FC = () => {
  return (
    // Solo se devuelve el contenido que va dentro del <Paper>
    <>
      <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 3 }}>
        Gestionar Tipos de Carga
      </Typography>
      <FormCrearCarga />
    </>
  );
};

export default CrearCarga;
