import React, { useState, useEffect, useMemo } from "react";
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
  Autocomplete,
} from "@mui/material";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Dot, // Importar Dot
  DotProps, // Importar DotProps
} from "recharts";
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

const formatLitros = (value: number | undefined | null) => {
  if (value === null || value === undefined) return "N/A";
  const number = Number(value) || 0;
  return `${number.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  })} Lts`;
};

const formatKilometros = (value: number | undefined | null) => {
  if (value === null || value === undefined) return "N/A";
  const number = Number(value) || 0;
  return `${number.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  })} Km`;
};

type ChartDataPoint = {
  fecha: string;
  km_diario: number | null;
  km_acumulado: number;
  litros: number | null;
};

// --- FUNCIÓN HELPER CORREGIDA ---
interface CustomDotProps extends DotProps {
  payload?: ChartDataPoint;
}

const renderTripDot = (props: CustomDotProps) => {
  const { cx, cy, payload, key } = props;

  // Comprobar que el payload existe y que km_diario es positivo
  if (payload && payload.km_diario && payload.km_diario > 0) {
    return (
      <Dot
        key={key} // Usar la key provista
        cx={cx}
        cy={cy}
        r={5}
        stroke="#E65F2B"
        fill="#fff"
        strokeWidth={2}
      />
    );
  }

  // Devolver un elemento SVG vacío (un grupo) en lugar de null
  return <g key={key} />;
};
// --- FIN FUNCIÓN HELPER ---

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
      if (
        (!data.viajes || data.viajes.length === 0) &&
        (!data.cargas || data.cargas.length === 0)
      ) {
        setError(
          "No se encontraron viajes ni cargas de combustible en el período seleccionado para graficar."
        );
      }
    } catch (err: any) {
      if (err.message.includes("204")) {
        setError(
          "No se encontraron datos de viajes ni de combustible en el período seleccionado."
        );
      } else {
        setError(
          err.message ||
            "Ocurrió un error al generar el reporte de combustible."
        );
      }
      console.error("Error al generar reporte:", err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = useMemo((): ChartDataPoint[] => {
    if (!reporte || !fechaInicio || !fechaFin) {
      return [];
    }

    const dataMap = new Map<string, { km: number; litros: number }>();

    (reporte.viajes || []).forEach((viaje) => {
      const fecha = viaje.fecha;
      const existing = dataMap.get(fecha) || { km: 0, litros: 0 };
      existing.km += viaje.km;
      dataMap.set(fecha, existing);
    });

    (reporte.cargas || []).forEach((carga) => {
      const fecha = carga.fecha;
      const existing = dataMap.get(fecha) || { km: 0, litros: 0 };
      existing.litros += carga.litros;
      dataMap.set(fecha, existing);
    });

    const finalData: ChartDataPoint[] = [];
    const startDate = new Date(fechaInicio + "T00:00:00");
    const endDate = new Date(fechaFin + "T00:00:00");
    let kmAcumulado = 0;

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const fechaISO = d.toISOString().split("T")[0];
      const event = dataMap.get(fechaISO);

      const kmDiario = event && event.km > 0 ? event.km : null;
      const litrosDiarios = event && event.litros > 0 ? event.litros : null;

      if (kmDiario !== null) {
        kmAcumulado += kmDiario;
      }

      finalData.push({
        fecha: fechaISO,
        km_diario: kmDiario,
        km_acumulado: kmAcumulado,
        litros: litrosDiarios,
      });
    }

    return finalData;
  }, [reporte, fechaInicio, fechaFin]);

  const kmPorLitro =
    reporte?.litrosTotales && reporte.litrosTotales > 0
      ? (reporte.totalKilometros || 0) / reporte.litrosTotales
      : 0;

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
          <InputLabel id="vehiculo-select-label"></InputLabel>
          <Autocomplete
            options={vehiculos}
            getOptionLabel={(option) =>
              `${option.patente} - ${option.marca} ${option.modelo}` || ""
            }
            value={vehiculos.find((v) => v.id === selectedVehiculoId) || null}
            onChange={(_, newValue: Vehiculo | null) => {
              setSelectedVehiculoId(newValue ? newValue.id : "");
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField {...params} label="Vehículo" size="small" />
            )}
            disabled={loadingFiltros}
            sx={{ minWidth: 200, flexGrow: 1, maxWidth: 300 }}
            size="small"
          />
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
        <>
          <Paper variant="outlined" sx={{ p: 3, mt: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Resumen para {reporte.vehiculoPatente}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Período analizado: {reporte.fechaInicio} a {reporte.fechaFin}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ textAlign: "center", p: 1 }}>
                <Typography variant="h4" color="primary">
                  {reporte.cantidadViajes.toLocaleString()}
                </Typography>
                <Typography variant="body2">Viajes Finalizados</Typography>
              </Box>
              <Box sx={{ textAlign: "center", p: 1 }}>
                <Typography variant="h4" color="primary">
                  {formatKilometros(reporte.totalKilometros)}
                </Typography>
                <Typography variant="body2">Km Totales Recorridos</Typography>
              </Box>
              <Box sx={{ textAlign: "center", p: 1 }}>
                <Typography variant="h4" color="primary">
                  {reporte.cantidadCargasCombustible.toLocaleString()}
                </Typography>
                <Typography variant="body2">Cargas de Combustible</Typography>
              </Box>
              <Box sx={{ textAlign: "center", p: 1 }}>
                <Typography variant="h4" color="primary">
                  {formatLitros(reporte.litrosTotales)}
                </Typography>
                <Typography variant="body2">Litros Totales Cargados</Typography>
              </Box>
              <Box sx={{ textAlign: "center", p: 1 }}>
                <Typography variant="h4" color="primary">{kmPorLitro.toFixed(1)}</Typography>
                <Typography variant="body2" >Km / Litro (Promedio)</Typography>
              </Box>
            </Box>
          </Paper>

          {chartData.length > 0 ? (
            <Paper variant="outlined" sx={{ p: 3, mt: 3, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Línea de Tiempo: Viajes vs. Cargas de Combustible
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="fecha"
                    tickFormatter={(dateStr) =>
                      new Date(dateStr + "T00:00:00").toLocaleDateString(
                        "es-AR",
                        { day: "2-digit", month: "2-digit" }
                      )
                    }
                  />
                  <YAxis
                    yAxisId="left"
                    label={{
                      value: "Km Acumulados",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{
                      value: "Litros (Lts)",
                      angle: 90,
                      position: "insideRight",
                    }}
                  />
                  <Tooltip
                    formatter={(value: number, name: string, props: any) => [
                      name === "Km Acumulados"
                        ? formatKilometros(value)
                        : formatLitros(value),
                      name,
                    ]}
                    labelFormatter={(label) =>
                      new Date(label + "T00:00:00").toLocaleDateString(
                        "es-AR",
                        { dateStyle: "long" }
                      )
                    }
                  />
                  <Legend />
                  <Bar
                    yAxisId="right"
                    dataKey="litros"
                    name="Carga Combustible (Lts)"
                    fill="#82ca9d"
                    barSize={20}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="km_acumulado"
                    name="Km Acumulados"
                    stroke="#E65F2B"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    dot={renderTripDot}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </Paper>
          ) : (
            !error && (
              <Alert severity="info" sx={{ mt: 2 }}>
                No hay datos suficientes de viajes o cargas en este período para
                generar un gráfico.
              </Alert>
            )
          )}
        </>
      )}
    </Paper>
  );
};

export default ReporteUsoCombustible;
