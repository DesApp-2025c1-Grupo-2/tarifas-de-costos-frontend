import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { Tarifa } from "../../../services/tarifaService";

export type TarifaDetallada = Tarifa & {
  transportistaNombre?: string;
  tipoVehiculoNombre?: string;
  zonaNombre?: string;
  tipoCargaNombre?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  tarifa: TarifaDetallada | null;
};

export const ModalVerTarifa: React.FC<Props> = ({ open, onClose, tarifa }) => {
  // Si no hay tarifa para mostrar, no renderizamos nada.
  if (!tarifa) {
    return null;
  }

  // Pequeña función para formatear los valores monetarios de forma consistente.
  const formatCurrency = (value: number | undefined) => {
    return `$${(value || 0).toFixed(2)}`;
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Detalles de la Tarifa #{tarifa.id}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {/* Sección de Información Principal */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Información Principal
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary="Transportista"
                secondary={tarifa.transportistaNombre || "N/A"}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Tipo de Vehículo"
                secondary={tarifa.tipoVehiculoNombre || "N/A"}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Zona"
                secondary={tarifa.zonaNombre || "N/A"}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Tipo de Carga"
                secondary={tarifa.tipoCargaNombre || "N/A"}
              />
            </ListItem>
          </List>
        </Box>
        <Divider sx={{ my: 2 }} />

        {/* Sección de Costos */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Costos
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary="Valor Base"
                secondary={formatCurrency(tarifa.valorBase)}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Total"
                secondary={
                  <Typography color="primary" variant="h6">
                    {formatCurrency(tarifa.total)}
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </Box>

        {/* Sección de Adicionales (solo si existen) */}
        {tarifa.adicionales && tarifa.adicionales.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="h6" gutterBottom>
                Adicionales Incluidos
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {tarifa.adicionales.map((item: any) => (
                  <Chip
                    key={item.adicional.id}
                    label={`${item.adicional.nombre}: ${formatCurrency(
                      item.costoEspecifico
                    )}`}
                  />
                ))}
              </Box>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
