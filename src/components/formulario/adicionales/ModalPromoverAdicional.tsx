import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Typography,
  Box,
  Button, 
  Stack,  
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
  const [adicionalesPersonalizados, setAdicionalesPersonalizados] = useState<Adicional[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      setLoading(true);
      obtenerAdicionales()
        .then((data) => {
          setAdicionalesPersonalizados(data.filter((a) => a.esGlobal && a.activo));
        })
        .catch(() => {
        })
        .finally(() => setLoading(false));
    }
  }, [open]);

  const handleSelect = (adicional: Adicional) => {
    onPromover(adicional);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm"> 
      <DialogTitle>
        Añadir Adicional Personalizado al Catálogo
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
          Seleccione un adicional personalizado para añadirlo al catálogo principal y hacerlo reutilizable.
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {adicionalesPersonalizados.length > 0 ? (
              adicionalesPersonalizados.map((ad) => (
                <ListItem key={ad.id} disablePadding sx={{ borderBottom: '1px solid #eee' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%" paddingY={1}>
                    <ListItemText
                      primary={ad.nombre}
                      secondary={`Costo base: $${ad.costoDefault}`}
                      sx={{ flexGrow: 1 }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleSelect(ad)}
                    >
                      Añadir al Catálogo
                    </Button>
                  </Stack>
                </ListItem>
              ))
            ) : (
              <Alert severity="info">
                No hay adicionales personalizados disponibles para añadir al catálogo.
              </Alert>
            )}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};