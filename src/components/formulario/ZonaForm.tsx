import React from "react";
import FormularioDinamico, { Campo } from "./FormularioDinamico";
import { BotonPrimario } from "../Botones";
import * as zonaService from "../../services/zonaService";
import DataTable from "../tablas/tablaDinamica";
import { ZonaViaje } from "../../services/zonaService";
import { useCrud } from "../hook/useCrud";
import { CrudService } from "../../services/crudService";

const camposZona: Campo[] = [
  { tipo: "text", nombre: "Nombre", clave: "nombre" , requerido: true},
  { tipo: "text", nombre: "Descripcion", clave: "descripcion", requerido: true },
  { tipo: "text", nombre: "Region", clave: "regionMapa", requerido: true },
];

// Adaptador del servicio.
const servicioAdaptado: CrudService<ZonaViaje> = {
  getAll: zonaService.obtenerZonas,
  create: zonaService.crearZona,
  update: zonaService.actualizarZona,
  remove: zonaService.eliminarZona,
};

export const FormCrearZona: React.FC = () => {
  // Lógica en el hook.
  const { items, editingItem, showForm, message, actions } =
    useCrud<ZonaViaje>(servicioAdaptado);

  // Mapeo de datos.
  const handleFormSubmit = (formValues: Record<string, any>) => {
    const data: Omit<ZonaViaje, "id"> = {
      ...(editingItem ? editingItem : { activo: true }),
      nombre: formValues.nombre,
      descripcion: formValues.descripcion,
      regionMapa: formValues.regionMapa,
    };
    actions.handleSubmit(data);
  };

  return (
    <div>
      {!showForm && (
        <BotonPrimario onClick={actions.handleCreateNew}>
          Crear nueva zona
        </BotonPrimario>
      )}

      {showForm && (
        <FormularioDinamico
          titulo={editingItem ? "Editar Zona" : "Registrar nueva zona"}
          campos={camposZona}
          onSubmit={handleFormSubmit}
          initialValues={editingItem}
          modal
          open={showForm}
          onClose={actions.handleCancel}
        />
      )}

      {message && <div className="mensaje-exito">{message}</div>}

      <DataTable
        entidad="zona"
        rows={items}
        handleEdit={actions.handleEdit}
        handleDelete={actions.handleDelete}
      ></DataTable>
    </div>
  );
};
