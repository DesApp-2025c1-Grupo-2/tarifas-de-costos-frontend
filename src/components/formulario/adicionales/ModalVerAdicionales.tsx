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


export const ModalVerAdicionales: React.FC<Props> = ({
  open,
  onClose,
  adicionales,
}) => {
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
