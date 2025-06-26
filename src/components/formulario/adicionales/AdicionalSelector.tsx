// src/components/formulario/adicionales/AdicionalSelector.tsx

import React from "react";
import {
  Autocomplete,
  TextField,
  Chip,
  Box,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export type Adicional = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
};

type Props = {
  adicionales: Adicional[];
  seleccionados: Adicional[];
  onChange: (seleccionados: Adicional[]) => void;
  onCrearNuevo: () => void;
};

export const AdicionalSelector: React.FC<Props> = ({
  adicionales,
  seleccionados,
  onChange,
  onCrearNuevo,
}) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Adicionales
        </Typography>
        <IconButton
          size="small"
          onClick={onCrearNuevo}
          title="Agregar nuevo adicional"
        >
          <AddIcon />
        </IconButton>
      </Stack>

      <Autocomplete
        multiple
        options={adicionales}
        getOptionLabel={(option) =>
          `${option.nombre} - $${(Number(option.precio) || 0).toFixed(2)}`
        }
        value={seleccionados}
        onChange={(_, newValue) => onChange(newValue)}
        renderTags={(value: Adicional[], getTagProps) =>
          value.map((option: Adicional, index: number) => (
            <Chip
              label={`${option.nombre} ($${(Number(option.precio) || 0).toFixed(
                2
              )})`}
              {...getTagProps({ index })}
              key={option.id}
            />
          ))
        }
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            <Box>
              <Typography variant="body1">{option.nombre}</Typography>
              <Typography variant="body2" color="text.secondary">
                {option.descripcion} — $
                {(Number(option.precio) || 0).toFixed(2)}
              </Typography>
            </Box>
          </li>
        )}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => (
          <TextField {...params} label="Seleccionar adicionales" />
        )}
      />
    </Box>
  );
};
