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
import DialogoConfirmacion from "../DialogoConfirmacion";
import { Provincia, obtenerProvincias } from "../../services/provinciaService";
import { MapaArgentina } from "./provincias/MapaArgentina"; // <-- Importa el mapa nuevamente
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
  // --- VUELVE A AÑADIR EL ESTADO PARA EL MAPA ---
  const [selectedProvincesForMap, setSelectedProvincesForMap] = useState<
    Provincia[]
  >([]);
  // --- FIN ESTADO MAPA ---
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dependenciesLoaded, setDependenciesLoaded] = useState(false);

  const loadItems = useCallback(async () => {
    // ... (sin cambios en loadItems)
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
    // ... (sin cambios en loadDependencies)
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
    setSelectedProvincesForMap([]); // Limpiar mapa al crear
    setMessage(null);
  };

  const handleEdit = (zona: ZonaViaje) => {
    setEditingItem(zona);
    setShowForm(true);
    // Pre-cargar el mapa al editar (se hará en initialValuesForForm/useEffect)
    setMessage(null);
  };

  // --- INICIO DE LA CORRECCIÓN 1 ---
  // Se elimina setMessage(null) de handleCancel
  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    setSelectedProvincesForMap([]); // Limpiar mapa al cancelar
  };
  // --- FIN DE LA CORRECCIÓN 1 ---

  const handleDelete = (zona: ZonaViaje) => {
    setIdToDelete(zona.id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    // ... (sin cambios en confirmDelete)
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

  // --- VUELVE A AÑADIR LA LÓGICA PARA ACTUALIZAR EL MAPA ---
  const handleValuesChange = (formValues: Record<string, any>) => {
    // Si el campo 'provincias' cambió en el formulario, actualiza el estado del mapa
    if (formValues.provincias) {
      setSelectedProvincesForMap(formValues.provincias);
    } else {
      setSelectedProvincesForMap([]); // Si se borran todas, limpia el mapa
    }
  };
  // --- FIN LÓGICA MAPA ---

  const initialValuesForForm = useMemo(() => {
    if (!editingItem) return {};

    const provinciasSeleccionadas = (editingItem.provinciasNombres || [])
      .map((nombreProvincia) =>
        provincias.find((p) => p.nombre === nombreProvincia)
      )
      .filter((p) => p !== undefined) as Provincia[];

    // --- IMPORTANTE: Actualizar el mapa cuando se cargan los valores iniciales ---
    // setSelectedProvincesForMap(provinciasSeleccionadas); // Se hace en el useEffect de abajo

    return {
      nombre: editingItem.nombre,
      descripcion: editingItem.descripcion,
      provincias: provinciasSeleccionadas,
    };
  }, [editingItem, provincias]);

  // --- VUELVE A AÑADIR useEffect para actualizar el mapa al editar ---
  useEffect(() => {
    // Cuando cambian los valores iniciales (al hacer clic en editar),
    // actualiza el estado que controla el mapa.
    if (initialValuesForForm?.provincias) {
      setSelectedProvincesForMap(initialValuesForForm.provincias);
    } else if (!editingItem) {
      // Asegurarse de limpiar el mapa si se pasa de editar a crear
      setSelectedProvincesForMap([]);
    }
  }, [initialValuesForForm, editingItem]);
  // --- FIN useEffect MAPA ---

  // --- INICIO DE LA CORRECCIÓN 2 ---
  // Se mueven los setTimeout para limpiar los mensajes DENTRO de try/catch
  // y se elimina el bloque 'finally' que borraba el mensaje de éxito.
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
      handleCancel(); // Esta llamada ya es segura
      await loadItems();
      setHighlightedId(changedItem.id);
      setTimeout(() => setHighlightedId(null), 4000);

      // Limpiar mensaje de ÉXITO después de 5 segundos
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      console.error("Error al guardar la zona:", err);
      const errorMsg = err.message || `Error al guardar la zona.`;
      setMessage({ text: errorMsg, severity: "error" });

      // Limpiar mensaje de ERROR después de 5 segundos
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setIsSaving(false);
      // Se elimina el setTimeout de aquí
    }
  };
  // --- FIN DE LA CORRECCIÓN 2 ---

  return (
    <div>
      {!showForm && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <BotonPrimario
            onClick={handleCreateNew}
            disabled={isLoading || !dependenciesLoaded}
          >
            Crear nueva zona
          </BotonPrimario>
          {isLoading && (
            <Typography
              color="textSecondary"
              sx={{ ml: 2, alignSelf: "center" }}
            >
              Cargando datos...
            </Typography>
          )}
        </Box>
      )}

      {showForm && (
        // --- VUELVE A AÑADIR EL LAYOUT DE DOS COLUMNAS ---
        <Box
          sx={{
            display: "grid",
            // Una columna en pantallas pequeñas, dos en medianas y grandes
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 2, md: 4 }, // Espacio entre columnas
            mb: 3,
          }}
        >
          {/* Columna 1: Formulario */}
          <Paper
            elevation={0}
            sx={{ p: { xs: 2, md: 4 }, borderRadius: "8px" }}
          >
            <FormularioDinamico
              titulo={editingItem ? "Editar Zona" : "Registrar nueva zona"}
              campos={camposFormulario}
              onSubmit={handleFormSubmit}
              initialValues={initialValuesForForm}
              // --- VUELVE A PASAR onValuesChange ---
              onValuesChange={handleValuesChange}
              // --- FIN onValuesChange ---
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
          </Paper>

          {/* Columna 2: Mapa */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 4 },
              borderRadius: "8px",
              // Asegurar altura mínima o específica si es necesario
              height: { xs: "300px", md: "100%" }, // Ajusta altura según necesites
              minHeight: "300px", // Altura mínima
              display: { xs: "block", md: "block" }, // Asegurar que sea visible
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
              Referencia Geográfica
            </Typography>
            <MapaArgentina provinciasSeleccionadas={selectedProvincesForMap} />
          </Paper>
        </Box>
        // --- FIN LAYOUT DOS COLUMNAS ---
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
