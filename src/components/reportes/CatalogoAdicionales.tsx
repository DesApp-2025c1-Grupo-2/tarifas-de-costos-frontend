import React, { useEffect, useState, useMemo } from "react";
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import {
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts";
import { obtenerAdicionales, Adicional } from "../../services/adicionalService";
import {
  getFrecuenciaAdicionales,
  FrecuenciaAdicionalesParams,
} from "../../services/reporteService";

type AdicionalConFrecuencia = Adicional & { cantidad: number };

const formatCurrency = (value: number | any) => {
  const number = Number(value) || 0;
  return `$${number.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

const formatNumber = (value: number | any) => {
  const number = Number(value) || 0;
  return number.toLocaleString("es-AR");
};

const COLORS = [
  "#E65F2B", // Naranja (Color principal)
  "#2196F3", // Azul
  "#4CAF50", // Verde
  "#FFC107", // Amarillo
  "#9C27B0", // Púrpura
  "#00BCD4", // Cian
  "#F44336", // Rojo
  "#795548", // Marrón
  "#FF9800", // Naranja claro
  "#8BC34A", // Verde claro
  "#03A9F4", // Azul claro
  "#673AB7", // Violeta
];

const FallbackGrafico: React.FC<{ mensaje: string }> = ({ mensaje }) => (
  <Box
    sx={{
      display: "flex",
      minHeight: 300,
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Typography color="text.secondary">{mensaje}</Typography>
  </Box>
);

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Paper
        elevation={3}
        sx={{ p: 1.5, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
          {data.nombre}
        </Typography>
        <Typography variant="body2" color="primary.main">
          Impacto Total: {formatCurrency(data.costoTotal)}
        </Typography>
        <Divider sx={{ my: 0.5 }} />
        <Typography variant="caption" display="block">
          Veces Utilizado: {formatNumber(data.vecesUtilizado)}
        </Typography>
        <Typography variant="caption" display="block">
          Costo Base: {formatCurrency(data.costoBase)}
        </Typography>
      </Paper>
    );
  }
  return null;
};

const CatalogoAdicionales: React.FC = () => {
  const [adicionalesCombinados, setAdicionalesCombinados] = useState<
    AdicionalConFrecuencia[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");

  const fetchData = async (params: FrecuenciaAdicionalesParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const [adicionales, frecuencia] = await Promise.all([
        obtenerAdicionales(),
        getFrecuenciaAdicionales(params),
      ]);

      const frecuenciaMap = new Map(
        frecuencia.map((f) => [f.nombreAdicional, f.cantidad])
      );

      const combinados: AdicionalConFrecuencia[] = adicionales.map((a) => ({
        ...a,
        cantidad: frecuenciaMap.get(a.nombre) ?? 0,
      }));

      setAdicionalesCombinados(combinados);
    } catch (err: any) {
      console.error("Error al cargar los datos de adicionales:", err);
      if (err.message.includes("204")) {
        setError(
          "No se encontró uso de adicionales en el período seleccionado."
        );
        setAdicionalesCombinados([]);
      } else {
        setError("No se pudieron cargar los datos. Intente más tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerarReporte = () => {
    if ((fechaInicio && !fechaFin) || (!fechaInicio && fechaFin)) {
      setError("Debe seleccionar ambas fechas (inicio y fin) para el filtro.");
      return;
    }
    fetchData({ fechaInicio, fechaFin });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const datosFiltrados = useMemo(() => {
    return adicionalesCombinados.filter((a) => a.activo && !a.esGlobal);
  }, [adicionalesCombinados]);

  const barData = useMemo(() => {
    return datosFiltrados
      .map((a) => ({
        nombre: a.nombre,
        costoBase: a.costoDefault,
        vecesUtilizado: a.cantidad,
        costoTotal: a.cantidad * a.costoDefault,
      }))
      .filter((a) => a.costoTotal > 0)
      .sort((a, b) => b.costoTotal - a.costoTotal);
  }, [datosFiltrados]);

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Dashboard de Adicionales Constantes
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
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
          disabled={loading}
          sx={{ height: "40px", minWidth: "150px" }}
        >
          {loading ? <CircularProgress size={24} /> : "Filtrar por Fecha"}
        </Button>
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="info">{error}</Alert>
      ) : (
        <>
          {/* --- Contenedor del Gráfico (sin Grid) --- */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 1, sm: 2, md: 3 },
              mt: 4,
              height: Math.max(500, barData.length * 60 + 100),
              minHeight: 400,
              display: "flex",
              flexDirection: "column",
              // --- SE ELIMINA EL CENTRADO ---
              // alignItems: "center",
              // justifyContent: "center",
              width: "100%",
            }}
          >
            <Typography variant="h6" gutterBottom align="center">
              Impacto Económico Total por Adicional
            </Typography>
            {barData.length > 0 ? (
              <Box sx={{ width: "100%", height: "100%", pt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={barData.sort((a, b) => a.costoTotal - b.costoTotal)}
                    margin={{
                      top: 5,
                      right: 40,
                      left: 160,
                      bottom: 20,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      label={{
                        value: "Impacto Total ($)",
                        position: "bottom",
                        offset: 0,
                      }}
                      tickFormatter={(value) => formatCurrency(value)}
                    />
                    <YAxis
                      type="category"
                      dataKey="nombre"
                      width={150}
                      interval={0}
                      tick={{ fontSize: 12, fill: "#5A5A65" }}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(206, 206, 206, 0.2)" }}
                      content={<CustomTooltip />}
                    />
                    <Bar
                      dataKey="costoTotal"
                      name="Impacto Total"
                      fill="#E65F2B"
                    >
                      {barData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <FallbackGrafico mensaje="No hay impacto económico para mostrar." />
            )}
          </Paper>
        </>
      )}
    </Paper>
  );
};

export default CatalogoAdicionales;
