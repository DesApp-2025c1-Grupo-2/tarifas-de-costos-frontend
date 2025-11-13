import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  CircularProgress,
  Box,
  Alert,
  FormControlLabel,
  Switch,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import FormularioDinamico, { Campo } from "./FormularioDinamico";
import { BotonPrimario } from "../Botones";
import DataTable from "../tablas/tablaDinamica";
import * as cargaDeCombustibleService from "../../services/cargaDeCombustibleService";
import { CargaDeCombustible } from "../../services/cargaDeCombustibleService";
import { obtenerVehiculo, Vehiculo } from "../../services/vehiculoService";
import { MessageState } from "../hook/useCrud";
import AddIcon from "@mui/icons-material/Add";
import DialogoConfirmacion from "../DialogoConfirmacion";

const getISODate30DaysAgo = () => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().split("T")[0];
};

export const CombustibleForm: React.FC = () => {
  const [cargas, setCargas] = useState<CargaDeCombustible[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [editingItem, setEditingItem] = useState<CargaDeCombustible | null>(
    null
  );
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<MessageState | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState<number | null>(null);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  const cargarDatos = useCallback(async () => {
    setIsLoading(true);
    try {
      const fechaInicio = mostrarHistorico ? undefined : getISODate30DaysAgo();
      const [cargasData, vehiculosData] = await Promise.all([
        cargaDeCombustibleService.obtenerCargasDeCombustible(fechaInicio),
        obtenerVehiculo(),
      ]);
      setCargas(cargasData.filter((c) => c.esVigente));
      setVehiculos(vehiculosData.filter((v) => !v.deletedAt));
    } catch (error) {
      console.error("Error al cargar datos", error);
      setMessage({ text: "Error al cargar los datos", severity: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [mostrarHistorico]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const handleCreateNew = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: CargaDeCombustible) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleDelete = (item: any) => {
    setIdAEliminar(item.id);
    setConfirmDialogOpen(true);
  };

  const confirmarEliminacion = async () => {
    if (idAEliminar !== null) {
      setIsSaving(true);
      try {
        await cargaDeCombustibleService.eliminarCargaDeCombustible(idAEliminar);
        setMessage({
          text: "Carga de combustible eliminada con éxito",
          severity: "success",
        });
        await cargarDatos();
      } catch (err) {
        setMessage({
          text: "Error al eliminar la carga de combustible",
          severity: "error",
        });
      } finally {
        setConfirmDialogOpen(false);
        setIdAEliminar(null);
        setIsSaving(false);
        setTimeout(() => setMessage(null), 3000);
      }
    }
  };

  const handleSubmit = async (values: Record<string, any>) => {
    setIsSaving(true);
    const fechaISO = values.fecha
      ? new Date(values.fecha).toISOString()
      : new Date().toISOString();

    const payload = {
      esVigente: true,
      vehiculoId: values.vehiculoId,
      litrosCargados: parseFloat(values.litrosCargados),
      numeroTicket: values.numeroTicket,
      precioTotal: parseFloat(values.precioTotal),
      fecha: fechaISO,
    };

    try {
      if (editingItem) {
        await cargaDeCombustibleService.actualizarCargaDeCombustible(
          editingItem.id,
          payload
        );
        setMessage({
          text: "Carga de combustible actualizada con éxito",
          severity: "success",
        });
      } else {
        await cargaDeCombustibleService.crearCargaDeCombustible(payload as any);
        setMessage({
          text: "Carga de combustible registrada con éxito",
          severity: "success",
        });
      }
      handleCancel();
      await cargarDatos();
    } catch (error: any) {
      console.error("Error al guardar:", error);
      const errorMessage =
        error?.message || "Error desconocido al guardar la carga.";
      setMessage({
        text: `Error al guardar la carga: ${errorMessage}`,
        severity: "error",
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const campos: Campo[] = useMemo(
    () => [
      {
        tipo: "select",
        nombre: "Vehículo",
        clave: "vehiculoId",
        opciones: vehiculos.map((v) => ({
          id: v.id,
          nombre: `${v.patente} - ${v.marca} ${v.modelo}`,
        })),
        requerido: true,
      },
      {
        tipo: "datetime-local",
        nombre: "Fecha de Carga",
        clave: "fecha",
        requerido: true,
      },
      {
        tipo: "text",
        nombre: "Número de Ticket",
        clave: "numeroTicket",
        requerido: true,
      },
      {
        tipo: "number",
        nombre: "Litros Cargados",
        clave: "litrosCargados",
        requerido: true,
      },
      {
        tipo: "costoBase",
        nombre: "Precio Total",
        clave: "precioTotal",
        requerido: true,
      },
    ],
    [vehiculos]
  );

  const enrichedRows = useMemo(() => {
    const vehiculosMap = new Map(
      vehiculos.map((v) => [v.id, `${v.patente} - ${v.marca} ${v.modelo}`])
    );
    return cargas.map((carga) => ({
      ...carga,
      vehiculoNombre:
        vehiculosMap.get(carga.vehiculoId) || `ID: ${carga.vehiculoId}`,
    }));
  }, [cargas, vehiculos]);

  return (
    <div>
      {!showForm && (
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
            Gestionar Cargas de Combustible
          </Typography>

          <BotonPrimario
            onClick={handleCreateNew}
            disabled={isLoading || isSaving}
            startIcon={<AddIcon />}
          >
            Nueva Carga
          </BotonPrimario>
        </Box>
      )}

      {/* --- INICIO DE LA MODIFICACIÓN --- */}
      {showForm && (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 4 },
              mb: 3,
              borderRadius: "8px",
              backgroundColor: "white",
              width: "100%",
              maxWidth: "900px", // <-- Ancho máximo
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ mb: 3, fontWeight: "bold" }}
            >
              {editingItem ? "Editar Carga" : "Registrar Nueva Carga"}
            </Typography>

            <FormularioDinamico
              campos={campos}
              initialValues={editingItem}
              onSubmit={handleSubmit}
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
                <Button type="submit" variant="contained" disabled={isSaving}>
                  {isSaving ? <CircularProgress size={24} /> : "Guardar"}
                </Button>
              </Box>
            </FormularioDinamico>
          </Paper>
        </Box>
      )}
      {/* --- FIN DE LA MODIFICACIÓN --- */}

      {!showForm &&
        (isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataTable
            entidad="combustible"
            rows={enrichedRows}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            showHistoricoSwitch={true}
            historicoChecked={mostrarHistorico}
            onHistoricoChange={(e) => setMostrarHistorico(e.target.checked)}
            actionsDisabled={isSaving}
          />
        ))}

      <DialogoConfirmacion
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={confirmarEliminacion}
        titulo="Confirmar eliminación"
        descripcion="¿Estás seguro de que deseas eliminar este registro?"
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
