// Archivo: src/components/reportes/ReporteUsoCombustible.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  TextField,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  LinearProgress, // <-- IMPORTAR LinearProgress
} from "@mui/material";
import { obtenerVehiculo, Vehiculo } from "../../services/vehiculoService";
import {
  getReporteUsoCombustible,
  ReporteVehiculoCombustible,
} from "../../services/reporteService";

const formatCurrency = (value: number | undefined) => {
  const number = Number(value) || 0;
  return `$${number.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

// --- FUNCIÓN PARA FORMATEAR LITROS ---
const formatLitros = (value: number | undefined) => {
  const number = Number(value) || 0;
  return `${number.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  })} Lts`;
};
// --- FIN FUNCIÓN LITROS ---

const ReporteUsoCombustible: React.FC = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [selectedVehiculoId, setSelectedVehiculoId] = useState<string>("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [reporte, setReporte] = useState<ReporteVehiculoCombustible | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingFiltros, setLoadingFiltros] = useState(true);

  // --- Constante para la escala de la barra ---
  const MAX_KM_PER_LITRO = 20; // Define un valor máximo razonable para tu tipo de vehículo

  useEffect(() => {
    const cargarVehiculos = async () => {
      try {
        const data = await obtenerVehiculo();
        setVehiculos(data.filter((v) => !v.deletedAt && v.activo !== false));
      } catch (err) {
        setError("No se pudieron cargar los vehículos.");
      } finally {
        setLoadingFiltros(false);
      }
    };
    cargarVehiculos();
  }, []);

  const handleGenerarReporte = async () => {
    if (!selectedVehiculoId || !fechaInicio || !fechaFin) {
      setError("Debe seleccionar un vehículo y un rango de fechas.");
      return;
    }
    setLoading(true);
    setError(null);
    setReporte(null);

    try {
      const data = await getReporteUsoCombustible(
        selectedVehiculoId,
        fechaInicio,
        fechaFin
      );
      setReporte(data);
    } catch (err: any) {
      if (err.message.includes("204")) {
         setError("No se encontraron datos de viajes ni de combustible en el período seleccionado.");
      } else {
        setError(err.message || "Ocurrió un error al generar el reporte de combustible.");
      }
      console.error("Error al generar reporte:", err);
    } finally {
      setLoading(false);
    }
  };


  const formatKilometros = (value: number | undefined) => {
    const number = Number(value) || 0;
    return `${number.toLocaleString("es-AR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    })} Km`;
  };

  // --- CÁLCULO DE KM/L ---
  const kmPorLitro = reporte?.litrosTotales && reporte.litrosTotales > 0
    ? (reporte.totalKilometros || 0) / reporte.litrosTotales
    : 0;

  // Normalizar para la barra de progreso (0 a 100)
  const progressValue = Math.min((kmPorLitro / MAX_KM_PER_LITRO) * 100, 100);
  // --- FIN CÁLCULO KM/L ---

  return (
    <Paper sx={{ padding: 3, marginTop: 2 }}>
      <Typography variant="h6" gutterBottom>
        Análisis de Uso de Combustible y Viajes
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <FormControl
          size="small"
          sx={{ minWidth: 200, flexGrow: 1, maxWidth: 300 }}
        >
          <InputLabel id="vehiculo-select-label">Vehículo</InputLabel>
          <Select
            labelId="vehiculo-select-label"
            value={selectedVehiculoId}
            label="Vehículo"
            onChange={(e: SelectChangeEvent) =>
              setSelectedVehiculoId(e.target.value as string)
            }
            disabled={loadingFiltros}
          >
            {vehiculos.map((v) => (
              <MenuItem key={v.id} value={v.id}>
                {v.patente} - {v.marca} {v.modelo}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Fecha de Inicio"
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
        <TextField
          label="Fecha de Fin"
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
        <Button
          variant="contained"
          onClick={handleGenerarReporte}
          disabled={loading || loadingFiltros || !selectedVehiculoId}
          sx={{ height: "40px", minWidth: "150px" }}
        >
          {loading ? <CircularProgress size={24} /> : "Generar Reporte"}
        </Button>
      </Box>

      {(loading || loadingFiltros) && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="info" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {reporte && !loading && (
        <> {/* <-- Envolver en Fragment para añadir la nueva tarjeta */}
          <Paper variant="outlined" sx={{ p: 3, mt: 3, mb: 3 }}> 
            <Typography variant="h5" gutterBottom>
              Reporte para {reporte.vehiculoPatente}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Período analizado"
                  secondary={`${reporte.fechaInicio} a ${reporte.fechaFin}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Total de Viajes Realizados"
                  secondary={reporte.cantidadViajes.toLocaleString()}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Kilómetros Totales Recorridos"
                  secondary={formatKilometros(reporte.totalKilometros)}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Total de Cargas de Combustible"
                  secondary={reporte.cantidadCargasCombustible.toLocaleString()}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Costo Total de Combustible"
                  secondary={formatCurrency(reporte.costoTotalCombustible)}
                />
              </ListItem>
            </List>
          </Paper>

          <Paper variant="outlined" sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Eficiencia de Combustible
            </Typography>
            <Divider sx={{ my: 1 }} />
            <List dense>
               <ListItem>
                 <ListItemText
                   primary="Kilómetros Recorridos"
                   secondary={formatKilometros(reporte.totalKilometros)}
                 />
               </ListItem>
               <ListItem>
                 <ListItemText
                   primary="Litros Cargados"
                   secondary={formatLitros(reporte.litrosTotales)}
                 />
               </ListItem>
            </List>
            <Box sx={{ mt: 2 }}>
               <Typography variant="body1" gutterBottom>
                 Consumo Promedio:
               </Typography>
               <Typography variant="h5" color="primary" sx={{ mb: 1 }}>
                 {kmPorLitro.toFixed(1)} Km/L
               </Typography>
               <Box sx={{ width: '100%', mr: 1 }}>
                 <LinearProgress variant="determinate" value={progressValue} />
               </Box>
               <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">0 Km/L</Typography>
                  <Typography variant="caption" color="text.secondary">{MAX_KM_PER_LITRO} Km/L</Typography>
               </Box>
            </Box>
          </Paper>

        </>
      )}
    </Paper>
  );
};

export default ReporteUsoCombustible;