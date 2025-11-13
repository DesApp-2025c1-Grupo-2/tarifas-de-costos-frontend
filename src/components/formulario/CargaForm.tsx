import React, { useState } from "react";
import FormularioDinamico, { Campo } from "./FormularioDinamico";
import { BotonPrimario } from "../Botones";
import * as cargaService from "../../services/cargaService";
import DataTable from "../tablas/tablaDinamica";
import { Carga } from "../../services/cargaService";
import { useCrud } from "../hook/useCrud";
import { CrudService } from "../../services/crudService";
import {
  Box,
  Alert,
  Typography,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DialogoConfirmacion from "../DialogoConfirmacion";
import { getHumanReadableError } from "../../utils/errorUtils";

const camposCarga: Campo[] = [
  { tipo: "text", nombre: "Nombre", clave: "nombre", requerido: true },
  {
    tipo: "text",
    nombre: "Descripción",
    clave: "descripcion",
    requerido: true,
  },
];

const servicioAdaptado: CrudService<Carga> = {
  getAll: cargaService.obtenerCargas,
  create: cargaService.crearCarga,
  update: (id, data) => cargaService.actualizarCarga(id.toString(), data),
  remove: cargaService.eliminarCarga,
};

export const FormCrearCarga: React.FC = () => {
  const {
    items,
    editingItem,
    showForm,
    message,
    highlightedId,
    setMessage,
    fetchItems: loadItems,
    setHighlightedId,
    actions,
  } = useCrud<Carga>(servicioAdaptado);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleFormSubmit = async (formValues: Record<string, any>) => {
    setIsSaving(true);
    const data: Omit<Carga, "id"> = {
      ...(editingItem ?? {}),
      activo: true,
      nombre: formValues.nombre,
      descripcion: formValues.descripcion,
    };

    setMessage(null);

    try {
      let changedItem: Carga;
      if (editingItem) {
        changedItem = await servicioAdaptado.update(editingItem.id, data);
        setMessage({
          text: "Tipo de Carga actualizado con éxito.",
          severity: "success",
        });
      } else {
        changedItem = await servicioAdaptado.create(data);
        setMessage({
          text: "Tipo de Carga creado con éxito.",
          severity: "success",
        });
      }

      actions.handleCancel();
      await loadItems();

      setHighlightedId(changedItem.id);
      setTimeout(() => setHighlightedId(null), 4000);

      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      console.error("Error completo recibido:", err);
      const cleanError = getHumanReadableError(err);
      setMessage({ text: cleanError, severity: "error" });
      setTimeout(() => setMessage(null), 8000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (item: Carga) => {
    setIdToDelete(item.id);
    setConfirmOpen(true);
  };

  const localConfirmDelete = async () => {
    if (idToDelete === null) return;
    setIsSaving(true);
    setMessage(null);
    try {
      await servicioAdaptado.remove(idToDelete);
      setMessage({
        text: "Tipo de Carga dado de baja con éxito.",
        severity: "success",
      });
      await loadItems();
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      const cleanError = getHumanReadableError(err);
      setMessage({ text: cleanError, severity: "error" });
      setTimeout(() => setMessage(null), 8000);
    } finally {
      setConfirmOpen(false);
      setIdToDelete(null);
      setIsSaving(false);
    }
  };

  return (
    <div>
      {!showForm && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            sx={{ mb: 0, fontWeight: "bold" }}
          >
            Gestionar Tipos de Carga
          </Typography>

          <BotonPrimario
            onClick={actions.handleCreateNew}
            startIcon={<AddIcon />}
            disabled={isSaving}
          >
            Nuevo Tipo de Carga
          </BotonPrimario>
        </Box>
      )}

      {/* --- INICIO DE LA MODIFICACIÓN --- */}
      {showForm && (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 4 },
              mb: 3,
              borderRadius: "8px",
              backgroundColor: "white",
              width: "100%",
              maxWidth: "900px", // <-- Ancho máximo
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ mb: 3, fontWeight: "bold" }}
            >
              {editingItem
                ? "Editar Tipo de Carga"
                : "Registrar nuevo Tipo de Carga"}
            </Typography>

            <FormularioDinamico
              campos={camposCarga}
              onSubmit={handleFormSubmit}
              initialValues={editingItem}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  mt: 3,
                }}
              >
                <Button
                  onClick={actions.handleCancel}
                  variant="outlined"
                  disabled={isSaving}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" disabled={isSaving}>
                  {isSaving ? <CircularProgress size={24} /> : "Guardar"}
                </Button>
              </Box>
            </FormularioDinamico>
          </Paper>
        </Box>
      )}
      {/* --- FIN DE LA MODIFICACIÓN --- */}

      {!showForm && (
        <DataTable
          entidad="tipoDeCarga"
          rows={items}
          handleEdit={actions.handleEdit}
          handleDelete={handleDelete}
          highlightedId={highlightedId}
          actionsDisabled={isSaving}
        />
      )}

      <DialogoConfirmacion
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={localConfirmDelete}
        titulo="Confirmar baja"
        descripcion="¿Estás seguro de que deseas dar de baja este tipo de carga?"
        textoConfirmar="Dar de Baja"
      />

      {message && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Alert
            severity={message.severity}
            sx={{ width: "100%", maxWidth: "600px" }}
            onClose={() => setMessage(null)}
          >
            {message.text}
          </Alert>
        </Box>
      )}
    </div>
  );
};
