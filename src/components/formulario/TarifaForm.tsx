// ruta: src/components/formulario/TarifaForm.tsx

import React, { useState, useEffect, useMemo } from "react";
import FormularioDinamico, { Campo } from "./FormularioDinamico";
import { BotonPrimario } from "../Botones";
import * as tarifaService from "../../services/tarifaService";
import { Tarifa } from "../../services/tarifaService";
import DataTable from "../tablas/tablaDinamica";
import { ModalVerTarifa, TarifaDetallada } from "./adicionales/ModalVerTarifa";
import { ModalVerAdicionales } from "./adicionales/ModalVerAdicionales";
import { CircularProgress, Box, Alert } from "@mui/material";
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
  const [adicionalesDb, setAdicionalesDb] = useState<Adicional[]>([]);

  const cargarTarifas = async () => {
    setIsLoading(true);
    try {
      const data = await tarifaService.obtenerTarifas();
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
  };

  const cargarDependencias = async () => {
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
      setAdicionalesDb(adicionalesData);
      return true;
    } catch (error) {
      alert("Error al cargar datos para el formulario. Intente de nuevo.");
      return false;
    }
  };

  const handleCrearClick = async () => {
    const exito = await cargarDependencias();
    if (exito) {
      setEditingItem(null);
      setShowForm(true);
    }
  };

  const handleEdit = async (tarifa: Tarifa) => {
    const exito = await cargarDependencias();
    if (exito) {
      setEditingItem(tarifa);
      setShowForm(true);
    }
  };

  useEffect(() => {
    cargarTarifas();
  }, []);

  // --- INICIO DE LA MODIFICACIÓN ---
  // Se ajusta el payload para que envíe el objeto 'adicional' completo
  const handleSubmit = async (formValues: Record<string, any>) => {
    const payload = {
      nombreTarifa: formValues.nombreTarifa,
      transportista: { id: Number(formValues.transportistaId) },
      tipoVehiculo: { id: Number(formValues.tipoVehiculoId) },
      zonaViaje: { id: Number(formValues.zonaId) },
      tipoCargaTarifa: { id: Number(formValues.tipoCargaId) },
      valorBase: parseFloat(formValues.valorBase || "0"),
      // Ahora se envía el objeto completo del adicional
      adicionales: (formValues["adicionales"] || []).map((a: any) => ({
        adicional: {
          id: a.id,
          nombre: a.nombre,
          descripcion: a.descripcion,
          costoDefault: a.precio,
        },
        costoEspecifico: parseFloat(a.costoEspecifico ?? a.precio ?? "0"),
      })),
    };

    try {
      if (editingItem && editingItem.id) {
        await tarifaService.actualizarTarifa(editingItem.id, payload);
        setMessage("Tarifa actualizada con éxito");
      } else {
        await tarifaService.crearTarifa(payload);
        setMessage("Tarifa creada con éxito");
      }
      setShowForm(false);
      setEditingItem(null);
      await cargarTarifas(); // Recarga las tarifas para mostrar los cambios
      await cargarDependencias(); // Recarga los adicionales por si se creó uno nuevo
    } catch (err) {
      const error = err as Error;
      setMessage(`Error al guardar la tarifa: ${error.message}`);
      console.error(err);
    } finally {
      setTimeout(() => setMessage(""), 5000);
    }
  };
  // --- FIN DE LA MODIFICACIÓN ---

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleView = (tarifa: Tarifa) =>
    setViewingTarifa(tarifa as TarifaDetallada);

  const handleMostrarAdicionales = (adicionales: any[]) => {
    setAdicionalesParaVer(adicionales);
  };

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
      { tipo: "costoBase", nombre: "Costo Base", clave: "valorBase" },
      {
        tipo: "adicionales",
        nombre: "Adicionales",
        clave: "adicionales",
        opciones: adicionalesDb.map((a) => ({
          id: a.id,
          nombre: a.nombre,
          descripcion: a.descripcion,
          precio: Number(a.costoDefault) || 0,
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
        transportistaId: editingItem.transportistaId?.toString(),
        tipoVehiculoId: editingItem.tipoVehiculoId?.toString(),
        zonaId: editingItem.zonaId?.toString(),
        tipoCargaId: editingItem.tipoCargaId?.toString(),
        valorBase: editingItem.valorBase,
        adicionales:
          editingItem.adicionales?.map((ad) => ({
            id: ad.adicional.id,
            nombre: ad.adicional.nombre,
            descripcion: ad.adicional.descripcion,
            precio: ad.adicional.costoDefault,
            costoEspecifico: ad.costoEspecifico,
          })) || [],
      }
    : null;

  return (
    <div>
      {!showForm && !isLoading && !loadingError && (
        <BotonPrimario onClick={handleCrearClick}>
          Crear nueva tarifa
        </BotonPrimario>
      )}
      {showForm && (
        <FormularioDinamico
          titulo={editingItem ? "Editar Tarifa" : "Registrar nueva Tarifa"}
          campos={camposTarifa}
          onSubmit={handleSubmit}
          modal
          open={showForm}
          onClose={handleCancel}
          initialValues={initialFormValues}
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
