import React, { useState, useEffect, useCallback } from "react";
import { Box, Alert } from "@mui/material";
import FormularioDinamico, { Campo } from "../FormularioDinamico";
import { BotonPrimario, BotonSecundario } from "../../Botones";
import * as adicionalService from "../../../services/adicionalService";
import * as reporteService from "../../../services/reporteService";
import DataTable from "../../tablas/tablaDinamica";
import { Adicional } from "../../../services/adicionalService";
import { ModalPromoverAdicional } from "./ModalPromoverAdicional";
import DialogoConfirmacion from "../../DialogoConfirmacion";
import { MessageState, useCrud } from "../../hook/useCrud";
import { CrudService } from "../../../services/crudService";

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
  // La obtención de datos se manejará localmente
  getAll: adicionalService.obtenerAdicionales,
  create: adicionalService.crearAdicional,
  update: (id, data) => adicionalService.actualizarAdicional(id, data),
  remove: (id) => adicionalService.eliminarAdicional(id),
};

// Se crea un nuevo tipo que incluye la cantidad
type AdicionalConFrecuencia = Adicional & { cantidad: number };

export const AdicionalForm: React.FC = () => {
  // Se mantiene el hook 'useCrud' principalmente para las acciones (crear, editar, etc.)
  const {
    editingItem,
    showForm,
    message,
    confirmOpen,
    setConfirmOpen,
    confirmDelete,
    highlightedId,
    setMessage,
    actions,
  } = useCrud<Adicional>(servicioAdaptado);

  const [items, setItems] = useState<AdicionalConFrecuencia[]>([]);
  const [modalPromoverAbierto, setModalPromoverAbierto] = useState(false);

  // Función para cargar y combinar los datos
  const fetchItems = useCallback(async () => {
    try {
      const [adicionales, frecuencia] = await Promise.all([
        adicionalService.obtenerAdicionales(),
        reporteService.getFrecuenciaAdicionales(),
      ]);

      const frecuenciaMap = new Map(
        (frecuencia || []).map((f) => [f.nombreAdicional, f.cantidad])
      );

      const combinados = adicionales.map((a) => ({
        ...a,
        cantidad: frecuenciaMap.get(a.nombre) ?? 0,
      }));

      setItems(combinados);
    } catch (error) {
      console.error("Error al cargar los adicionales con frecuencia:", error);
      setMessage({
        text: "Error al cargar los datos.",
        severity: "error",
      });
    }
  }, [setMessage]);

  // Se llama a la carga de datos al montar el componente
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleFormSubmit = async (formValues: Record<string, any>) => {
    const data: Omit<Adicional, "id"> = {
      ...(editingItem ?? {}),
      activo: true,
      nombre: formValues.nombre,
      descripcion: formValues.descripcion,
      costoDefault: Number(formValues.costoDefault),
      esGlobal: !!formValues.esGlobal,
    };
    // Se usa la acción del hook, y luego se recargan los datos
    await actions.handleSubmit(data);
    fetchItems();
  };

  const handlePromoverSubmit = async (adicional: Adicional) => {
    try {
      const adicionalPromovido = { ...adicional, esGlobal: false };
      const { id, ...dataToUpdate } = adicionalPromovido;
      await adicionalService.actualizarAdicional(id, dataToUpdate);
      setMessage({
        text: "Adicional promovido con éxito.",
        severity: "success",
      });
      fetchItems(); // Recargar datos
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Error al promover el adicional.";
      setMessage({ text: errorMsg, severity: "error" });
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const adicionalesConstantes = items.filter(
    (item) => !item.esGlobal && item.activo
  );

  return (
    <div>
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

      <DataTable
        entidad="adicional"
        rows={adicionalesConstantes}
        handleEdit={actions.handleEdit}
        handleDelete={actions.handleDelete}
        highlightedId={highlightedId}
      />

      <DialogoConfirmacion
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={async () => {
          await confirmDelete();
          fetchItems();
        }}
        titulo="Confirmar eliminación"
        descripcion="¿Estás seguro de que deseas eliminar este elemento?"
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
