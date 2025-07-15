// ruta: src/components/formulario/adicionales/ModalVerAdicionales.tsx

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Se definen los tipos de datos que el componente espera recibir.
type AdicionalItem = {
  adicional: {
    id: number;
    nombre: string;
  };
  costoEspecifico: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  adicionales: AdicionalItem[];
};

// Se define el componente funcional de React.
export const ModalVerAdicionales: React.FC<Props> = ({
  open,
  onClose,
  adicionales,
}) => {
  // El componente siempre retorna un Dialog. La visibilidad se controla
  // exclusivamente a través de la prop 'open' que viene desde el componente padre.
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        Adicionales de la Tarifa
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Adicional</TableCell>
                <TableCell align="right">Costo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Se realiza un mapeo seguro. Si 'adicionales' es nulo o indefinido, no dará error. */}
              {adicionales?.map((item) => (
                <TableRow key={item.adicional.id}>
                  <TableCell>{item.adicional.id}</TableCell>
                  <TableCell>{item.adicional.nombre}</TableCell>
                  <TableCell align="right">
                    ${(item.costoEspecifico || 0).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
