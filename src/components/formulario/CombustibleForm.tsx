import React, { useEffect, useState, useMemo } from "react";
import {
  Link,
  CircularProgress,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import FormularioDinamico, { Campo } from "./FormularioDinamico";
import { Resultado } from "./Campos";
import { BotonPrimario } from "../Botones";
import DataTable from "../tablas/tablaDinamica";
import * as cargaDeCombustibleService from "../../services/cargaDeCombustibleService";
import { CargaDeCombustible } from "../../services/cargaDeCombustibleService";
import { obtenerVehiculo, Vehiculo } from "../../services/vehiculoService";
import { MessageState } from "../hook/useCrud";
import DialogoConfirmacion from "../DialogoConfirmacion";
import {
  VehiculoDetalle,
  obtenerDetallePorVehiculoId,
  guardarDetalleVehiculo,
} from "../../services/vehiculoDetalleService";

interface GestionarDetallesProps {
  open: boolean;
  onClose: () => void;
  vehiculos: Vehiculo[];
  onSave: () => void;
}

const GestionarDetallesVehiculo: React.FC<GestionarDetallesProps> = ({
  open,
  onClose,
  vehiculos,
  onSave,
}) => {
  const [formValues, setFormValues] = useState<any>({});
  const [selectedVehiculoId, setSelectedVehiculoId] = useState("");

  useEffect(() => {
    if (selectedVehiculoId) {
      obtenerDetallePorVehiculoId(selectedVehiculoId)
        .then((data) => setFormValues(data))
        .catch(() => setFormValues({ vehiculoId: selectedVehiculoId }));
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
        tipo: "select",
        nombre: "Tipo de Combustible",
        clave: "tipoCombustible",
        opciones: [
          { id: "Nafta", nombre: "Nafta" },
          { id: "Diesel", nombre: "Diesel" },
          { id: "GNC", nombre: "GNC" },
        ],
        requerido: true,
      },
    ],
    [vehiculos]
  );

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      await guardarDetalleVehiculo(values as VehiculoDetalle);
      alert("Datos del vehículo actualizados con éxito");
      onSave();
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
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, alignSelf: "center" }}
          >
            Guardar Datos
          </Button>
        </FormularioDinamico>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

interface CrearCargaProps {
  open: boolean;
  onClose: () => void;
  vehiculos: Vehiculo[];
  onSave: () => void;
}

