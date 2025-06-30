import React from "react";
import FormularioDinamico, { Campo } from "../FormularioDinamico";
import { BotonPrimario } from "../../Botones";
import * as adicionalService from "../../../services/adicionalService";
import DataTable from "../../tablas/tablaDinamica";
import { Adicional } from "../../../services/adicionalService";
import { useCrud } from "../../hook/useCrud";
import { CrudService } from "../../../services/crudService";

const camposAdicional: Campo[] = [
  { tipo: "text", nombre: "Nombre del Adicional", clave: "nombre" , requerido: true},
  { tipo: "text", nombre: "Descripción", clave: "descripcion", requerido: true },
  { tipo: "costoBase", nombre: "Costo del Adicional", clave: "costoDefault", requerido: true },
];

const servicioAdaptado: CrudService<Adicional> = {
  getAll: adicionalService.obtenerAdicionales,
  create: adicionalService.crearAdicional,
  update: (id, data) => adicionalService.actualizarAdicional(id, data),
  remove: (id) => adicionalService.eliminarAdicional(id),
};

export const AdicionalForm: React.FC = () => {
  const { items, editingItem, showForm, message, actions } =
    useCrud<Adicional>(servicioAdaptado);

  const handleFormSubmit = (formValues: Record<string, any>) => {
    const data: Omit<Adicional, "id"> = {
      ...(editingItem ? editingItem : { activo: true }),
      nombre: formValues.nombre,
      descripcion: formValues.descripcion,
      costoDefault: Number(formValues.costoDefault),
    };
    actions.handleSubmit(data);
  };

  return (
    <div>
      {!showForm && (
        <BotonPrimario onClick={actions.handleCreateNew}>
          Crear nuevo adicional
        </BotonPrimario>
      )}

      {showForm && (
        <FormularioDinamico
          titulo={
            editingItem ? "Editar Adicional" : "Registrar Nuevo Adicional"
          }
          campos={camposAdicional}
          onSubmit={handleFormSubmit}
          initialValues={editingItem}
          modal
          open={showForm}
          onClose={actions.handleCancel}
        />
      )}

      {message && <div className="mensaje-exito">{message}</div>}

      <DataTable
        entidad="adicional"
        rows={items}
        handleEdit={actions.handleEdit}
        handleDelete={actions.handleDelete}
      />
    </div>
  );
};
