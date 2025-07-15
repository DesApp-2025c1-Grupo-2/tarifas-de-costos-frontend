import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack
} from '@mui/material';

export type NuevoAdicional = {
  nombre: string;
  descripcion: string;
  precio: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onCrear: (nuevo: NuevoAdicional) => void;
};

export const ModalCrearAdicional: React.FC<Props> = ({
  open,
  onClose,
  onCrear
}) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState<number>(0);

  const handleSubmit = () => {
    if (nombre.trim() && descripcion.trim() && precio > 0) {
      onCrear({ nombre, descripcion, precio });
      onClose();
      setNombre('');
      setDescripcion('');
      setPrecio(0);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Crear nuevo adicional</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            fullWidth
          />
          <TextField
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            fullWidth
            multiline
            rows={2}
          />
          <TextField
            label="Precio"
            type="number"
            value={precio}
            onChange={(e) => setPrecio(Number(e.target.value))}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
};
