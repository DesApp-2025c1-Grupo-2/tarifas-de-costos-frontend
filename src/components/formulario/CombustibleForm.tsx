import React, { useEffect, useState, useMemo } from "react";
import FormularioDinamico, { Campo } from "./FormularioDinamico";
import { BotonPrimario } from "../Botones";
import DataTable from "../tablas/tablaDinamica";
import { useCrud } from "../hook/useCrud";
import { CrudService } from "../../services/crudService";
import { CircularProgress, Box, Alert } from "@mui/material";
import { MessageState } from "../hook/useCrud";
import DialogoConfirmacion from "../DialogoConfirmacion";
import * as cargaDeCombustibleService from "../../services/cargaDeCombustibleService";
import { CargaDeCombustible } from "../../services/cargaDeCombustibleService";
import {
  obtenerVehiculo,
  Vehiculo,
} from "../../services/vehiculoService";

export const FormCargaDeCombustible: React.FC = () => {
    const [cargasDeCombustible, setCargasDeCombustible] = useState<CargaDeCombustible[]>([]);
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const [editingItem, setEditingItem] = useState<CargaDeCombustible | null>(null);
    const [idAEliminar, setIdAEliminar] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState<MessageState | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingError, setLoadingError] = useState<string | null>(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [highlightedId, setHighlightedId] = useState<number | null>(null);

    const camposCombustible: Campo[] = useMemo(
        () => [
        {
            tipo: "select",
            nombre: "Vehiculo",
            clave: "vehiculoId",
            opciones: vehiculos.map((t) => ({
            id: t.id,
            nombre: `${t.nombreEmpresa} - ${t.contactoNombre} (${t.cuit})`,
            })),
            requerido: true,
        },
        {
            tipo: "costoBase",
            nombre: "Costo Base",
            clave: "valorBase",
            requerido: true,
        }
        ],
        vehiculos
    );

    const cargarCombustible = async () => {
      setIsLoading(true);
      try {
        const data = await cargaDeCombustibleService.obtenerCargasDeCombustible();
        setCargasDeCombustible(
          data.filter((CargaDeCombustible) => CargaDeCombustible.esVigente !== false)
        );
      } catch (error) {
        setLoadingError("No se pudieron cargar los datos.");
      } finally {
        setIsLoading(false);
      }
    };

  const cargarDependencias = async () => {
      try {
        const [
          vehiculosData
        ] = await Promise.all([
          obtenerVehiculo(),
        ]);
        obtenerVehiculo(vehiculosData.filter((v) => v.activo !== false));
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

    const handleEdit = async (cargaDeCombustible: CargaDeCombustible) => {
      const exito = await cargarDependencias();
      if (exito) {
        setEditingItem(cargaDeCombustible);
        setShowForm(true);
      }
    };
    
    useEffect(() => {
      cargarCombustible();
    }, []);

    const handleSubmit = async (formValues: Record<string, any>) => {
        const payload = {
          nombreTarifa: formValues.nombreTarifa,
          transportista: { id: formValues.transportistaId },
          tipoVehiculo: { id: formValues.tipoVehiculoId },
          zonaViaje: { id: Number(formValues.zonaId) },
          tipoCargaTarifa: { id: Number(formValues.tipoCargaId) },
          valorBase: parseFloat(formValues.valorBase || "0"),
        };
    
        try {
          let changedItem: CargaDeCombustible;
          if (editingItem && editingItem.id) {
            changedItem = await cargaDeCombustibleService.actualizarCargaDeCombustible(
              editingItem.id,
              payload
            );
            setMessage({
              text: "Carga actualizada con éxito",
              severity: "success",
            });
          } else {
            changedItem = await cargaDeCombustibleService.crearCargaDeCombustible(payload);
            setMessage({ text: "Carga creada con éxito", severity: "success" });
          }
          setShowForm(false);
          setEditingItem(null);
          await cargarCombustible();
          await cargarDependencias();
          setHighlightedId(changedItem.id);
          setTimeout(() => setHighlightedId(null), 4000);
        } catch (err) {
          const error = err as Error;
          setMessage({
            text: `Error al guardar la tarifa: ${error.message}`,
            severity: "error",
          });
        } finally {
          setTimeout(() => setMessage(null), 5000);
        }
    };

    const handleDelete = (item: CargaDeCombustible) => {
        setIdAEliminar(item.id);
        setConfirmDialogOpen(true);
      };

    const confirmarEliminacion = async () => {
        if (idAEliminar !== null) {
          try {
            await cargaDeCombustibleService.eliminarCargaDeCombustible(idAEliminar);
            setMessage({
              text: "Carga dada de baja con éxito",
              severity: "success",
            });
            await cargarCombustible();
          } catch (err) {
            setMessage({
              text: "Error al dar de baja la tarifa",
              severity: "error",
            });
          } finally {
            setConfirmDialogOpen(false);
            setIdAEliminar(null);
            setTimeout(() => setMessage(null), 3000);
          }
        }
      };

    const handleCancel = () => {
        setShowForm(false);
        setEditingItem(null);
    };

    const initialFormValues = editingItem
    ? {
        id: editingItem.id,
        vehiculoId: editingItem.vehiculoId?.toString(),
        valorBase: editingItem.valorBase,
      }
    : null;

    return (
    <div>
      {!showForm && !isLoading && !loadingError && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <BotonPrimario onClick={handleCrearClick}>
            Crear nueva carga de combustible
          </BotonPrimario>
        </Box>
      )}
      {showForm && (
        <FormularioDinamico
          titulo={editingItem ? "Editar Carga" : "Registrar nueva Carga de Combustible"}
          campos={camposCombustible}
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
          rows={cargasDeCombustible}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          highlightedId={highlightedId}
        />
      )}
      <DialogoConfirmacion
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={confirmarEliminacion}
        titulo="Confirmar baja de Carga"
        descripcion="¿Estás seguro de que deseas dar de baja esta carga?"
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

}