import React from "react";
import FormularioDinamico, { Campo } from "./FormularioDinamico";
import { BotonPrimario } from "../Botones";
import * as cargaService from "../../services/cargaService";
import DataTable from "../tablas/tablaDinamica";
import { Carga } from "../../services/cargaService";
import { useCrud } from "../hook/useCrud";
import { CrudService } from "../../services/crudService";

const camposCarga: Campo[] = [
  { tipo: "text", nombre: "Nombre", clave: "nombre", requerido: true },
  { tipo: "text", nombre: "Descripción", clave: "descripcion", requerido: true },
];

const servicioAdaptado: CrudService<Carga> = {
  getAll: cargaService.obtenerCargas,
  create: cargaService.crearCarga,
  update: (id, data) => cargaService.actualizarCarga(id.toString(), data),
  remove: cargaService.eliminarCarga,
};

export const FormCrearCarga: React.FC = () => {
  const { items, editingItem, showForm, message, actions } =
    useCrud<Carga>(servicioAdaptado);

  /**
   * Se ajusta la forma en que se construyen los datos para enviarlos.
   * Esto asegura que siempre se envíe el campo 'activo' y que el 'id'
   * se omita, cumpliendo el contrato Omit<Carga, 'id'>.
   */
  const handleFormSubmit = (formValues: Record<string, any>) => {
    const data: Omit<Carga, "id"> = {
      // Si estamos editando, usamos el item original como base para no perder su estado 'activo'.
      // Si estamos creando, establecemos 'activo: true' por defecto.
      ...(editingItem ? editingItem : { activo: true }),
      // Sobrescribimos con los valores del formulario.
      nombre: formValues.nombre,
      descripcion: formValues.descripcion,
    };

    // El objeto 'data' no tiene 'id', por lo que coincide perfectamente con lo que handleSubmit espera.
    actions.handleSubmit(data);
  };

  return (
    <div>
      {!showForm && (
        <BotonPrimario onClick={actions.handleCreateNew}>
          Crear nuevo Tipo de Carga
        </BotonPrimario>
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

      {message && <div className="mensaje-exito">{message}</div>}

      <DataTable
        entidad="tipoDeCarga"
        rows={items}
        handleEdit={actions.handleEdit}
        handleDelete={actions.handleDelete}
      />
    </div>
  );
};
