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
      <DialogTitle sx={{ textAlign: "center" }}>{titulo}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ textAlign: "center" }}>
          {descripcion}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button onClick={onClose}>{textoCancelar}</Button>
        <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
          {textoConfirmar}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogoConfirmacion;
