import React, { useEffect, useState, useMemo } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
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
} from "@mui/material";
import {
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { obtenerAdicionales, Adicional } from "../../services/adicionalService";
import {
  getFrecuenciaAdicionales,
  FrecuenciaAdicionalesParams,
} from "../../services/reporteService";
import { esES as esESGrid } from "@mui/x-data-grid/locales";

type AdicionalConFrecuencia = Adicional & { cantidad: number };

const formatCurrency = (value: number | any) => {
  const number = Number(value) || 0;
  return `$${number.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
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

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "nombre", headerName: "Nombre Adicional", flex: 1 },
  {
    field: "cantidad",
    headerName: "Veces Utilizado",
    type: "number",
    flex: 0,
  },
  {
    field: "costoDefault",
    headerName: "Costo Base",
    type: "number",
    width: 150,
    valueFormatter: (value) => formatCurrency(value),
  },
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

// --- SE HA ELIMINADO LA FUNCIÓN renderCustomizedLabel YA QUE NO SE USARÁ ---

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

  const kpis = useMemo(() => {
    if (loading || datosFiltrados.length === 0) {
      return { masUsado: null, menosUsado: null, costoPromedio: 0 };
    }

    const usados = datosFiltrados.filter((a) => a.cantidad > 0);

    let masUsado = null;
    let menosUsado = null;

    if (usados.length > 0) {
      masUsado = usados.reduce((prev, current) =>
        prev.cantidad > current.cantidad ? prev : current
      );
      menosUsado = usados.reduce((prev, current) =>
        prev.cantidad < current.cantidad ? prev : current
      );
    }

    const costoPromedio =
      datosFiltrados.length > 0
        ? datosFiltrados.reduce((acc, curr) => acc + curr.costoDefault, 0) /
          datosFiltrados.length
        : 0;

    return { masUsado, menosUsado, costoPromedio };
  }, [loading, datosFiltrados]);

  const dataGraficoTorta = useMemo(() => {
    return datosFiltrados
      .map((a) => ({
        name: a.nombre,
        value: a.cantidad * a.costoDefault,
      }))
      .filter((a) => a.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [datosFiltrados]);

  const KpiCard: React.FC<{
    title: string;
    value: string;
    subValue?: string;
  }> = ({ title, value, subValue }) => (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ textAlign: "center" }}>
        <Typography color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h5" component="div">
          {value}
        </Typography>
        {subValue && (
          <Typography sx={{ mt: 0.5 }} color="text.secondary">
            {subValue}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

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
          <Grid container spacing={3} sx={{ mb: 4 }} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <KpiCard
                title="Adicional Más Utilizado"
                value={kpis.masUsado?.nombre ?? "N/A"}
                subValue={
                  kpis.masUsado ? `${kpis.masUsado.cantidad} veces` : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <KpiCard
                title="Adicional Menos Utilizado"
                value={kpis.menosUsado?.nombre ?? "N/A"}
                subValue={
                  kpis.masUsado ? `${kpis.menosUsado.cantidad} veces` : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <KpiCard
                title="Costo Base Promedio"
                value={formatCurrency(kpis.costoPromedio)}
                subValue={`Sobre ${datosFiltrados.length} adicionales`}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mb: 4 }} justifyContent="center">
            <Grid item xs={12} md={12}>
              <Paper
                sx={{
                  p: 2,
                  height: 500,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h6" gutterBottom align="center">
                  Distribución de Costos Totales por Adicional
                </Typography>
                {dataGraficoTorta.length > 0 ? (
                  <Box sx={{ width: "100%", height: "100%", pt: 2 }}>
                    <ResponsiveContainer width="100%" height="80%">
                      <PieChart
                        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                      >
                        {" "}
                        {/* Márgenes reducidos a 0 */}
                        <Pie
                          data={dataGraficoTorta}
                          cx="50%"
                          cy="50%"
                          outerRadius={140}
                          fill="#8884d8"
                          dataKey="value"
                          labelLine={false} // DESACTIVADO: No mostrar líneas
                          label={false} // DESACTIVADO: No mostrar etiquetas de texto alrededor
                        >
                          {dataGraficoTorta.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [
                            formatCurrency(value as number),
                            name,
                          ]}
                        />
                        <Legend
                          wrapperStyle={{
                            position: "relative",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            paddingTop: "10px",
                          }}
                          layout="horizontal"
                          align="center"
                          verticalAlign="bottom"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                ) : (
                  <FallbackGrafico mensaje="No hay impacto económico para mostrar." />
                )}
              </Paper>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Catálogo Completo de Adicionales Constantes
          </Typography>
          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={datosFiltrados}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
                sorting: {
                  sortModel: [{ field: "cantidad", sort: "desc" }],
                },
              }}
              getRowId={(row) => row.id}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              localeText={
                esESGrid.components.MuiDataGrid.defaultProps.localeText
              }
            />
          </Box>
        </>
      )}
    </Paper>
  );
};

export default CatalogoAdicionales;
