import React from "react";
import FormularioDinamico, { Campo } from "./FormularioDinamico";
import { BotonPrimario } from "../Botones";
import * as tipoVehiculoService from "../../services/tipoVehiculoService";
import DataTable from "../tablas/tablaDinamica";
import { TipoVehiculo } from "../../services/tipoVehiculoService";
import { useCrud } from "../hook/useCrud";
import { CrudService } from "../../services/crudService";

// --- INICIO DE LA CORRECCIÓN ---
// Se ajustan las claves para que coincidan con el tipo de dato 'TipoVehiculo'.
const camposTipoVehiculo: Campo[] = [
  {
    tipo: "text", // Cambiado a 'text' para el nombre del vehículo.
    nombre: "Nombre del Vehículo",
    clave: "nombre", // Clave corregida.
  },
  {
    tipo: "number",
    nombre: "Peso Máximo (KG)",
    clave: "capacidadPesoKG", // Clave corregida.
  },
  {
    tipo: "number",
    nombre: "Volumen Máximo (M³)",
    clave: "capacidadVolumenM3", // Clave corregida.
  },
  { tipo: "text", nombre: "Descripción", clave: "descripcion" },
];
// --- FIN DE LA CORRECCIÓN ---

// Adaptador del servicio a la interfaz CrudService.
const servicioAdaptado: CrudService<TipoVehiculo> = {
  getAll: tipoVehiculoService.obtenerTiposVehiculo,
  create: tipoVehiculoService.crearTipoVehiculo,
  update: (id, data) =>
    tipoVehiculoService.actualizarTipoVehiculo(id.toString(), data), // Convertir id a string
  remove: (id) => tipoVehiculoService.eliminarTipoVehiculo(id.toString()), // Convertir id a string
};

export const FormCrearTipoVehiculo: React.FC = () => {
  // Lógica centralizada en el hook.
  const { items, editingItem, showForm, message, actions } =
    useCrud<TipoVehiculo>(servicioAdaptado);

  // Mapeo de datos del formulario.
  const handleFormSubmit = (formValues: Record<string, any>) => {
    // Esta función ahora funcionará correctamente sin cambios,
    // porque las claves de formValues coincidirán.
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
