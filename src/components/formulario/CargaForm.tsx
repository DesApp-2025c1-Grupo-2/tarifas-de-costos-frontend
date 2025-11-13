import React, { useState } from "react"; // <-- Se añade useState
import FormularioDinamico, { Campo } from "./FormularioDinamico";
import { BotonPrimario } from "../Botones";
import * as cargaService from "../../services/cargaService";
import DataTable from "../tablas/tablaDinamica";
import { Carga } from "../../services/cargaService";
import { useCrud } from "../hook/useCrud";
import { CrudService } from "../../services/crudService";
import { Box, Alert, Typography } from "@mui/material"; // <-- AÑADIR TYPOGRAPHY
import AddIcon from "@mui/icons-material/Add"; // <-- Importar AddIcon
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
  // --- INICIO CORRECCIÓN 1: Dejar de usar confirmDelete y confirmOpen del hook ---
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
  // --- FIN CORRECCIÓN 1 ---

  // --- INICIO CORRECCIÓN 2: Añadir estado local para el diálogo de confirmación ---
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | string | null>(null);
  // --- FIN CORRECCIÓN 2 ---

  const handleFormSubmit = async (formValues: Record<string, any>) => {
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

      // Timeout para el mensaje de éxito
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      console.error("Error completo recibido:", err);
      const cleanError = getHumanReadableError(err);
      setMessage({ text: cleanError, severity: "error" });
      // Timeout para el mensaje de error
      setTimeout(() => setMessage(null), 8000);
    }
  };

  // --- INICIO CORRECCIÓN 3: Crear funciones locales de borrado ---
  const handleDelete = (item: Carga) => {
    setIdToDelete(item.id);
    setConfirmOpen(true);
  };

  const localConfirmDelete = async () => {
    if (idToDelete === null) return;
    setMessage(null); // Limpiar mensajes anteriores
    try {
      await servicioAdaptado.remove(idToDelete);
      // Mensaje personalizado
      setMessage({
        text: "Tipo de Carga dado de baja con éxito.",
        severity: "success",
      });
      await loadItems();
      // Timeout para el mensaje de éxito
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      const cleanError = getHumanReadableError(err);
      setMessage({ text: cleanError, severity: "error" });
      // Timeout para el mensaje de error
      setTimeout(() => setMessage(null), 8000);
    } finally {
      setConfirmOpen(false);
      setIdToDelete(null);
    }
  };
  // --- FIN CORRECCIÓN 3 ---

  return (
    <div>
      {/* --- INICIO DE LA MODIFICACIÓN --- */}
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
            sx={{ mb: 0, fontWeight: "bold" }} // <-- AÑADIDO fontWeight
          >
            Gestionar Tipos de Carga
          </Typography>

          <BotonPrimario
            onClick={actions.handleCreateNew}
            startIcon={<AddIcon />}
          >
            Nuevo Tipo de Carga
          </BotonPrimario>
        </Box>
      )}
      {/* --- FIN DE LA MODIFICACIÓN --- */}

      {showForm && (
        <FormularioDinamico
          titulo={
            editingItem
              ? "Editar Tipo de Carga"
              : "Registrar nuevo Tipo de Carga"
          }
          campos={camposCarga}
          onSubmit={handleFormSubmit}
          initialValues={editingItem}
          modal
          open={showForm}
          onClose={actions.handleCancel}
        />
      )}

      {/* --- INICIO CORRECCIÓN 4: Usar las funciones locales --- */}
      <DataTable
        entidad="tipoDeCarga"
        rows={items}
        handleEdit={actions.handleEdit}
        handleDelete={handleDelete} // <-- Usar función local
        highlightedId={highlightedId}
      />

      <DialogoConfirmacion
        open={confirmOpen} // <-- Usar estado local
        onClose={() => setConfirmOpen(false)} // <-- Usar estado local
        onConfirm={localConfirmDelete} // <-- Usar función local
        titulo="Confirmar baja"
        descripcion="¿Estás seguro de que deseas dar de baja este tipo de carga?"
        textoConfirmar="Dar de Baja" // <-- Texto del botón
      />
      {/* --- FIN CORRECCIÓN 4 --- */}

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
