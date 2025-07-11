import React from "react";
import FormularioDinamico, { Campo } from "./FormularioDinamico";
import { BotonPrimario } from "../Botones";
import * as tipoVehiculoService from "../../services/tipoVehiculoService";
import DataTable from "../tablas/tablaDinamica";
import { TipoVehiculo } from "../../services/tipoVehiculoService";
import { useCrud } from "../hook/useCrud";
import { CrudService } from "../../services/crudService";
import { Box, Alert } from "@mui/material";
import DialogoConfirmacion from "../DialogoConfirmacion";

const camposTipoVehiculo: Campo[] = [
  { tipo: "text", nombre: "Tipo", clave: "nombre", requerido: true },
  {
    tipo: "text",
    nombre: "Peso Máximo (KG)",
    clave: "capacidadPesoKG",
    requerido: true,
  },
  {
    tipo: "text",
    nombre: "Volumen Máximo (M³)",
    clave: "capacidadVolumenM3",
    requerido: true,
  },
  {
    tipo: "text",
    nombre: "Descripción",
    clave: "descripcion",
    requerido: true,
  },
];

const servicioAdaptado: CrudService<TipoVehiculo> = {
  getAll: tipoVehiculoService.obtenerTiposVehiculo,
  create: tipoVehiculoService.crearTipoVehiculo,
  update: (id, data) =>
    tipoVehiculoService.actualizarTipoVehiculo(id.toString(), data),
  remove: (id) => tipoVehiculoService.eliminarTipoVehiculo(id.toString()),
};

export const FormCrearTipoVehiculo: React.FC = () => {
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
  } = useCrud<TipoVehiculo>(servicioAdaptado);

  const handleFormSubmit = (formValues: Record<string, any>) => {
    const data: Omit<TipoVehiculo, "id"> = {
      ...(editingItem ? editingItem : { activo: true }),
      nombre: formValues.nombre,
      capacidadPesoKG: parseFloat(formValues.capacidadPesoKG),
      capacidadVolumenM3: parseFloat(formValues.capacidadVolumenM3),
      descripcion: formValues.descripcion,
    };
    actions.handleSubmit(data);
  };

  return (
    <div>
      {!showForm && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <BotonPrimario onClick={actions.handleCreateNew}>
            Crear nuevo tipo de vehiculo
          </BotonPrimario>
        </Box>
      )}

      {showForm && (
        <FormularioDinamico
          titulo={
            editingItem
              ? "Editar Tipo de Vehículo"
              : "Registrar nuevo Tipo de Vehículo"
          }
          campos={camposTipoVehiculo}
          onSubmit={handleFormSubmit}
          initialValues={editingItem}
          modal
          open={showForm}
          onClose={actions.handleCancel}
        />
      )}

      <DataTable
        entidad="tipoDeVehiculo"
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
        descripcion="¿Estás seguro de que deseas eliminar este tipo de vehículo?"
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
