import React, { useState, useEffect, useMemo, useCallback } from "react";
import FormularioDinamico, { Campo } from "./FormularioDinamico";
import { BotonPrimario } from "../Botones";
import * as tarifaService from "../../services/tarifaService";
import { Tarifa } from "../../services/tarifaService";
import DataTable from "../tablas/tablaDinamica";
import DialogoConfirmacion from "../DialogoConfirmacion";
import { ModalVerTarifa, TarifaDetallada } from "./adicionales/ModalVerTarifa";
import { ModalVerAdicionales } from "./adicionales/ModalVerAdicionales";
import {
  CircularProgress,
  Box,
  Alert,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  obtenerTransportistas,
  Transportista,
} from "../../services/transportistaService";
import {
  obtenerTiposVehiculo,
  TipoVehiculo,
} from "../../services/tipoVehiculoService";
import { obtenerZonas, ZonaViaje } from "../../services/zonaService";
import { obtenerCargas, Carga } from "../../services/cargaService";
import { obtenerAdicionales, Adicional } from "../../services/adicionalService";
import { MessageState } from "../hook/useCrud";
import { ModalHistorialTarifa } from "./adicionales/ModalHistorialTarifa";

const getISODate30DaysAgo = () => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().split("T")[0];
};

export const FormCrearTarifa: React.FC = () => {
  const [tarifas, setTarifas] = useState<Tarifa[]>([]);
  const [editingItem, setEditingItem] = useState<Tarifa | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<MessageState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [viewingTarifa, setViewingTarifa] = useState<TarifaDetallada | null>(
    null
  );
  const [adicionalesParaVer, setAdicionalesParaVer] = useState<any[] | null>(
    null
  );
  const [transportistas, setTransportistas] = useState<Transportista[]>([]);
  const [tipoVehiculos, setTipoVehiculos] = useState<TipoVehiculo[]>([]);
  const [zonas, setZonas] = useState<ZonaViaje[]>([]);
  const [cargas, setCargas] = useState<Carga[]>([]);
  const [adicionalesDb, setAdicionalesDb] = useState<Adicional[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState<number | null>(null);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [historialTarifaId, setHistorialTarifaId] = useState<number | null>(
    null
  );
  const [dependenciasCargadas, setDependenciasCargadas] = useState(false);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  const cargarTarifas = useCallback(async () => {
    setIsLoading(true);
    setLoadingError(null);
    try {
      const fechaInicio = mostrarHistorico ? undefined : getISODate30DaysAgo();
      const data = await tarifaService.obtenerTarifas(fechaInicio);

      const tarifasConTotal = data.map((tarifa) => ({
        ...tarifa,
        total:
          (tarifa.valorBase || 0) +
          (tarifa.adicionales || []).reduce(
            (acc: number, ad: any) => acc + (ad.costoEspecifico || 0),
            0
          ),
      }));
      setTarifas(
        tarifasConTotal.filter((tarifa) => tarifa.esVigente !== false)
      );
    } catch (error) {
      setLoadingError("No se pudieron cargar las tarifas.");
    } finally {
      setIsLoading(false);
    }
  }, [mostrarHistorico]);

  const cargarDependencias = async () => {
    try {
      setIsLoading(true);
      const [
        transportistasData,
        vehiculosData,
        zonasData,
        cargasData,
        adicionalesData,
      ] = await Promise.all([
        obtenerTransportistas(),
        obtenerTiposVehiculo(),
        obtenerZonas(),
        obtenerCargas(),
        obtenerAdicionales(),
      ]);
      setTransportistas(transportistasData.filter((t) => t.activo !== false));
      setTipoVehiculos(
        vehiculosData.filter((v) => v.activo !== false && !v.deletedAt)
      );
      setZonas(zonasData.filter((z) => z.activo));
      setCargas(cargasData.filter((c) => c.activo));
      setAdicionalesDb(adicionalesData.filter((a) => a.activo && !a.esGlobal));
      setDependenciasCargadas(true);
    } catch (error) {
      setMessage({
        text: "Error al cargar datos para el formulario. Intente de nuevo.",
        severity: "error",
      });
    }
    // No quitamos isLoading aquí
  };

  useEffect(() => {
    cargarTarifas();
  }, [cargarTarifas]);

  useEffect(() => {
    cargarDependencias();
  }, []);

  const handleCrearClick = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (tarifa: Tarifa) => {
    setEditingItem(tarifa);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleSubmit = async (formValues: Record<string, any>) => {
    setIsSaving(true);
    setMessage(null);
    const adicionalesPayload = (formValues["adicionales"] || []).map(
      (a: any) => {
        const adicionalData: any = {
          adicional: {
            nombre: a.nombre,
            descripcion: a.descripcion,
            costoDefault: a.precio,
            activo: true,
            esGlobal: a.esGlobal === true,
          },
          costoEspecifico: parseFloat(a.costoEspecifico ?? a.precio ?? "0"),
        };
        if (a.id > 0) {
          adicionalData.adicional.id = a.id;
        }
        return adicionalData;
      }
    );

    const payload = {
      nombreTarifa: formValues.nombreTarifa,
      transportistaId: formValues.transportistaId,
      tipoVehiculoId: formValues.tipoVehiculoId,
      zonaViaje: { id: Number(formValues.zonaId || 0) },
      tipoCargaTarifa: { id: Number(formValues.tipoCargaId || 0) },
      valorBase: parseFloat(formValues.valorBase || "0"),
      adicionales: adicionalesPayload,
      esVigente: editingItem ? editingItem.esVigente ?? true : true,
    };

    if (
      !payload.transportistaId ||
      !payload.tipoVehiculoId ||
      !payload.zonaViaje.id ||
      !payload.tipoCargaTarifa.id
    ) {
      setMessage({
        text: "Transportista, Vehículo, Zona y Carga son obligatorios.",
        severity: "error",
      });
      setIsSaving(false);
      return;
    }
    if (payload.valorBase <= 0) {
      setMessage({
        text: "El Costo Base debe ser mayor a cero.",
        severity: "error",
      });
      setIsSaving(false);
      return;
    }

    try {
      let changedItem: Tarifa;
      if (editingItem && editingItem.id) {
        changedItem = await tarifaService.actualizarTarifa(
          editingItem.id,
          payload
        );
        setMessage({
          text: "Tarifa actualizada con éxito",
          severity: "success",
        });
      } else {
        changedItem = await tarifaService.crearTarifa(payload);
        setMessage({ text: "Tarifa creada con éxito", severity: "success" });
      }
      handleCancel();
      await cargarTarifas();
      setHighlightedId(changedItem.id);
      setTimeout(() => setHighlightedId(null), 4000);
    } catch (err) {
      const error = err as Error;
      console.error("Error al guardar tarifa:", error);
      setMessage({
        text: `Error al guardar la tarifa: ${error.message}`,
        severity: "error",
      });
    } finally {
      setIsSaving(false);
      if (message?.severity !== "error") {
        setTimeout(() => setMessage(null), 5000);
      }
    }
  };

  const handleView = (tarifa: Tarifa) =>
    setViewingTarifa(tarifa as TarifaDetallada);

  const handleMostrarAdicionales = (adicionales: any[]) => {
    setAdicionalesParaVer(adicionales);
  };

  const handleDelete = (item: Tarifa) => {
    setIdAEliminar(item.id);
    setConfirmDialogOpen(true);
  };

  const confirmarEliminacion = async () => {
    if (idAEliminar !== null) {
      setIsSaving(true);
      try {
        await tarifaService.eliminarTarifa(idAEliminar);
        setMessage({
          text: "Tarifa dada de baja con éxito",
          severity: "success",
        });
        await cargarTarifas();
      } catch (err) {
        setMessage({
          text: "Error al dar de baja la tarifa",
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

  const handleMostrarHistorial = (tarifaId: number) => {
    setHistorialTarifaId(tarifaId);
  };

  const handleCerrarHistorial = () => {
    setHistorialTarifaId(null);
  };

  const camposTarifa: Campo[] = useMemo(
    () => [
      {
        tipo: "text",
        nombre: "Nombre de la Tarifa",
        clave: "nombreTarifa",
        requerido: true,
      },
      {
        tipo: "select",
        nombre: "Transportista",
        clave: "transportistaId",
        opciones: transportistas.map((t) => ({
          id: t.id,
          nombre: `${t.nombre_comercial} (${t.cuit})`,
        })),
        requerido: true,
      },
      {
        tipo: "select",
        nombre: "Tipo de vehículo",
        clave: "tipoVehiculoId",
        opciones: tipoVehiculos.map((t) => ({ id: t.id, nombre: t.nombre })),
        requerido: true,
      },
      {
        tipo: "select",
        nombre: "Zona",
        clave: "zonaId",
        opciones: zonas.map((t) => ({ id: t.id, nombre: t.nombre })),
        requerido: true,
      },
      {
        tipo: "select",
        nombre: "Tipo de carga",
        clave: "tipoCargaId",
        opciones: cargas.map((t) => ({ id: t.id, nombre: t.nombre })),
        requerido: true,
      },
      {
        tipo: "costoBase",
        nombre: "Costo Base",
        clave: "valorBase",
        requerido: true,
      },
      {
        tipo: "adicionales",
        nombre: "Adicionales",
        clave: "adicionales",
        opciones: adicionalesDb.map((a) => ({
          id: a.id,
          nombre: a.nombre,
          descripcion: a.descripcion,
          precio: Number(a.costoDefault) || 0,
          esGlobal: a.esGlobal,
        })),
      },
      { tipo: "resultado", nombre: "COSTO TOTAL:", clave: "total" },
    ],
    [transportistas, tipoVehiculos, zonas, cargas, adicionalesDb]
  );

  const initialFormValues = editingItem
    ? {
        id: editingItem.id,
        nombreTarifa: editingItem.nombreTarifa,
        transportistaId: String(editingItem.transportistaId || ""),
        tipoVehiculoId: String(editingItem.tipoVehiculoId || ""),
        zonaId: String(editingItem.zonaId || ""),
        tipoCargaId: String(editingItem.tipoCargaId || ""),
        valorBase: editingItem.valorBase,
        adicionales:
          editingItem.adicionales?.map((ad) => ({
            id: ad.adicional.id,
            nombre: ad.adicional.nombre,
            descripcion: ad.adicional.descripcion,
            precio: ad.adicional.costoDefault,
            costoEspecifico: ad.costoEspecifico,
            esGlobal:
              adicionalesDb.find((adb) => adb.id === ad.adicional.id)
                ?.esGlobal ?? false,
          })) || [],
      }
    : null;

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
              ? "Editar Tarifa"
              : "Registrar nueva Tarifa"
            : "Gestionar Tarifas"}
        </Typography>

        {!showForm && !isLoading && !loadingError && (
          <BotonPrimario
            onClick={handleCrearClick}
            disabled={!dependenciasCargadas || isSaving}
            startIcon={<AddIcon />}
          >
            Nueva Tarifa
          </BotonPrimario>
        )}
      </Box>

      {/* --- INICIO DE LA MODIFICACIÓN --- */}
      {showForm && (
        <Box sx={{ width: "100%" }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 4 },
              mb: 3,
              borderRadius: "8px",
              backgroundColor: "white",
              width: "100%",
              // maxWidth: "900px", // <-- ELIMINADO DE AQUÍ
            }}
          >
            {/* Box interno para centrar y limitar el ancho del formulario */}
            <Box sx={{ maxWidth: "900px", margin: "0 auto" }}>
              <FormularioDinamico
                campos={camposTarifa}
                onSubmit={handleSubmit}
                initialValues={initialFormValues}
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
                    disabled={isSaving || !dependenciasCargadas}
                  >
                    {isSaving ? <CircularProgress size={24} /> : "Guardar"}
                  </Button>
                </Box>
              </FormularioDinamico>
            </Box>
          </Paper>
        </Box>
      )}
      {/* --- FIN DE LA MODIFICACIÓN --- */}

      {!showForm &&
        (isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : loadingError ? (
          <Alert severity="error">{loadingError}</Alert>
        ) : (
          <DataTable
            entidad="tarifa"
            rows={tarifas}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleView={handleView}
            handleMostrarAdicionales={handleMostrarAdicionales}
            handleMostrarHistorial={handleMostrarHistorial}
            highlightedId={highlightedId}
            actionsDisabled={!dependenciasCargadas || isSaving}
            showHistoricoSwitch={true}
            historicoChecked={mostrarHistorico}
            onHistoricoChange={(e) => setMostrarHistorico(e.target.checked)}
          />
        ))}

      <ModalVerTarifa
        open={!!viewingTarifa}
        onClose={() => setViewingTarifa(null)}
        tarifa={viewingTarifa}
      />
      <ModalVerAdicionales
        open={!!adicionalesParaVer}
        onClose={() => setAdicionalesParaVer(null)}
        adicionales={adicionalesParaVer || []}
      />
      <DialogoConfirmacion
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={confirmarEliminacion}
        titulo="Confirmar baja de tarifa"
        descripcion="¿Estás seguro de que deseas dar de baja esta tarifa?"
        textoConfirmar="Dar de Baja"
      />
      <ModalHistorialTarifa
        open={!!historialTarifaId}
        onClose={handleCerrarHistorial}
        tarifaId={historialTarifaId}
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
