import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Alert,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Adicional,
  obtenerAdicionales,
} from "../../../services/adicionalService";

interface Props {
  open: boolean;
  onClose: () => void;
  onPromover: (adicional: Adicional) => void;
}

export const ModalPromoverAdicional: React.FC<Props> = ({
  open,
  onClose,
  onPromover,
}) => {
  const [flotantes, setFlotantes] = useState<Adicional[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      setLoading(true);
      obtenerAdicionales()
        .then((data) => {
          // Filtramos para obtener solo los adicionales que son flotantes (globales)
          setFlotantes(data.filter((a) => a.esGlobal && a.activo));
        })
        .catch(() => {
          /* Manejar error si es necesario */
        })
        .finally(() => setLoading(false));
    }
  }, [open]);

  const handleSelect = (adicional: Adicional) => {
    onPromover(adicional);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        Promover Adicional Flotante
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Seleccione un adicional para convertirlo en "constante" y poder
          gestionarlo en la tabla principal.
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {flotantes.length > 0 ? (
              flotantes.map((ad) => (
                <ListItem key={ad.id} disablePadding>
                  <ListItemButton onClick={() => handleSelect(ad)}>
                    <ListItemText
                      primary={ad.nombre}
                      secondary={`Costo base: $${ad.costoDefault}`}
                    />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <Alert severity="info">
                No hay adicionales flotantes disponibles para promover.
              </Alert>
            )}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};
