import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import FormularioDinamico, { Campo } from "./FormularioDinamico";
import { Vehiculo } from "../../services/vehiculoService";
import {
  VehiculoDetalle,
  obtenerDetallePorVehiculoId,
  guardarDetalleVehiculo,
} from "../../services/vehiculoDetalleService";

interface Props {
  open: boolean;
  onClose: () => void;
  vehiculos: Vehiculo[];
}

export const GestionarDetallesVehiculo: React.FC<Props> = ({
  open,
  onClose,
  vehiculos,
}) => {
  const [formValues, setFormValues] = useState<any>({});
  const [selectedVehiculoId, setSelectedVehiculoId] = useState("");

  useEffect(() => {
    if (selectedVehiculoId) {
      obtenerDetallePorVehiculoId(selectedVehiculoId)
        .then((data) => setFormValues(data))
        .catch(() => setFormValues({ vehiculoId: selectedVehiculoId }));
    } else {
      setFormValues({});
    }
  }, [selectedVehiculoId]);

  const campos: Campo[] = useMemo(
    () => [
      {
        tipo: "select",
        nombre: "Seleccionar Vehículo",
        clave: "vehiculoId",
        opciones: vehiculos.map((v) => ({
          id: v.id,
          nombre: `${v.patente} - ${v.marca} ${v.modelo}`,
        })),
        requerido: true,
      },
      {
        tipo: "number",
        nombre: "Litros por Tanque",
        clave: "litrosPorTanque",
        requerido: true,
      },
      {
        tipo: "number",
        nombre: "Kilómetros por Tanque",
        clave: "kmPorTanque",
        requerido: true,
      },
      {
        tipo: "text",
        nombre: "Tipo de Combustible (Ej: Diesel)",
        clave: "tipoCombustible",
        requerido: true,
      },
    ],
    [vehiculos]
  );

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      await guardarDetalleVehiculo(values as VehiculoDetalle);
      alert("Datos del vehículo actualizados con éxito");
      onClose();
    } catch (error) {
      alert("Error al guardar los datos");
    }
  };

  const handleValuesChange = (values: Record<string, any>) => {
    setFormValues(values);
    if (values.vehiculoId !== selectedVehiculoId) {
      setSelectedVehiculoId(values.vehiculoId);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Gestionar Datos de Combustible por Vehículo</DialogTitle>
      <DialogContent>
        <FormularioDinamico
          campos={campos}
          initialValues={formValues}
          onSubmit={handleSubmit}
          onValuesChange={handleValuesChange}
        >
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Guardar
          </Button>
        </FormularioDinamico>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};
