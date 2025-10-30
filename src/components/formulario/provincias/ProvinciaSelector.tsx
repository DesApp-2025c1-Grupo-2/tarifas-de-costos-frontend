import React from "react";
import {
  Autocomplete,
  TextField,
  Chip,
  Box,
  Typography,
  Stack,
} from "@mui/material";

export type Provincia = {
  id: number;
  nombre: string;
};

type Props = {
  provincias: Provincia[]; // Lista completa de opciones
  seleccionados: Provincia[]; // Array de provincias actualmente seleccionadas
  onChange: (seleccionados: Provincia[]) => void;
};

export const ProvinciaSelector: React.FC<Props> = ({
  provincias,
  seleccionados,
  onChange,
}) => {
  // --- LOGS ELIMINADOS ---

  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Provincias
        </Typography>
      </Stack>

      <Autocomplete
        multiple
        options={provincias}
        getOptionLabel={(option) => option.nombre}
        value={seleccionados}
        onChange={(_, newValue) => {
          onChange(newValue || []);
        }}
        renderTags={(value: Provincia[], getTagProps) =>
          value.map((option: Provincia, index: number) => {
            const { key, ...chipProps } = getTagProps({ index });
            return (
              <Chip key={option.id} label={option.nombre} {...chipProps} /> // Usar ID como key es seguro aquí si los IDs son únicos
            );
          })
        }
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => (
          <TextField {...params} label="Seleccionar provincias" />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.nombre}
          </li>
        )}
        getOptionKey={(option) => option.id}
      />
    </Box>
  );
};
