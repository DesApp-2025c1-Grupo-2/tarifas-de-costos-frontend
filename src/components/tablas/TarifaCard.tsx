import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Divider,
  IconButton,
  Tooltip,
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
    <Card sx={{ mb: 2 }}>
      <CardHeader
        title={tarifa.transportistaNombre || "N/A"}
        subheader={`$${(tarifa.total || 0).toFixed(2)}`}
      />
      <Divider />
      <CardContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Vehículo: {tarifa.tipoVehiculoNombre || "N/A"}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end", gap: 1 }}>
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
      </CardActions>
    </Card>
  );
};

export default TarifaCard;
