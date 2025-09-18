import React, { useEffect, useState } from "react";
import FormularioDinamico, { Campo } from "./FormularioDinamico";
import { BotonPrimario } from "../Botones";
import * as zonaService from "../../services/zonaService";
import DataTable from "../tablas/tablaDinamica";
import { ZonaViaje } from "../../services/zonaService";
import { useCrud } from "../hook/useCrud";
import { CrudService } from "../../services/crudService";
import { Box, Alert } from "@mui/material";
import DialogoConfirmacion from "../DialogoConfirmacion";
import { Provincia, obtenerProvincias } from "../../services/provinciaService";

const camposZona: Campo[] = [
  { tipo: "text", nombre: "Nombre", clave: "nombre", requerido: true },
  {
    tipo: "text",
    nombre: "Descripcion",
    clave: "descripcion",
    requerido: true,
  },
  { tipo: "text", nombre: "Region", clave: "regionMapa", requerido: true },
  {
    tipo: "provincias",
    nombre: "Provincias",
    clave: "provincias",
    requerido: true,
  },
];

const servicioAdaptado: CrudService<ZonaViaje> = {
  getAll: zonaService.obtenerZonas,
  create: zonaService.crearZona,
  update: zonaService.actualizarZona,
  remove: zonaService.eliminarZona,
};

export const FormCrearZona: React.FC = () => {
  const {
    items,
    editingItem,
    showForm,
    message,
    confirmOpen,
    setConfirmOpen,
    confirmDelete,
    highlightedId,
    setMessage,
    actions,
  } = useCrud<ZonaViaje>(servicioAdaptado);
  const [provincias, setProvincias] = useState<Provincia[]>([]);

  useEffect(() => {
    let estaActivo = true;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const cargarProvincias = async () => {
      try {
        const data = await obtenerProvincias();
        if (!estaActivo) return;
        const activas = data.filter((provincia) => provincia.activo !== false);
        setProvincias(activas);
      } catch (error) {
        console.error("Error al obtener las provincias:", error);
        if (!estaActivo) return;
        setMessage({
          text: "Error al cargar las provincias.",
          severity: "error",
        });
        timeoutId = setTimeout(() => setMessage(null), 8000);
      }
    };

    cargarProvincias();

    return () => {
      estaActivo = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [setMessage]);

  const camposFormulario = React.useMemo(
    () =>
      camposZona.map((campo) =>
        campo.clave === "provincias"
          ? { ...campo, opciones: provincias }
          : campo
      ),
    [provincias]
  );

  const handleFormSubmit = (formValues: Record<string, any>) => {
    const data: Omit<ZonaViaje, "id"> = {
      ...(editingItem ?? {}),
      activo: true,
      nombre: formValues.nombre,
      descripcion: formValues.descripcion,
      regionMapa: formValues.regionMapa,
      provincias: formValues.provincias,
    };
    actions.handleSubmit(data);
  };

  return (
    <div>
      {!showForm && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <BotonPrimario onClick={actions.handleCreateNew}>
            Crear nueva zona
          </BotonPrimario>
        </Box>
      )}

      {showForm && (
        <FormularioDinamico
          titulo={editingItem ? "Editar Zona" : "Registrar nueva zona"}
          campos={camposFormulario}
          onSubmit={handleFormSubmit}
          initialValues={editingItem}
          modal
          open={showForm}
          onClose={actions.handleCancel}
        />
      )}

      <DataTable
        entidad="zona"
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
        descripcion="¿Estás seguro de que deseas eliminar esta zona?"
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
