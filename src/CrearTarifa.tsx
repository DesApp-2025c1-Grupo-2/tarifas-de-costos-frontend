import React from "react";
import { FormCrearTarifa } from "./components/formulario/TarifaForm";
import { Typography } from "@mui/material";

// Se eliminó todo el layout (Box, Sidebar, Button, state, etc.)

const CrearTarifa: React.FC = () => {
  return (
    // Solo se devuelve el contenido que va dentro del <Paper>
    <>
      {/* TÍTULO ELIMINADO DE AQUÍ */}
      <FormCrearTarifa />
    </>
  );
};

export default CrearTarifa;
