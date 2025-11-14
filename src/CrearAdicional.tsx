import React from "react";
import { AdicionalForm } from "./components/formulario/adicionales/AdicionalForm";
import { Typography } from "@mui/material";

// Se eliminó todo el layout (Box, Sidebar, Button, state, etc.)

const CrearAdicional: React.FC = () => {
  return (
    // Solo se devuelve el contenido que va dentro del <Paper>
    <>
      {/* <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 3 }}>
        Gestionar Adicionales
      </Typography> */}
      <AdicionalForm />
    </>
  );
};

export default CrearAdicional;
