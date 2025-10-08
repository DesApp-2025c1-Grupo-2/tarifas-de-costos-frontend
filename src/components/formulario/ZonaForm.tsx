import React, { useEffect, useState, useMemo } from "react";
import FormularioDinamico, { Campo } from "./FormularioDinamico";
import { BotonPrimario } from "../Botones";
import * as zonaService from "../../services/zonaService";
import DataTable from "../tablas/tablaDinamica";
import { ZonaViaje } from "../../services/zonaService";
import { useCrud } from "../hook/useCrud";
import { CrudService } from "../../services/crudService";
import { Box, Alert, Button, Paper } from "@mui/material";
import DialogoConfirmacion from "../DialogoConfirmacion";
import { Provincia, obtenerProvincias } from "../../services/provinciaService";
import { MapaArgentina } from "./provincias/MapaArgentina";

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
  const [selectedProvincesForMap, setSelectedProvincesForMap] = useState<
    Provincia[]
  >([]);

  useEffect(() => {
    const cargarProvincias = async () => {
      try {
        const data = await obtenerProvincias();
        setProvincias(data.filter((p) => p.activo !== false));
      } catch (error) {
        console.error("Error al obtener las provincias:", error);
        setMessage({
          text: "Error al cargar las provincias.",
          severity: "error",
        });
      }
    };
    cargarProvincias();
  }, [setMessage]);

  const camposFormulario = useMemo(
    () =>
      camposZona.map((campo) =>
        campo.clave === "provincias"
          ? { ...campo, opciones: provincias }
          : campo
      ),
    [provincias]
  );

  const handleFormSubmit = (formValues: Record<string, any>) => {
    const data = {
      activo: true,
      nombre: formValues.nombre,
      descripcion: formValues.descripcion,
      regionMapa: formValues.regionMapa,
      provinciasNombres: (formValues.provincias || []).map(
        (p: Provincia) => p.nombre
      ),
    };
    actions.handleSubmit(data as Omit<ZonaViaje, "id">);
  };

  const handleValuesChange = (formValues: Record<string, any>) => {
    if (formValues.provincias) {
      setSelectedProvincesForMap(formValues.provincias);
    } else {
      setSelectedProvincesForMap([]);
    }
  };

  const initialValuesForForm = useMemo(() => {
    if (!editingItem) return null;

    // Cuando se edita, se reconstruyen los objetos de provincia completos a partir de los nombres
    const provinciasSeleccionadas = (editingItem.provincias || [])
      .map((provinciaDeZona: any) =>
        provincias.find(
          (p) => p.nombre === (provinciaDeZona.nombre || provinciaDeZona)
        )
      )
      .filter(Boolean) as Provincia[];

    // Actualiza el mapa al cargar la edición
    setSelectedProvincesForMap(provinciasSeleccionadas);

    return {
      ...editingItem,
      provincias: provinciasSeleccionadas,
    };
  }, [editingItem, provincias]);

  return (
    <div>
      {!showForm && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <BotonPrimario onClick={actions.handleCreateNew}>
            Crear nueva zona
          </BotonPrimario>
        </Box>
      )}

      {/* FIX: Se revierte el contenedor externo a BOX y se envuelve cada columna en PAPER. */}
      {showForm && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 4,
          }}
        >
          {/* Columna 1: Formulario (Envuelto en Paper) */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: "8px",
              // Se elimina la altura fija para que el formulario se ajuste al contenido.
            }}
          >
            <FormularioDinamico
              titulo={editingItem ? "Editar Zona" : "Registrar nueva zona"}
              campos={camposFormulario}
              onSubmit={handleFormSubmit}
              initialValues={initialValuesForForm}
              onValuesChange={handleValuesChange}
            >
              {/* Botones de acción del formulario */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  mt: 3,
                }}
              >
                <Button onClick={actions.handleCancel} variant="outlined">
                  Cancelar
                </Button>
                <Button type="submit" variant="contained">
                  Guardar
                </Button>
              </Box>
            </FormularioDinamico>
          </Paper>

          {/* Columna 2: Mapa (Envuelto en Paper para igualar el fondo y el p:4, y altura al 100%) */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: "8px",
              height: "100%", // Hace que el Paper ocupe toda la altura disponible (igualando el formulario)
            }}
          >
            <MapaArgentina provinciasSeleccionadas={selectedProvincesForMap} />
          </Paper>
        </Box>
      )}

      {/* La tabla se muestra cuando no estamos en modo formulario */}
      {!showForm && (
        <DataTable
          entidad="zona"
          rows={items}
          handleEdit={actions.handleEdit}
          handleDelete={actions.handleDelete}
          highlightedId={highlightedId}
        />
      )}

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
