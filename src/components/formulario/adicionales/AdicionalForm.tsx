import React, { useState } from "react";
import { Box } from "@mui/material";
import FormularioDinamico, { Campo } from "../FormularioDinamico";
import { BotonPrimario, BotonSecundario } from "../../Botones";
import * as adicionalService from "../../../services/adicionalService";
import DataTable from "../../tablas/tablaDinamica";
import { Adicional } from "../../../services/adicionalService";
import { useCrud } from "../../hook/useCrud";
import { CrudService } from "../../../services/crudService";
import { ModalPromoverAdicional } from "./ModalPromoverAdicional";

const camposAdicional: Campo[] = [
  {
    tipo: "text",
    nombre: "Nombre del Adicional",
    clave: "nombre",
    requerido: true,
  },
  {
    tipo: "text",
    nombre: "Descripción",
    clave: "descripcion",
    requerido: true,
  },
  {
    tipo: "costoBase",
    nombre: "Costo del Adicional",
    clave: "costoDefault",
    requerido: true,
  },
  {
    tipo: "switch",
    nombre: "Es Adicional Flotante (Global)",
    clave: "esGlobal",
  },
];

const servicioAdaptado: CrudService<Adicional> = {
  getAll: adicionalService.obtenerAdicionales,
  create: adicionalService.crearAdicional,
  update: (id, data) => adicionalService.actualizarAdicional(id, data),
  remove: (id) => adicionalService.eliminarAdicional(id),
};

export const AdicionalForm: React.FC = () => {
  const {
    items,
    editingItem,
    showForm,
    message,
    fetchItems,
    setMessage,
    actions,
  } = useCrud<Adicional>(servicioAdaptado);

  const [modalPromoverAbierto, setModalPromoverAbierto] = useState(false);

  const handleFormSubmit = (formValues: Record<string, any>) => {
    const data: Omit<Adicional, "id"> = {
      ...(editingItem ? editingItem : { activo: true }),
      nombre: formValues.nombre,
      descripcion: formValues.descripcion,
      costoDefault: Number(formValues.costoDefault),
      esGlobal: !!formValues.esGlobal,
    };
    actions.handleSubmit(data);
  };

  const handlePromoverSubmit = async (adicional: Adicional) => {
    try {
      const adicionalPromovido = { ...adicional, esGlobal: false };
      const { id, ...dataToUpdate } = adicionalPromovido;
      await adicionalService.actualizarAdicional(id, dataToUpdate);
      setMessage("Adicional promovido con éxito.");
      fetchItems();
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Error al promover el adicional.";
      setMessage(errorMsg);
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const adicionalesConstantes = items.filter((item) => !item.esGlobal);

  return (
    <div>
      {/* Contenedor que centra los botones */}
      <Box sx={{ display: "flex", gap: 2, mb: 2, justifyContent: "center" }}>
        <BotonPrimario onClick={actions.handleCreateNew}>
          Crear Adicional
        </BotonPrimario>
        <BotonSecundario onClick={() => setModalPromoverAbierto(true)}>
          Promover Flotante
        </BotonSecundario>
      </Box>

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

      <ModalPromoverAdicional
        open={modalPromoverAbierto}
        onClose={() => setModalPromoverAbierto(false)}
        onPromover={handlePromoverSubmit}
      />

      {message && <div className="mensaje-exito">{message}</div>}

      <DataTable
        entidad="adicional"
        rows={adicionalesConstantes}
        handleEdit={actions.handleEdit}
        handleDelete={actions.handleDelete}
      />
    </div>
  );
};
