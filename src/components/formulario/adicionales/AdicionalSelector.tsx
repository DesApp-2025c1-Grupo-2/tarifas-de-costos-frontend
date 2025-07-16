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

export type Adicional = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  costoEspecifico?: number;
};

type Props = {
  adicionales: Adicional[];
  seleccionados: Adicional[];
  onChange: (seleccionados: Adicional[]) => void;
  onCrearNuevo: () => void;
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

export const AdicionalSelector: React.FC<Props> = ({
  adicionales,
  seleccionados,
  onChange,
  onCrearNuevo,
}) => {
  const [editingAdicional, setEditingAdicional] = useState<Adicional | null>(
    null
  );
  const [specificPrice, setSpecificPrice] = useState<string>("");

  const handleOpenModal = (adicional: Adicional) => {
    setEditingAdicional(adicional);
    setSpecificPrice(
      (adicional.costoEspecifico ?? adicional.precio).toString()
    );
  };

  const handleCloseModal = () => {
    setEditingAdicional(null);
    setSpecificPrice("");
  };

  const handleSavePrice = () => {
    if (editingAdicional) {
      const updatedAdicionales = seleccionados.map((ad) =>
        ad.id === editingAdicional.id
          ? { ...ad, costoEspecifico: parseFloat(specificPrice) }
          : ad
      );
      onChange(updatedAdicionales);
      handleCloseModal();
    }
  };

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
        getOptionLabel={(option) => option.nombre}
        value={seleccionados}
        onChange={(_, newValue) => {
          const updatedValue = newValue.map((ad) => {
            const existing = seleccionados.find((s) => s.id === ad.id);
            return existing ? existing : { ...ad, costoEspecifico: ad.precio };
          });
          onChange(updatedValue);
        }}
        renderTags={(value: Adicional[], getTagProps) =>
          value.map((option: Adicional, index: number) => {
            const { key, ...chipProps } = getTagProps({ index });
            return (
              <Box
                key={option.id}
                sx={{ display: "flex", alignItems: "center", gap: 1, m: 0.5 }}
              >
                <Chip
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
                </Button>
              </Box>
            );
          })
        }
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => (
          <TextField {...params} label="Seleccionar adicionales" />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.nombre}
          </li>
        )}
      />

      <Modal open={!!editingAdicional} onClose={handleCloseModal}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Definir Precio para {editingAdicional?.nombre}
          </Typography>
          <TextField
            label="Precio"
            type="number"
            fullWidth
            value={specificPrice}
            onChange={(e) => setSpecificPrice(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleCloseModal} sx={{ mr: 1 }}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleSavePrice}>
              Guardar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};