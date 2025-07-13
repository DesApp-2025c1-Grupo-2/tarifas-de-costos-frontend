import React from 'react';
import { Paper, Box, Typography, Divider, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HistoryIcon from '@mui/icons-material/History'; 

type EntityItem = {
  id: number;
  [key: string]: any; 
};

export interface CardConfig {
  titleField: string;
  subtitleField?: string;
  detailFields: string[];
  fieldLabels: { [key: string]: string };
}

interface EntityCardProps {
  item: EntityItem;
  config: CardConfig;
  onEdit: (item: EntityItem) => void;
  onDelete: (id: number) => void;
  onView?: (item: EntityItem) => void; 
  onHistory?: (id: number) => void; 
}

const EntityCard: React.FC<EntityCardProps> = ({ item, config, onEdit, onDelete, onView, onHistory }) => {
  return (
    <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          {item[config.titleField] || 'N/A'}
        </Typography>
        {config.subtitleField && (
            <Typography variant="h6" color="primary">
                ${(item[config.subtitleField] || 0).toFixed(2)}
            </Typography>
        )}
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ my: 2 }}>
        {config.detailFields.map(field => (
            <Typography key={field} variant="body2" sx={{ mb: 0.5 }}>
                <strong >{config.fieldLabels[field] || field}:</strong> {item[field] || 'N/A'}
            </Typography>
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        {onView && (
            <Tooltip title="Ver">
                <IconButton onClick={() => onView(item)} size="small">
                    <VisibilityIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        )}
        {onHistory && (
            <Tooltip title="Ver Historial">
              <IconButton onClick={() => onHistory(item.id)} size="small">
                <HistoryIcon fontSize="small" />
              </IconButton>
            </Tooltip>
        )}
        <Tooltip title="Editar">
          <IconButton onClick={() => onEdit(item)} size="small">
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar">
          <IconButton onClick={() => onDelete(item.id)} size="small">
            <DeleteIcon color="error" fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
};

export default EntityCard;