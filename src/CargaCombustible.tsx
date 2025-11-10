import React from "react";
import { Typography } from "@mui/material";
import { CombustibleForm } from "./components/formulario/CombustibleForm";

// Se eliminó todo el layout (Box, Sidebar, Button, state, etc.)

const CargaCombustible: React.FC = () => {
  return (
    // Solo se devuelve el contenido que va dentro del <Paper>
    <>
      <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 3 }}>
        Gestionar Cargas de Combustible
      </Typography>
      <CombustibleForm />
    </>
  );
};

export default CargaCombustible;
