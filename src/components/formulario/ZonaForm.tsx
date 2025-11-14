// src/components/formulario/ZonaForm.tsx

import React, { useEffect, useState, useMemo, useCallback } from "react";
import FormularioDinamico, { Campo } from "./FormularioDinamico";
import { BotonPrimario } from "../Botones";
import * as zonaService from "../../services/zonaService";
import DataTable from "../tablas/tablaDinamica";
import { ZonaViaje } from "../../services/zonaService";
import {
  Box,
  Alert,
  Button,
  Paper,
  CircularProgress,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DialogoConfirmacion from "../DialogoConfirmacion";
import { Provincia, obtenerProvincias } from "../../services/provinciaService";
import { MapaArgentina } from "./provincias/MapaArgentina";
import { MessageState } from "../hook/useCrud";

// Campos del formulario (sin regionMapa)
const camposZona: Campo[] = [
  { tipo: "text", nombre: "Nombre", clave: "nombre", requerido: true },
  {
    tipo: "text",
    nombre: "Descripción",
    clave: "descripcion",
    requerido: true,
  },
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dependenciesLoaded, setDependenciesLoaded] = useState(false);

  const loadItems = useCallback(async () => {
    try {
      const data = await zonaService.obtenerZonas();
      setItems(data.filter((item) => item.activo !== false));
    } catch (error) {
      console.error("Error al cargar las zonas:", error);
      setMessage({ text: "Error al cargar las zonas.", severity: "error" });
    } finally {
      if (dependenciesLoaded || message?.severity === "error")
        setIsLoading(false);
    }
  }, [dependenciesLoaded, message?.severity]);

  const loadDependencies = useCallback(async () => {
    setIsLoading(true);
    setDependenciesLoaded(false);
    try {
      const data = await obtenerProvincias();
      const provinciasActivas = data.filter((p) => p.activo !== false);
      setProvincias(provinciasActivas);
      setDependenciesLoaded(true);
    } catch (error) {
      console.error("Error al cargar las provincias:", error);
      setMessage({
        text: "Error al cargar las provincias.",
        severity: "error",
      });
      setDependenciesLoaded(false);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDependencies();
  }, [loadDependencies]);

  useEffect(() => {
    if (dependenciesLoaded || message?.severity === "error") {
      loadItems();
    }
  }, [dependenciesLoaded, loadItems, message?.severity]);

  const handleCreateNew = () => {
    setEditingItem(null);
    setShowForm(true);
    setSelectedProvincesForMap([]);
    setMessage(null);
  };

  const handleEdit = (zona: ZonaViaje) => {
    setEditingItem(zona);
    setShowForm(true);
    setMessage(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    setSelectedProvincesForMap([]);
  };

  const handleDelete = (zona: ZonaViaje) => {
    setIdToDelete(zona.id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (idToDelete === null) return;
    setIsSaving(true);
    try {
      await zonaService.eliminarZona(idToDelete);
      setMessage({ text: "Zona dada de baja con éxito.", severity: "success" });
      await loadItems();
    } catch (err: any) {
      console.error("Error al dar de baja la zona:", err);
      const errorMsg = err.message || "Error al dar de baja la zona.";
      setMessage({ text: errorMsg, severity: "error" });
    } finally {
      setConfirmOpen(false);
      setIdToDelete(null);
      setIsSaving(false);
      setTimeout(() => setMessage(null), 5000);
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

  const handleValuesChange = (formValues: Record<string, any>) => {
    if (formValues.provincias) {
      setSelectedProvincesForMap(formValues.provincias);
    } else {
      setSelectedProvincesForMap([]);
    }
  };

  const initialValuesForForm = useMemo(() => {
    if (!editingItem) return {};

    const provinciasSeleccionadas = (editingItem.provinciasNombres || [])
      .map((nombreProvincia) =>
        provincias.find((p) => p.nombre === nombreProvincia)
      )
      .filter((p) => p !== undefined) as Provincia[];

    return {
      nombre: editingItem.nombre,
      descripcion: editingItem.descripcion,
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

  const handleFormSubmit = async (formValues: Record<string, any>) => {
    setIsSaving(true);
    setMessage(null);
    const data = {
      activo: editingItem ? editingItem.activo : true,
      nombre: formValues.nombre,
      descripcion: formValues.descripcion,
      provinciasNombres: (formValues.provincias || []).map(
        (p: Provincia) => p.nombre
      ),
    };
    try {
      let changedItem: ZonaViaje;
      if (editingItem) {
        changedItem = await zonaService.actualizarZona(editingItem.id, data);
        setMessage({
          text: "Zona actualizada con éxito.",
          severity: "success",
        });
      } else {
        changedItem = await zonaService.crearZona(data);
        setMessage({ text: "Zona creada con éxito.", severity: "success" });
      }
      handleCancel();
      await loadItems();
      setHighlightedId(changedItem.id);
      setTimeout(() => setHighlightedId(null), 4000);

      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      console.error("Error al guardar la zona:", err);
      const errorMsg = err.message || `Error al guardar la zona.`;
      setMessage({ text: errorMsg, severity: "error" });

      setTimeout(() => setMessage(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{ mb: 0, fontWeight: "bold" }}
        >
          {showForm
            ? editingItem
              ? "Editar Zona"
              : "Registrar nueva zona"
            : "Gestionar Zonas"}
        </Typography>

        {!showForm && (
          <BotonPrimario
            onClick={handleCreateNew}
            disabled={isLoading || !dependenciesLoaded}
            startIcon={<AddIcon />}
          >
            Nueva Zona
          </BotonPrimario>
        )}
        {isLoading && !showForm && (
          <Typography color="textSecondary" sx={{ ml: 2, alignSelf: "center" }}>
            Cargando datos...
          </Typography>
        )}
      </Box>

      {showForm && (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 4 },
            mb: 3,
            borderRadius: "8px",
            backgroundColor: "white",
            width: "100%",
          }}
        >
          {/* Box interno para centrar y limitar el ancho de la grilla */}
          <Box sx={{ maxWidth: "1200px", margin: "0 auto" }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: { xs: 2, md: 4 },
              }}
            >
              {/* Columna 1: Formulario */}
              <Box>
                {/* --- INICIO DE LA MODIFICACIÓN --- */}
                {/* Título simple ("Datos de zona") agregado aquí */}
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ mb: 3, fontWeight: "bold" }}
                >
                  Datos de zona
                </Typography>
                {/* --- FIN DE LA MODIFICACIÓN --- */}

                <FormularioDinamico
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
                    <Button
                      onClick={handleCancel}
                      variant="outlined"
                      disabled={isSaving}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSaving || !dependenciesLoaded}
                    >
                      {isSaving ? <CircularProgress size={24} /> : "Guardar"}
                    </Button>
                  </Box>
                </FormularioDinamico>
              </Box>

              {/* Columna 2: Mapa */}
              <Box
                sx={{
                  height: { xs: "300px", md: "100%" },
                  minHeight: "300px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ textAlign: "center" }}
                >
                  Referencia Geográfica
                </Typography>
                <MapaArgentina
                  provinciasSeleccionadas={selectedProvincesForMap}
                />
              </Box>
            </Box>
          </Box>
        </Paper>
      )}

      {!showForm &&
        (isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataTable
            entidad="zona"
            rows={items}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            highlightedId={highlightedId}
            actionsDisabled={!dependenciesLoaded}
          />
        ))}

      <DialogoConfirmacion
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        titulo="Confirmar baja"
        descripcion="¿Estás seguro de que deseas dar de baja esta zona?"
        textoConfirmar="Dar de Baja"
        textoCancelar="Cancelar"
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
