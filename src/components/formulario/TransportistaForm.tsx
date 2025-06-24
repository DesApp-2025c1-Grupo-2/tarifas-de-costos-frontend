import React from "react";
import FormularioDinamico, { Campo } from "./FormularioDinamico";
import { BotonPrimario } from "../Botones";
import * as transportistaService from "../../services/transportistaService";
import DataTable from "../tablas/tablaDinamica";
import { Transportista } from "../../services/transportistaService";
import { useCrud } from "../hook/useCrud";
import { CrudService } from "../../services/crudService";

// Campos del formulario.
const camposTransportista: Campo[] = [
  { tipo: "text", nombre: "Nombre de Contacto", clave: "contactoNombre" },
  { tipo: "text", nombre: "Empresa", clave: "nombreEmpresa" },
  { tipo: "text", nombre: "Correo", clave: "contactoEmail" },
  { tipo: "text", nombre: "Teléfono", clave: "contactoTelefono" },
];

// Adaptador del servicio.
const servicioAdaptado: CrudService<Transportista> = {
  getAll: transportistaService.obtenerTransportistas,
  create: transportistaService.crearTransportista,
  update: transportistaService.actualizarTransportista,
  remove: transportistaService.eliminarTransportista,
};

export const FormCrearTransportista: React.FC = () => {
  // Lógica en el hook.
  const { items, editingItem, showForm, message, actions } =
    useCrud<Transportista>(servicioAdaptado);

  // Mapeo de datos.
  const handleFormSubmit = (formValues: Record<string, any>) => {
    const data: Omit<Transportista, "id"> = {
      ...(editingItem ? editingItem : { activo: true }),
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
        <BotonPrimario onClick={actions.handleCreateNew}>
          Crear nuevo transportista
        </BotonPrimario>
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

      {message && <div className="mensaje-exito">{message}</div>}

      <DataTable
        entidad="transportista"
        rows={items}
        handleEdit={actions.handleEdit}
        handleDelete={actions.handleDelete}
      />
    </div>
  );
};
