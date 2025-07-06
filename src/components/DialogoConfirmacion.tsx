import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

interface DialogoConfirmacionProps {
  open: boolean;
  titulo?: string;
  descripcion?: string;
  onClose: () => void;
  onConfirm: () => void;
  textoCancelar?: string;
  textoConfirmar?: string;
}

const DialogoConfirmacion: React.FC<DialogoConfirmacionProps> = ({
  open,
  titulo = "¿Estás seguro?",
  descripcion = "Esta acción no se puede deshacer.",
  onClose,
  onConfirm,
  textoCancelar = "Cancelar",
  textoConfirmar = "Eliminar",
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{titulo}</DialogTitle>
      <DialogContent>
        <DialogContentText>{descripcion}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{textoCancelar}</Button>
        <Button onClick={onConfirm} color="error" autoFocus>
          {textoConfirmar}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogoConfirmacion;
