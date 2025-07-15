import React from "react";
import FormularioDinamico, { Campo } from "./FormularioDinamico";
import { BotonPrimario } from "../Botones";
import * as cargaService from "../../services/cargaService";
import DataTable from "../tablas/tablaDinamica";
import { Carga } from "../../services/cargaService";
import { useCrud } from "../hook/useCrud";
import { CrudService } from "../../services/crudService";
import { Box, Alert } from "@mui/material";
import DialogoConfirmacion from "../DialogoConfirmacion";

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
    confirmOpen,
    setConfirmOpen,
    confirmDelete,
    highlightedId,
    actions,
  } = useCrud<Carga>(servicioAdaptado);

  const handleFormSubmit = (formValues: Record<string, any>) => {
    const data: Omit<Carga, "id"> = {
      ...(editingItem ? editingItem : { activo: true }),
      nombre: formValues.nombre,
      descripcion: formValues.descripcion,
    };
    actions.handleSubmit(data);
  };

  return (
    <div>
      {!showForm && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <BotonPrimario onClick={actions.handleCreateNew}>
            Crear nuevo Tipo de Carga
          </BotonPrimario>
        </Box>
      )}

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

      <DataTable
        entidad="tipoDeCarga"
        rows={items}
        handleEdit={actions.handleEdit}
        handleDelete={actions.handleDelete}
        highlightedId={highlightedId}
      />

      <DialogoConfirmacion
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        titulo="Confirmar eliminación"
        descripcion="¿Estás seguro de que deseas eliminar este tipo de carga?"
      />

      {message && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Alert
            severity={message.severity}
            sx={{ width: "100%", maxWidth: "600px" }}
          >
            {message.text}
          </Alert>
        </Box>
      )}
    </div>
  );
};
