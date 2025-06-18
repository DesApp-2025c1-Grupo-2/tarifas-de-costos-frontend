import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Button, { ButtonProps } from '@mui/material/Button';
import Box from '@mui/material/Box';

// Botón primario reutilizable

interface BotonProps extends ButtonProps {
    children: ReactNode;
  }
  
  export function BotonPrimario({ children, onClick, ...props }: BotonProps) {
    return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
      <Button variant="contained" color="primary" onClick={onClick} {...props}>
        {children}
      </Button>
    </Box>
    );
  }

  export function BotonGuardar() {
    return (
        <Button type="submit" variant="contained">Guardar</Button>
    )
  }

  export function BotonEditar({ children, onClick }: BotonProps) {
    return (
      <Button variant="contained" color="secondary" onClick={onClick} >
        Editar
      </Button>
    );
  }

  export function BotonEliminar({ children, onClick }: BotonProps) {
    return (
      <Button variant="contained" color="error" onClick={onClick} >
        Eliminar
      </Button>
    );
  }

