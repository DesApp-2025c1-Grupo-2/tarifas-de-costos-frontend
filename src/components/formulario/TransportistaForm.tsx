import React from "react";
import FormularioDinamico, { Campo } from "./FormularioDinamico";
import { BotonPrimario } from "../Botones";
import * as transportistaService from "../../services/transportistaService";
import DataTable from "../tablas/tablaDinamica";
import { Transportista } from "../../services/transportistaService";
import { useCrud } from "../hook/useCrud";
import { CrudService } from "../../services/crudService";
import { Box, Alert } from "@mui/material";
import DialogoConfirmacion from "../DialogoConfirmacion";

const camposTransportista: Campo[] = [
  {
    tipo: "text",
    nombre: "CUIT",
    clave: "cuit",
    requerido: true,
  },
  {
    tipo: "text",
    nombre: "Nombre de Contacto",
    clave: "contactoNombre",
    requerido: true,
  },
  { tipo: "text", nombre: "Empresa", clave: "nombreEmpresa", requerido: true },
  { tipo: "email", nombre: "Correo", clave: "contactoEmail", requerido: true },
  {
    tipo: "tel",
    nombre: "Teléfono",
    clave: "contactoTelefono",
    requerido: true,
  },
];

const servicioAdaptado: CrudService<Transportista> = {
  getAll: transportistaService.obtenerTransportistas,
  create: transportistaService.crearTransportista,
  update: transportistaService.actualizarTransportista,
  remove: transportistaService.eliminarTransportista,
};

export const FormCrearTransportista: React.FC = () => {
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
  } = useCrud<Transportista>(servicioAdaptado);

  const handleFormSubmit = (formValues: Record<string, any>) => {
    const data: Omit<Transportista, "id"> = {
      ...(editingItem ?? {}),
      activo: true,
      cuit: formValues.cuit,
      contactoNombre: formValues.contactoNombre,
      nombreEmpresa: formValues.nombreEmpresa,
      contactoEmail: formValues.contactoEmail,
      contactoTelefono: formValues.contactoTelefono,
    };
    actions.handleSubmit(data);
  };

  return (
    <div>
      {!showForm && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <BotonPrimario onClick={actions.handleCreateNew}>
            Crear nuevo transportista
          </BotonPrimario>
        </Box>
      )}

      {showForm && (
        <FormularioDinamico
          titulo={
            editingItem
              ? "Editar Transportista"
              : "Registrar nuevo transportista"
          }
          campos={camposTransportista}
          onSubmit={handleFormSubmit}
          initialValues={editingItem}
          modal
          open={showForm}
          onClose={actions.handleCancel}
        />
      )}

      <DataTable
        entidad="transportista"
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
        descripcion="¿Estás seguro de que deseas eliminar este transportista?"
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
