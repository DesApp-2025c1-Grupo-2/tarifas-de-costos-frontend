import React from "react";
import FormularioDinamico, { Campo } from "./FormularioDinamico";
import { BotonPrimario } from "../Botones";
import * as tipoVehiculoService from "../../services/tipoVehiculoService";
import DataTable from "../tablas/tablaDinamica";
import { TipoVehiculo } from "../../services/tipoVehiculoService";
import { useCrud } from "../hook/useCrud";
import { CrudService } from "../../services/crudService";

// Definición de campos del formulario.
const camposTipoVehiculo: Campo[] = [
  { tipo: "text", nombre: "Nombre", clave: "nombre" },
  { tipo: "text", nombre: "Capacidad de peso (KG)", clave: "capacidadPesoKG" },
  {
    tipo: "text",
    nombre: "Capacidad de volumen (m³)",
    clave: "capacidadVolumenM3",
  },
  { tipo: "text", nombre: "Descripción", clave: "descripcion" },
];

// Adaptador del servicio a la interfaz CrudService.
const servicioAdaptado: CrudService<TipoVehiculo> = {
  getAll: tipoVehiculoService.obtenerTiposVehiculo,
  create: tipoVehiculoService.crearTipoVehiculo,
  update: (id, data) =>
    tipoVehiculoService.actualizarTipoVehiculo(id.toString(), data),
  remove: (id) => tipoVehiculoService.eliminarTipoVehiculo(id.toString()),
};

export const FormCrearTipoVehiculo: React.FC = () => {
  // Lógica centralizada en el hook.
  const { items, editingItem, showForm, message, actions } =
    useCrud<TipoVehiculo>(servicioAdaptado);

  // Mapeo de datos del formulario.
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
        <BotonPrimario onClick={actions.handleCreateNew}>
          Crear nuevo tipo de vehiculo
        </BotonPrimario>
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

      {message && <div className="mensaje-exito">{message}</div>}

      <DataTable
        entidad="tipoDeVehiculo"
        rows={items}
        handleEdit={actions.handleEdit}
        handleDelete={actions.handleDelete}
      />
    </div>
  );
};
