// src/components/tablas/TarifaCard.tsx

import React from "react";
import {
  Paper,
  Box,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

// Usamos el tipo Tarifa que ya tenés definido
import { Tarifa } from "../../services/tarifaService";

interface TarifaCardProps {
  tarifa: Tarifa;
  onEdit: (tarifa: Tarifa) => void;
  onDelete: (id: number) => void;
  onView: (tarifa: Tarifa) => void;
}

const TarifaCard: React.FC<TarifaCardProps> = ({
  tarifa,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          {tarifa.transportistaNombre || "N/A"}
        </Typography>
        <Typography variant="h6" color="primary">
          ${(tarifa.total || 0).toFixed(2)}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Vehículo: {tarifa.tipoVehiculoNombre || "N/A"}
      </Typography>

      <Divider sx={{ mb: 1 }} />

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Tooltip title="Ver">
          <IconButton onClick={() => onView(tarifa)} size="small">
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Editar">
          <IconButton onClick={() => onEdit(tarifa)} size="small">
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar">
          <IconButton onClick={() => onDelete(tarifa.id)} size="small">
            <DeleteIcon color="error" fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
};

export default TarifaCard;
