
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Button, { ButtonProps } from '@mui/material/Button';
import Box from '@mui/material/Box';


interface GenericBotonProps extends ButtonProps {
    children?: ReactNode;
}


interface BotonPrimarioProps extends ButtonProps {
    children: ReactNode;
}

export function BotonPrimario({ children, onClick, ...props }: BotonPrimarioProps) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
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

export function BotonGuardar() {
    return (
        <Button type="submit" variant="contained">Guardar</Button>
    )
}


interface AccionBotonProps extends ButtonProps {

}

export function BotonEditar({ onClick, ...props }: AccionBotonProps) {
    return (
        <Button 
            variant="contained" 
            sx={{
                backgroundColor: "#FF9800",
                "&:hover": {
                backgroundColor: "#FB8C00",
                },
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
                "&:hover": {
                backgroundColor: "#DD2C00",
                },
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
        <Button variant="contained" color="primary" onClick={onClick} {...props} >
            Ver
        </Button>
    );
}