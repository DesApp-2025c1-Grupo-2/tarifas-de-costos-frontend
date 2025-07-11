import React, { ReactNode } from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import Box from "@mui/material/Box";

interface BotonPrimarioProps extends ButtonProps {
  children: ReactNode;
}

export function BotonPrimario({
  children,
  onClick,
  ...props
}: BotonPrimarioProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={onClick}
        sx={{
          backgroundColor: "#7CB342",
          "&:hover": {
            backgroundColor: "#689F38",
          },
          color: "#fff",
          borderRadius: "8px",
          px: 2,
          py: 1,
        }}
        {...props}
      >
        {children}
      </Button>
    </Box>
  );
}

// --- ¡NUEVO COMPONENTE! ---
export function BotonSecundario({
  children,
  onClick,
  ...props
}: BotonPrimarioProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
      <Button
        variant="outlined" // Usamos el estilo "outlined" para diferenciarlo
        color="primary"
        onClick={onClick}
        sx={{
          borderColor: "#7CB342",
          color: "#7CB342",
          "&:hover": {
            borderColor: "#689F38",
            backgroundColor: "rgba(104, 159, 56, 0.04)",
          },
          borderRadius: "8px",
          px: 2,
          py: 1,
        }}
        {...props}
      >
        {children}
      </Button>
    </Box>
  );
}
// --- FIN DEL NUEVO COMPONENTE ---

export function BotonGuardar() {
  return (
    <Button type="submit" variant="contained">
      Guardar
    </Button>
  );
}

interface AccionBotonProps extends ButtonProps {}

export function BotonEditar({ onClick, ...props }: AccionBotonProps) {
  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: "#FF9800",
        "&:hover": { backgroundColor: "#FB8C00" },
        color: "#fff",
        borderRadius: "4px",
      }}
      onClick={onClick}
      {...props}
    >
      Editar
    </Button>
  );
}

export function BotonEliminar({ onClick, ...props }: AccionBotonProps) {
  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: "#FF3D00",
        "&:hover": { backgroundColor: "#DD2C00" },
        color: "#fff",
        borderRadius: "4px",
      }}
      onClick={onClick}
      {...props}
    >
      Eliminar
    </Button>
  );
}

export function BotonVer({ onClick, ...props }: AccionBotonProps) {
  return (
    <Button variant="contained" color="primary" onClick={onClick} {...props}>
      Ver
    </Button>
  );
}
