import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Alert,
  Typography,
  Button,
  CircularProgress,
  DialogActions, // <-- Importado
} from "@mui/material";
import FormularioDinamico, { Campo } from "../FormularioDinamico";
import { BotonPrimario, BotonSecundario } from "../../Botones";
import * as adicionalService from "../../../services/adicionalService";
import * as reporteService from "../../../services/reporteService";
import DataTable from "../../tablas/tablaDinamica";
import { Adicional } from "../../../services/adicionalService";
import { ModalPromoverAdicional } from "./ModalPromoverAdicional";
import DialogoConfirmacion from "../../DialogoConfirmacion";
import AddIcon from "@mui/icons-material/Add";
import { MessageState, useCrud } from "../../hook/useCrud";
import { CrudService } from "../../../services/crudService";
import { getHumanReadableError } from "../../../utils/errorUtils";

const camposAdicional: Campo[] = [
  {
    tipo: "text",
    nombre: "Nombre del Adicional",
    clave: "nombre",
    requerido: true,
  },
  {
    tipo: "text",
    nombre: "Descripción",
    clave: "descripcion",
    requerido: true,
  },
  {
    tipo: "costoBase",
    nombre: "Costo del Adicional",
    clave: "costoDefault",
    requerido: true,
  },
  {
    tipo: "switch",
    nombre: "Es Adicional Flotante (Global)",
    clave: "esGlobal",
  },
];

const servicioAdaptado: CrudService<Adicional> = {
  getAll: adicionalService.obtenerAdicionales,
  create: adicionalService.crearAdicional,
  update: (id, data) => adicionalService.actualizarAdicional(id, data),
  remove: adicionalService.eliminarAdicional, // Usa baja lógica
};

type AdicionalConFrecuencia = Adicional & { cantidad: number };

export const AdicionalForm: React.FC = () => {
  const {
    editingItem,
    showForm,
    message,
    highlightedId,
    setMessage,
    setHighlightedId,
    actions,
  } = useCrud<Adicional>(servicioAdaptado);

  const [items, setItems] = useState<AdicionalConFrecuencia[]>([]);
  const [modalPromoverAbierto, setModalPromoverAbierto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | string | null>(null);

  const loadItems = useCallback(async () => {
    try {
      const [adicionales, frecuenciaData] = await Promise.all([
        adicionalService.obtenerAdicionales(),
        reporteService.getFrecuenciaAdicionales().catch(() => []),
      ]);

      const frecuencia = Array.isArray(frecuenciaData) ? frecuenciaData : [];
      const frecuenciaMap = new Map(
        frecuencia.map((f) => [f.nombreAdicional, f.cantidad])
      );

      const combinados = adicionales.map((a: Adicional) => ({
        ...a,
        cantidad: frecuenciaMap.get(a.nombre) ?? 0,
      }));

      setItems(combinados);
    } catch (error) {
      console.error("Error al cargar los adicionales con frecuencia:", error);
      if (items.length === 0) {
        setMessage({
          text: "Error al cargar los datos.",
          severity: "error",
        });
      }
    }
  }, [setMessage, items.length]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleDelete = (item: Adicional) => {
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
        text: "Adicional dado de baja con éxito.",
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

  const handleFormSubmit = async (formValues: Record<string, any>) => {
    setIsSaving(true);
    setMessage(null);
    const esActivo = editingItem ? editingItem.activo : true;
    const data: Omit<Adicional, "id"> = {
      nombre: formValues.nombre,
      descripcion: formValues.descripcion,
      costoDefault: Number(formValues.costoDefault),
      esGlobal: formValues.esGlobal === true,
      activo: esActivo,
    };

    try {
      let changedItem: Adicional;
      if (editingItem) {
        changedItem = await servicioAdaptado.update(editingItem.id, data);
        setMessage({
          text: "Adicional actualizado con éxito.",
          severity: "success",
        });
      } else {
        changedItem = await servicioAdaptado.create(data);
        setMessage({
          text: "Adicional creado con éxito.",
          severity: "success",
        });
      }

      actions.handleCancel();
      await loadItems();

      setHighlightedId(changedItem.id);
      setTimeout(() => setHighlightedId(null), 4000);

      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      console.error("Error en handleFormSubmit:", err);
      const cleanError = getHumanReadableError(err);
      setMessage({ text: cleanError, severity: "error" });
      setTimeout(() => setMessage(null), 8000);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePromoverSubmit = async (adicional: Adicional) => {
    setIsSaving(true);
    setMessage(null);
    try {
      const { id, ...rest } = adicional;
      const payload: Omit<Adicional, "id"> = {
        ...rest,
        esGlobal: false,
        activo: true,
      };

      await adicionalService.actualizarAdicional(id, payload);
      setMessage({
        text: "Adicional promovido con éxito.",
        severity: "success",
      });
      await loadItems();
    } catch (error: any) {
      console.error("Error al promover adicional:", error);
      const errorMsg = getHumanReadableError(error);
      setMessage({ text: errorMsg, severity: "error" });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const adicionalesConstantes = items.filter(
    (item) => !item.esGlobal && item.activo
  );

  return (
    <div>
      {/* --- INICIO DE LA MODIFICACIÓN: TÍTULO Y BOTONES --- */}
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
          Gestionar Adicionales
        </Typography>

        {/* Los botones desaparecen si el modal está abierto */}
        {!showForm && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <BotonSecundario
              onClick={() => setModalPromoverAbierto(true)}
              disabled={isSaving}
            >
              Promover Flotante
            </BotonSecundario>
            <BotonPrimario
              onClick={actions.handleCreateNew}
              disabled={isSaving}
              startIcon={<AddIcon />}
            >
              Crear Adicional
            </BotonPrimario>
          </Box>
        )}
      </Box>
      {/* --- FIN DE LA MODIFICACIÓN --- */}

      {/* --- INICIO DE LA MODIFICACIÓN: FORMULARIO MODAL --- */}
      <FormularioDinamico
        titulo={editingItem ? "Editar Adicional" : "Registrar Nuevo Adicional"}
        campos={camposAdicional}
        onSubmit={handleFormSubmit}
        initialValues={editingItem}
        // Props de Modal
        modal={true}
        open={showForm}
        onClose={actions.handleCancel}
      >
        {/* Botones pasados como children */}
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={actions.handleCancel}
            variant="outlined"
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="formulario-dinamico"
            variant="contained"
            disabled={isSaving}
          >
            {isSaving ? <CircularProgress size={24} /> : "Guardar"}
          </Button>
        </DialogActions>
      </FormularioDinamico>
      {/* --- FIN DE LA MODIFICACIÓN --- */}

      <ModalPromoverAdicional
        open={modalPromoverAbierto}
        onClose={() => setModalPromoverAbierto(false)}
        onPromover={handlePromoverSubmit}
      />

      {/* --- INICIO DE LA MODIFICACIÓN: TABLA SIEMPRE VISIBLE --- */}
      <DataTable
        entidad="adicional"
        rows={adicionalesConstantes}
        handleEdit={actions.handleEdit}
        handleDelete={handleDelete}
        highlightedId={highlightedId}
        actionsDisabled={isSaving}
      />
      {/* --- FIN DE LA MODIFICACIÓN --- */}

      <DialogoConfirmacion
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={localConfirmDelete}
        titulo="Confirmar baja de adicional"
        descripcion="¿Estás seguro de que deseas dar de baja este adicional?"
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
