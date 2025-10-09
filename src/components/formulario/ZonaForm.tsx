import React, { useEffect, useState, useMemo, useCallback } from "react";
import FormularioDinamico, { Campo } from "./FormularioDinamico";
import { BotonPrimario } from "../Botones";
import * as zonaService from "../../services/zonaService";
import DataTable from "../tablas/tablaDinamica";
import { ZonaViaje } from "../../services/zonaService";
import { Box, Alert, Button, Paper } from "@mui/material";
import DialogoConfirmacion from "../DialogoConfirmacion";
import { Provincia, obtenerProvincias } from "../../services/provinciaService";
import { MapaArgentina } from "./provincias/MapaArgentina";
import { MessageState } from "../hook/useCrud";

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

export const FormCrearZona: React.FC = () => {
  const [items, setItems] = useState<ZonaViaje[]>([]);
  const [editingItem, setEditingItem] = useState<ZonaViaje | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<MessageState | null>(null);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | string | null>(null);

  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [selectedProvincesForMap, setSelectedProvincesForMap] = useState<
    Provincia[]
  >([]);

  const loadItems = useCallback(async () => {
    try {
      const data = await zonaService.obtenerZonas();
      setItems(data.filter((item) => item.activo !== false));
    } catch (error) {
      setMessage({ text: "Error al cargar las zonas.", severity: "error" });
    }
  }, []);

  useEffect(() => {
    loadItems();
    const cargarProvincias = async () => {
      try {
        const data = await obtenerProvincias();
        setProvincias(data.filter((p) => p.activo !== false));
      } catch (error) {
        setMessage({
          text: "Error al cargar las provincias.",
          severity: "error",
        });
      }
    };
    cargarProvincias();
  }, [loadItems]);

  const handleCreateNew = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (zona: ZonaViaje) => {
    setEditingItem(zona);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleDelete = (zona: ZonaViaje) => {
    setIdToDelete(zona.id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (idToDelete === null) return;
    try {
      await zonaService.eliminarZona(idToDelete);
      setMessage({ text: "Zona eliminada con éxito.", severity: "success" });
      loadItems();
    } catch (err) {
      setMessage({ text: "Error al eliminar la zona.", severity: "error" });
    } finally {
      setConfirmOpen(false);
      setIdToDelete(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const camposFormulario = useMemo(
    () =>
      camposZona.map((campo) =>
        campo.clave === "provincias"
          ? { ...campo, opciones: provincias }
          : campo
      ),
    [provincias]
  );

  const handleFormSubmit = async (formValues: Record<string, any>) => {
    const data = {
      activo: true,
      nombre: formValues.nombre,
      descripcion: formValues.descripcion,
      regionMapa: formValues.regionMapa,
      provinciasNombres: (formValues.provincias || []).map(
        (p: Provincia) => p.nombre
      ),
    };

    try {
      let changedItem: ZonaViaje;
      if (editingItem) {
        changedItem = await zonaService.actualizarZona(
          editingItem.id,
          data as Omit<ZonaViaje, "id">
        );
        setMessage({
          text: "Zona actualizada con éxito.",
          severity: "success",
        });
      } else {
        changedItem = await zonaService.crearZona(
          data as Omit<ZonaViaje, "id">
        );
        setMessage({ text: "Zona creada con éxito.", severity: "success" });
      }
      handleCancel();
      await loadItems();
      setHighlightedId(changedItem.id);
      setTimeout(() => setHighlightedId(null), 4000);
    } catch (err) {
      setMessage({ text: `Error al guardar la zona.`, severity: "error" });
    } finally {
      setTimeout(() => setMessage(null), 5000);
    }
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

    const provinciasSeleccionadas = (editingItem.provincias || [])
      .map((provinciaDeZona: any) =>
        provincias.find(
          (p) => p.nombre === (provinciaDeZona.nombre || provinciaDeZona)
        )
      )
      .filter(Boolean) as Provincia[];

    return {
      ...editingItem,
      provincias: provinciasSeleccionadas,
    };
  }, [editingItem, provincias]);

  useEffect(() => {
    if (initialValuesForForm?.provincias) {
      setSelectedProvincesForMap(initialValuesForForm.provincias);
    } else if (!editingItem) {
      setSelectedProvincesForMap([]);
    }
  }, [initialValuesForForm, editingItem]);

  return (
    <div>
      {!showForm && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <BotonPrimario onClick={handleCreateNew}>
            Crear nueva zona
          </BotonPrimario>
        </Box>
      )}

      {showForm && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 4,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: "8px",
            }}
          >
            <FormularioDinamico
              titulo={editingItem ? "Editar Zona" : "Registrar nueva zona"}
              campos={camposFormulario}
              onSubmit={handleFormSubmit}
              initialValues={initialValuesForForm}
              onValuesChange={handleValuesChange}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  mt: 3,
                }}
              >
                <Button onClick={handleCancel} variant="outlined">
                  Cancelar
                </Button>
                <Button type="submit" variant="contained">
                  Guardar
                </Button>
              </Box>
            </FormularioDinamico>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: "8px",
              height: "100%",
            }}
          >
            <MapaArgentina provinciasSeleccionadas={selectedProvincesForMap} />
          </Paper>
        </Box>
      )}

      {!showForm && (
        <DataTable
          entidad="zona"
          rows={items}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
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