const CrearCargaCombustibleModal: React.FC<CrearCargaProps> = ({
  open,
  onClose,
  vehiculos,
  onSave,
}) => {
  const [formValues, setFormValues] = useState<any>({});
  const [vehiculoDetalle, setVehiculoDetalle] =
    useState<VehiculoDetalle | null>(null);
  const [kmEstimados, setKmEstimados] = useState(0);
  const [costoCalculado, setCostoCalculado] = useState(0);

  useEffect(() => {
    const fetchDetalle = async () => {
      if (formValues.vehiculoId) {
        try {
          const detalle = await obtenerDetallePorVehiculoId(
            formValues.vehiculoId
          );
          setVehiculoDetalle(detalle);
        } catch (error) {
          console.warn(
            "Este vehículo no tiene detalles de combustible cargados."
          );
          setVehiculoDetalle(null);
        }
      } else {
        setVehiculoDetalle(null);
      }
    };
    fetchDetalle();
  }, [formValues.vehiculoId]);

  useEffect(() => {
    if (
      vehiculoDetalle &&
      formValues.cantidadTanques > 0 &&
      formValues.precioPorLitro > 0
    ) {
      const litrosTotales =
        formValues.cantidadTanques * vehiculoDetalle.litrosPorTanque;
      const km = formValues.cantidadTanques * vehiculoDetalle.kmPorTanque;
      const costo = litrosTotales * formValues.precioPorLitro;
      setKmEstimados(km);
      setCostoCalculado(costo);
    } else {
      setKmEstimados(0);
      setCostoCalculado(0);
    }
  }, [formValues.cantidadTanques, formValues.precioPorLitro, vehiculoDetalle]);

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
        nombre: "Cantidad de Tanques",
        clave: "cantidadTanques",
        requerido: true,
      },
      {
        tipo: "number",
        nombre: "Precio por Litro",
        clave: "precioPorLitro",
        requerido: true,
      },
    ],
    [vehiculos]
  );

  const handleSubmit = async (values: Record<string, any>) => {
    const payload = {
      esVigente: true,
      vehiculoId: values.vehiculoId,
      cantidadTanques: parseInt(values.cantidadTanques, 10),
      precioPorLitro: parseFloat(values.precioPorLitro),
      costoTotal: costoCalculado,
      fecha: new Date().toISOString(),
    };
    try {
      await cargaDeCombustibleService.crearCargaDeCombustible(
        payload as Omit<CargaDeCombustible, "id">
      );
      alert("Carga de combustible registrada con éxito");
      onSave();
      onClose();
    } catch (error) {
      alert("Error al registrar la carga");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Registrar Nueva Carga de Combustible</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
          <Link href="https://naftas.com.ar/" target="_blank" rel="noopener">
            <BotonPrimario>Consultar Precios de Combustible</BotonPrimario>
          </Link>
        </Box>
        <FormularioDinamico
          campos={campos}
          initialValues={formValues}
          onSubmit={handleSubmit}
          onValuesChange={setFormValues}
        >
          <Resultado
            nombre="KM a realizar (Estimado):"
            value={kmEstimados.toFixed(2)}
          />
          <Resultado
            nombre="Costo Total (Calculado):"
            value={costoCalculado.toFixed(2)}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, alignSelf: "center" }}
          >
            Registrar Carga
          </Button>
        </FormularioDinamico>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export const FormCargaDeCombustible: React.FC = () => {
  const [cargas, setCargas] = useState<CargaDeCombustible[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<MessageState | null>(null);

  const [modalDetallesAbierto, setModalDetallesAbierto] = useState(false);
  const [modalCargaAbierto, setModalCargaAbierto] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState<number | null>(null);

  const cargarDatos = async () => {
    setIsLoading(true);
    try {
      const [cargasData, vehiculosData] = await Promise.all([
        cargaDeCombustibleService.obtenerCargasDeCombustible(),
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
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleDelete = (item: any) => {
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
        await cargarDatos();
      } catch (err) {
        setMessage({
          text: "Error al dar de baja la carga",
          severity: "error",
        });
      } finally {
        setConfirmDialogOpen(false);
        setIdAEliminar(null);
        setTimeout(() => setMessage(null), 3000);
      }
    }
  };

  const enrichedRows = useMemo(() => {
    const vehiculosMap = new Map(
      vehiculos.map((v) => [v.id, `${v.patente} - ${v.marca} ${v.modelo}`])
    );
    return cargas.map((carga) => ({
      ...carga,
      vehiculoNombre:
        vehiculosMap.get(carga.vehiculoId) || `ID: ${carga.vehiculoId}`,
      fecha: new Date(carga.fecha).toLocaleString("es-AR"),
    }));
  }, [cargas, vehiculos]);

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3 }}>
        <BotonPrimario
          onClick={() => setModalDetallesAbierto(true)}
          disabled={isLoading}
        >
          Actualizar Datos de Vehículo
        </BotonPrimario>
        <BotonPrimario
          onClick={() => setModalCargaAbierto(true)}
          disabled={isLoading}
        >
          Crear Carga de Combustible
        </BotonPrimario>
      </Box>

      {modalDetallesAbierto && (
        <GestionarDetallesVehiculo
          open={modalDetallesAbierto}
          onClose={() => setModalDetallesAbierto(false)}
          vehiculos={vehiculos}
          onSave={cargarDatos}
        />
      )}

      {modalCargaAbierto && (
        <CrearCargaCombustibleModal
          open={modalCargaAbierto}
          onClose={() => setModalCargaAbierto(false)}
          vehiculos={vehiculos}
          onSave={cargarDatos}
        />
      )}

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataTable
          entidad="combustible"
          rows={enrichedRows}
          handleDelete={handleDelete}
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
};
