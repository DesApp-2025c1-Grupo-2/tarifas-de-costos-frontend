// ruta: src/components/formulario/TarifaForm.tsx

import React, { useState, useEffect, useMemo } from "react";
import FormularioDinamico, { Campo } from "./FormularioDinamico";
import { BotonPrimario } from "../Botones";
import * as tarifaService from "../../services/tarifaService";
import { Tarifa } from "../../services/tarifaService";
import DataTable from "../tablas/tablaDinamica";
import { ModalVerTarifa, TarifaDetallada } from "./adicionales/ModalVerTarifa";
import { ModalVerAdicionales } from "./adicionales/ModalVerAdicionales";
import { CircularProgress, Box, Typography, Alert } from "@mui/material";
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

export const FormCrearTarifa: React.FC = () => {
  const [tarifas, setTarifas] = useState<Tarifa[]>([]);
  const [editingItem, setEditingItem] = useState<Tarifa | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
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
  const [adicionales, setAdicionales] = useState<Adicional[]>([]);

  const cargarTarifas = async () => {
    setIsLoading(true);
    try {
      const data = await tarifaService.obtenerTarifas();
      setTarifas(data.filter((tarifa) => tarifa.esVigente !== false));
    } catch (error) {
      setLoadingError("No se pudieron cargar las tarifas.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCrearClick = async () => {
    try {
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
      setTransportistas(transportistasData);
      setTipoVehiculos(vehiculosData);
      setZonas(zonasData);
      setCargas(cargasData);
      setAdicionales(adicionalesData);
      setEditingItem(null);
      setShowForm(true);
    } catch (error) {
      alert("Error al cargar datos para el formulario. Intente de nuevo.");
    }
  };

  useEffect(() => {
    cargarTarifas();
  }, []);

  const handleSubmit = async (formValues: Record<string, any>) => {
    const payload = {
      nombreTarifa: formValues.nombreTarifa,
      transportista: { id: Number(formValues.transportistaId) },
      tipoVehiculo: { id: Number(formValues.tipoVehiculoId) },
      zonaViaje: { id: Number(formValues.zonaId) },
      tipoCargaTarifa: { id: Number(formValues.tipoCargaId) },
      valorBase: parseFloat(formValues.valorBase || "0"),
      adicionales: (formValues["adicionales"] || []).map((a: any) => ({
        adicional: { id: a.id },
        costoEspecifico: parseFloat(a.precio ?? a.costoDefault ?? "0"),
      })),
      esVigente: true,
    };

    try {
      if (editingItem) {
        // Lógica de actualización (si se implementa)
      } else {
        await tarifaService.crearTarifa(payload);
        setMessage("Tarifa creada con éxito");
      }
      setShowForm(false);
      setEditingItem(null);
      await cargarTarifas();
    } catch (err) {
      setMessage("Error al guardar la tarifa");
      console.error(err);
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleEdit = (tarifa: Tarifa) =>
    alert("La funcionalidad de editar aún no está implementada en el backend.");

  const handleDelete = async (id: number) => {
    if (
      window.confirm("¿Estás seguro de que deseas dar de baja esta tarifa?")
    ) {
      try {
        await tarifaService.eliminarTarifa(id);
        setMessage("Tarifa dada de baja con éxito");
        cargarTarifas();
      } catch (err) {
        setMessage("Error al dar de baja la tarifa");
        console.error(err);
      } finally {
        setTimeout(() => setMessage(""), 3000);
      }
    }
  };

  const handleView = (tarifa: Tarifa) =>
    setViewingTarifa(tarifa as TarifaDetallada);

  const handleMostrarAdicionales = (adicionales: any[]) => {
    setAdicionalesParaVer(adicionales);
  };

  const handleCancel = () => setShowForm(false);

  const camposTarifa: Campo[] = useMemo(
    () => [
      { tipo: "text", nombre: "Nombre de la Tarifa", clave: "nombreTarifa" },
      {
        tipo: "select",
        nombre: "Transportista",
        clave: "transportistaId",
        opciones: transportistas.map((t) => ({
          id: t.id,
          nombre: t.nombreEmpresa,
        })),
      },
      {
        tipo: "select",
        nombre: "Tipo de vehículo",
        clave: "tipoVehiculoId",
        opciones: tipoVehiculos.map((t) => ({ id: t.id, nombre: t.nombre })),
      },
      {
        tipo: "select",
        nombre: "Zona",
        clave: "zonaId",
        opciones: zonas.map((t) => ({ id: t.id, nombre: t.nombre })),
      },
      {
        tipo: "select",
        nombre: "Tipo de carga",
        clave: "tipoCargaId",
        opciones: cargas.map((t) => ({ id: t.id, nombre: t.nombre })),
      },
      {
        tipo: "adicionales",
        nombre: "Adicionales",
        clave: "adicionales",
        opciones: adicionales.map((a) => ({
          id: a.id,
          nombre: a.nombre,
          descripcion: a.descripcion,
          precio: Number(a.costoDefault) || 0,
        })),
      },
      { tipo: "costoBase", nombre: "Costo Base", clave: "valorBase" },
      { tipo: "resultado", nombre: "Subtotal Adicionales:", clave: "add" },
      { tipo: "resultado", nombre: "COSTO TOTAL:", clave: "total" },
    ],
    [transportistas, tipoVehiculos, zonas, cargas, adicionales]
  );

  return (
    <div>
      {!showForm && !isLoading && !loadingError && (
        <BotonPrimario onClick={handleCrearClick}>
          Crear nueva tarifa
        </BotonPrimario>
      )}
      {showForm && (
        <FormularioDinamico
          titulo="Registrar nueva Tarifa"
          campos={camposTarifa}
          onSubmit={handleSubmit}
          modal
          open={showForm}
          onClose={handleCancel}
          initialValues={editingItem}
        />
      )}
      {isLoading ? (
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
        />
      )}
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
    </div>
  );
};
