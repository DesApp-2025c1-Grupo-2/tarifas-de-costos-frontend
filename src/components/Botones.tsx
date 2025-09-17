
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
                padding: "8px 16px"
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
    <Button type="submit" variant="contained">
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