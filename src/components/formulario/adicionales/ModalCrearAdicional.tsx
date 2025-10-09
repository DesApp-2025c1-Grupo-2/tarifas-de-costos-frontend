import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  FormControlLabel,
  Switch,
} from "@mui/material";

export type NuevoAdicional = {
  nombre: string;
  descripcion: string;
  precio: number;
  esGlobal: boolean; // Se añade el campo para saber si es flotante
};

type Props = {
  open: boolean;
  onClose: () => void;
  onCrear: (nuevo: NuevoAdicional) => void;
};

export const ModalCrearAdicional: React.FC<Props> = ({
  open,
  onClose,
  onCrear,
}) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState<number>(0);
  // --- INICIO DE LA CORRECCIÓN ---
  const [esGlobal, setEsGlobal] = useState(true); // Por defecto es flotante
  // --- FIN DE LA CORRECCIÓN ---

  const handleSubmit = () => {
    if (nombre.trim() && descripcion.trim() && precio > 0) {
      onCrear({ nombre, descripcion, precio, esGlobal }); // Se envía el nuevo valor
      onClose();
      // Limpiar el formulario
      setNombre("");
      setDescripcion("");
      setPrecio(0);
      setEsGlobal(true);
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
          {/* --- INICIO DE LA CORRECCIÓN --- */}
          <FormControlLabel
            control={
              <Switch
                checked={esGlobal}
                onChange={(e) => setEsGlobal(e.target.checked)}
              />
            }
            label="Es Adicional Flotante (Global)"
          />
          {/* --- FIN DE LA CORRECCIÓN --- */}
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
