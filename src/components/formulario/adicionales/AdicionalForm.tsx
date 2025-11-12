import React, { useState, useEffect, useCallback } from "react";
import { Box, Alert } from "@mui/material";
import FormularioDinamico, { Campo } from "../FormularioDinamico";
import { BotonPrimario, BotonSecundario } from "../../Botones";
import * as adicionalService from "../../../services/adicionalService"; // Asegúrate que esta ruta es correcta
import * as reporteService from "../../../services/reporteService"; // Asegúrate que esta ruta es correcta
import DataTable from "../../tablas/tablaDinamica";
import { Adicional } from "../../../services/adicionalService"; // Importar el tipo Adicional
import { ModalPromoverAdicional } from "./ModalPromoverAdicional";
import DialogoConfirmacion from "../../DialogoConfirmacion";
import { MessageState, useCrud } from "../../hook/useCrud";
import { CrudService } from "../../../services/crudService";
import { getHumanReadableError } from "../../../utils/errorUtils";

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
  remove: adicionalService.eliminarAdicional, // Usa baja lógica
};

type AdicionalConFrecuencia = Adicional & { cantidad: number };

export const AdicionalForm: React.FC = () => {
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
  const [isSaving, setIsSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    setMessage(null);
    try {
      const [adicionales, frecuenciaData] = await Promise.all([
        adicionalService.obtenerAdicionales(),
        reporteService.getFrecuenciaAdicionales().catch(() => []),
      ]);

      const frecuencia = Array.isArray(frecuenciaData) ? frecuenciaData : [];
      const frecuenciaMap = new Map(
        frecuencia.map((f) => [f.nombreAdicional, f.cantidad])
      );

      const combinados = adicionales.map((a: Adicional) => ({ // <-- Tipo explícito para 'a'
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

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleFormSubmit = async (formValues: Record<string, any>) => {
    setIsSaving(true);
    setMessage(null);
    // Asegurarse de que 'activo' se incluya y sea boolean
    const esActivo = editingItem ? editingItem.activo : true; // Mantiene el estado activo o default a true
    const data: Omit<Adicional, "id"> = {
      nombre: formValues.nombre,
      descripcion: formValues.descripcion,
      costoDefault: Number(formValues.costoDefault),
      esGlobal: formValues.esGlobal === true, // Conversión explícita
      activo: esActivo, // Incluir estado activo
    };

    try {
      await actions.handleSubmit(data);
      await fetchItems();
    } catch (err: any) {
      console.error("Error en handleFormSubmit:", err);
    } finally {
      setIsSaving(false);
    }
  };


  const handlePromoverSubmit = async (adicional: Adicional) => {
    setIsSaving(true);
    setMessage(null);
    try {
      const { id, ...rest } = adicional; // Separa el id del resto de las propiedades
      const payload: Omit<Adicional, 'id'> = {
          ...rest, // Incluye nombre, descripcion, costoDefault
          esGlobal: false, // Cambia esGlobal a false
          activo: true // Asegura que permanezca activo
      };

      await adicionalService.actualizarAdicional(id, payload);
      setMessage({
        text: "Adicional promovido con éxito.",
        severity: "success",
      });
      await fetchItems();
    } catch (error: any) {
      console.error("Error al promover adicional:", error);
      const errorMsg = getHumanReadableError(error);
      setMessage({ text: errorMsg, severity: "error" });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const adicionalesConstantes = items.filter(
    (item) => !item.esGlobal && item.activo
  );

  return (
    <div>
      <Box sx={{ display: "flex", gap: 2, mb: 2, justifyContent: "center" }}>
        <BotonPrimario onClick={actions.handleCreateNew} disabled={isSaving}>
          Crear Adicional
        </BotonPrimario>
        <BotonSecundario onClick={() => setModalPromoverAbierto(true)} disabled={isSaving}>
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
        handleDelete={actions.handleDelete} // Ahora hace baja lógica
        highlightedId={highlightedId}
        actionsDisabled={isSaving}
      />

      <DialogoConfirmacion
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={async () => {
          setIsSaving(true);
          await confirmDelete();
          await fetchItems();
          setIsSaving(false);
        }}
        titulo="Confirmar baja de adicional"
        descripcion="¿Estás seguro de que deseas dar de baja este adicional?"
        textoConfirmar="Dar de Baja"
      />

      {message && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Alert
            severity={message.severity}
            sx={{ width: "100%", maxWidth: "600px" }}
            onClose={() => setMessage(null)}
          >
            {message.text}
          </Alert>
        </Box>
      )}
    </div>
  );
};