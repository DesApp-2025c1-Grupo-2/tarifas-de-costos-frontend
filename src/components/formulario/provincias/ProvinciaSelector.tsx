import React, { useState } from "react";
import {
  Autocomplete,
  TextField,
  Chip,
  Box,
  Typography,
  IconButton,
  Stack,
  Button,
  Modal,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export type Provincia = {
  id: number;
  nombre: string;
};

type Props = {
  provincias: Provincia[];
  seleccionados: Provincia[];
  onChange: (seleccionados: Provincia[]) => void;
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const ProvinciaSelector: React.FC<Props> = ({
  provincias,
  seleccionados,
  onChange,
}) => {
  const [editingProvincia, setEditingProvincia] = useState<Provincia | null>(
    null
  );

  const handleOpenModal = (provincia: Provincia) => {
    setEditingProvincia(provincia);
  };

  const handleCloseModal = () => {
    setEditingProvincia(null);
  };

  

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
          const updatedValue = newValue.map((ad) => {
            const existing = seleccionados.find((s) => s.id === ad.id);
            return existing ? existing : { ...ad };
          });
          onChange(updatedValue);
        }}
        // --- INICIO DE LA MODIFICACIÓN 1 ---
        // Se corrige el renderizado de los tags para evitar el error de "key" en "spread"
        renderTags={(value: Provincia[], getTagProps) =>
          value.map((option: Provincia, index: number) => {
            const { key, ...chipProps } = getTagProps({ index });
            return (
              <Box
                key={option.id}
                sx={{ display: "flex", alignItems: "center", gap: 1, m: 0.5 }}
              >
                {/* <Chip
                  {...chipProps}
                  label={`${option.nombre} ($${(
                    option.costoEspecifico ?? option.precio
                  ).toFixed(2)})`}
                />
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleOpenModal(option)}
                >
                  Definir Precio
                </Button> */}
              </Box>
            );
          })
        }
        // --- FIN DE LA MODIFICACIÓN 1 ---
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => (
          <TextField {...params} label="Seleccionar provincias" />
        )}
        // --- INICIO DE LA MODIFICACIÓN 2 ---
        // Se añade `renderOption` para asegurar keys únicas en la lista desplegable
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.nombre}
          </li>
        )}
        // --- FIN DE LA MODIFICACIÓN 2 ---
      />

      <Modal open={!!editingProvincia} onClose={handleCloseModal}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Definir Precio para {editingProvincia?.nombre}
          </Typography>
          <TextField
            label="Precio Específico"
            type="number"
            fullWidth
            sx={{ mt: 2 }}
          />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleCloseModal} sx={{ mr: 1 }}>
              Cancelar
            </Button>
            <Button variant="contained">
              Guardar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
