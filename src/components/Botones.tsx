import React, { ReactNode } from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";

interface BotonConHijosProps extends ButtonProps {
  children: ReactNode;
}

export function BotonPrimario({
  children,
  onClick,
  ...props
}: BotonConHijosProps) {
  const theme = useTheme();
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onClick}
      sx={{
        backgroundColor: theme.palette.primary.main,
        "&:hover": {
          backgroundColor: theme.palette.primary.dark,
        },
        color: theme.palette.primary.contrastText,
        borderRadius: "8px",
        px: 2,
        py: 1,
        ...theme.typography.button,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}

export function BotonSecundario({
  children,
  onClick,
  ...props
}: BotonConHijosProps) {
  const theme = useTheme();
  return (
    <Button
      variant="outlined"
      color="primary"
      onClick={onClick}
      sx={{
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
        "&:hover": {
          borderColor: theme.palette.primary.dark,
          backgroundColor: theme.palette.primary.light,
        },
        borderRadius: "8px",
        px: 2,
        py: 1,
        ...theme.typography.button,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}

export function BotonGuardar() {
  return (
    <Button type="submit" variant="contained">
      Guardar
    </Button>
  );
}

interface AccionBotonProps extends ButtonProps {}

export function BotonEditar({ onClick, ...props }: AccionBotonProps) {
  const theme = useTheme();
  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: theme.palette.secondary.main,
        "&:hover": { backgroundColor: theme.palette.secondary.dark },
        color: theme.palette.secondary.contrastText,
        borderRadius: "4px",
        ...theme.typography.button,
      }}
      onClick={onClick}
      {...props}
    >
      Editar
    </Button>
  );
}

export function BotonEliminar({ onClick, ...props }: AccionBotonProps) {
  const theme = useTheme();
  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: theme.palette.error.main,
        "&:hover": { backgroundColor: theme.palette.error.dark },
        color: theme.palette.error.contrastText,
        borderRadius: "4px",
        ...theme.typography.button,
      }}
      onClick={onClick}
      {...props}
    >
      Eliminar
    </Button>
  );
}

export function BotonVer({ onClick, ...props }: AccionBotonProps) {
  const theme = useTheme();
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onClick}
      sx={{ ...theme.typography.button }}
      {...props}
    >
      Ver
    </Button>
  );
}
