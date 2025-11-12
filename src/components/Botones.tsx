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
        textTransform: "none",
        "&:hover": {
          backgroundColor: "#C94715",
          boxShadow: "none",
        },
        boxShadow: "none",
        borderRadius: "8px",
        padding: "8px 16px",
      }}
      className="w-full sm:max-w-max"
      {...props}
    >
      {children}
    </Button>
  );
}

export function BotonGuardar() {
  return (
    <Button
      type="submit"
      variant="contained"
      sx={{ mt: 3, alignSelf: "center", minWidth: "120px" }}
    >
      Guardar
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

/**
 * Botón para "Ver Detalles" con los estilos de la paleta actionButtons.details
 */
export function BotonDetalles({
  children,
  onClick,
  ...props
}: BotonConHijosProps) {
  const theme = useTheme();
  const styles = (theme.palette as any).actionButtons.details;

  return (
    <Button
      variant="outlined"
      size="small"
      onClick={onClick}
      sx={{
        backgroundColor: styles.background,
        borderColor: styles.border,
        color: styles.text,
        "&:hover": {
          backgroundColor: "#e0e0e0",
          borderColor: "#bdbdbd",
        },
      }}
      {...props}
    >
      {children}
    </Button>
  );
}

/**
 * Botón para "Editar" con los estilos de la paleta actionButtons.edit
 */
export function BotonEditar({
  children,
  onClick,
  ...props
}: BotonConHijosProps) {
  const theme = useTheme();
  const styles = (theme.palette as any).actionButtons.edit;

  return (
    <Button
      variant="outlined"
      size="small"
      onClick={onClick}
      sx={{
        backgroundColor: styles.background,
        borderColor: styles.border,
        color: styles.text,
        "&:hover": {
          backgroundColor: "#c7dcfc",
        },
      }}
      {...props}
    >
      {children}
    </Button>
  );
}

/**
 * Botón para "Eliminar" con los estilos de la paleta actionButtons.delete
 */
export function BotonEliminar({
  children,
  onClick,
  ...props
}: BotonConHijosProps) {
  const theme = useTheme();
  const styles = (theme.palette as any).actionButtons.delete;

  return (
    <Button
      variant="outlined"
      size="small"
      onClick={onClick}
      sx={{
        backgroundColor: styles.background,
        borderColor: styles.border,
        color: styles.text,
        "&:hover": {
          backgroundColor: "rgba(255, 53, 53, 0.4)",
        },
      }}
      {...props}
    >
      {children}
    </Button>
  );
}