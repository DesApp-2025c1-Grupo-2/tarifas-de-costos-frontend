import React, { useEffect, useState, useMemo } from "react";
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Autocomplete,
} from "@mui/material";
// --- 1. IMPORTAR PieLabelRenderProps ---
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieLabelRenderProps, // <-- IMPORTAR ESTE TIPO
} from "recharts";
// --- FIN IMPORTAR ---
import {
  getComparativaGeneralPorZona,
  ComparativaZonaStats,
  ComparativaZonasParams,
} from "../../services/reporteService";
import { obtenerZonas, ZonaViaje } from "../../services/zonaService";

interface MinMaxVehiculoData {
  nombre: string;
  average: number;
}

const COLORS = [
  "#E65F2B",
  "#2196F3",
  "#4CAF50",
  "#FFC107",
  "#9C27B0",
  "#00BCD4",
  "#F44336",
  "#795548",
];

const formatCurrency = (value: number) => {
  if (typeof value !== "number") return "$0";
  return `$${value.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

const ComparativaVehiculosCostos: React.FC = () => {
  const [comparativaData, setComparativaData] = useState<
    Record<string, ComparativaZonaStats>
  >({});

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState<string>("");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [zonas, setZonas] = useState<ZonaViaje[]>([]);
  const [selectedZonaId, setSelectedZonaId] = useState<string>("");
  const [loadingFiltros, setLoadingFiltros] = useState(true);

  useEffect(() => {
    const cargarFiltrosYDatosIniciales = async () => {
      setLoadingFiltros(true);
      setLoading(true);
      setError(null);

      try {
        const zonasData = await obtenerZonas();
        setZonas(zonasData.filter((z) => z.activo));
        setLoadingFiltros(false);

        await fetchComparativa({});
      } catch (err) {
        console.error("Error al cargar datos iniciales:", err);
        setError("No se pudo cargar la data inicial. Verifique la conexión.");
        setLoadingFiltros(false);
        setLoading(false);
      }
    };

    cargarFiltrosYDatosIniciales();
  }, []);

  const fetchComparativa = async (params: ComparativaZonasParams = {}) => {
    setLoading(true);
    setError(null);
    setComparativaData({});

    try {
      const data = await getComparativaGeneralPorZona(params);
      const filteredData: Record<string, ComparativaZonaStats> = {};
      for (const [key, value] of Object.entries(data)) {
        if (typeof value !== "string" && value.count > 0) {
          filteredData[key] = value as ComparativaZonaStats;
        }
      }

      if (Object.keys(filteredData).length === 0) {
        setError("No se encontraron tarifas con los filtros seleccionados.");
      }
      setComparativaData(filteredData);
    } catch (err) {
      console.error(
        "Error al cargar la comparativa de vehículos y costos:",
        err
      );
      setError("No se pudo cargar la comparativa de vehículos.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerarReporte = () => {
    fetchComparativa({ fechaInicio, fechaFin, zonaId: selectedZonaId });
  };

  const datosProcesados = useMemo(() => {
    return Object.entries(comparativaData)
      .filter(([nombreVehiculo]) =>
        nombreVehiculo.toLowerCase().includes(busqueda.toLowerCase())
      )
      .sort(
        ([, statsA], [, statsB]) => (statsB.count ?? 0) - (statsA.count ?? 0)
      );
  }, [comparativaData, busqueda]);

  const pieData = useMemo(() => {
    return datosProcesados.map(([nombre, stats]) => ({
      name: nombre,
      value: stats.sum ?? 0,
    }));
  }, [datosProcesados]);

  const vehiculosConPromedioValido: MinMaxVehiculoData[] = Object.entries(
    comparativaData
  )
    .filter(([, stats]) => stats.average > 0)
    .map(([nombreVehiculo, stats]) => ({
      nombre: nombreVehiculo,
      average: stats.average as number,
    }));

  let vehiculoMayorCosto: MinMaxVehiculoData | null = null;
  let vehiculoMenorCosto: MinMaxVehiculoData | null = null;

  if (vehiculosConPromedioValido.length > 0) {
    vehiculoMayorCosto = vehiculosConPromedioValido.reduce((prev, current) =>
      prev.average > current.average ? prev : current
    );
    vehiculoMenorCosto = vehiculosConPromedioValido.reduce((prev, current) =>
      prev.average < current.average ? prev : current
    );
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Análisis de Costos por Tipo de Vehículo
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
        <TextField
          label="Fecha de Inicio (Opcional)"
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
        <TextField
          label="Fecha de Fin (Opcional)"
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
        <Autocomplete
          options={zonas}
          getOptionLabel={(option) => option.nombre || ""}
          value={zonas.find((z) => String(z.id) === selectedZonaId) || null}
          onChange={(_, newValue: ZonaViaje | null) => {
            setSelectedZonaId(newValue ? String(newValue.id) : "");
          }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Filtrar por Zona (Opcional)"
              size="small"
            />
          )}
          disabled={loadingFiltros}
          sx={{ minWidth: 220, flexGrow: 1 }}
          size="small"
        />

        <Button
          variant="contained"
          onClick={handleGenerarReporte}
          disabled={loading || loadingFiltros}
          sx={{ height: "40px", minWidth: "150px" }}
        >
          {loading ? <CircularProgress size={24} /> : "Generar Reporte"}
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
        <Alert
          severity={error.includes("No se encontraron") ? "info" : "error"}
        >
          {error}
        </Alert>
      ) : (
        <>
          {pieData.length > 0 && (
            <Box sx={{ height: 400, width: "100%", mb: 4 }}>
              <Typography variant="h6" align="center" gutterBottom>
                Distribución de Costos Totales por Vehículo
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    // --- 2. CORRECCIÓN EN EL TIPO DE LABEL ---
                    label={(props: PieLabelRenderProps) =>
                      `${props.name} (${formatCurrency(props.value as number)})`
                    }
                    // --- FIN DE LA CORRECCIÓN ---
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          )}

          <List sx={{ mb: "1.2em" }}>
            {vehiculoMayorCosto && (
              <ListItem divider>
                <ListItemText
                  primary="Vehículo con MAYOR Costo Promedio"
                  secondary={
                    <Typography color="error" component="span">
                      {vehiculoMayorCosto.nombre}:{" "}
                      {formatCurrency(vehiculoMayorCosto.average)}
                    </Typography>
                  }
                />
              </ListItem>
            )}
            {vehiculoMenorCosto && (
              <ListItem>
                <ListItemText
                  primary="Vehículo con MENOR Costo Promedio"
                  secondary={
                    <Typography color="success.main" component="span">
                      {vehiculoMenorCosto.nombre}:{" "}
                      {formatCurrency(vehiculoMenorCosto.average)}
                    </Typography>
                  }
                />
              </ListItem>
            )}

            {vehiculosConPromedioValido.length === 0 && !loading && !error && (
              <ListItem>
                <ListItemText primary="No hay datos de tarifas válidos para comparar tipos de vehículo." />
              </ListItem>
            )}
          </List>

          {datosProcesados.length > 0 && (
            <>
              <TextField
                label="Buscar Tipo de Vehículo en la tabla"
                variant="outlined"
                size="small"
                fullWidth
                sx={{ my: 2 }}
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableRow>
                      <TableCell>Tipo de Vehículo</TableCell>
                      <TableCell align="right">Tarifas Registradas</TableCell>
                      <TableCell align="right">Costo Mínimo</TableCell>
                      <TableCell align="right">Costo Promedio</TableCell>
                      <TableCell align="right">Costo Máximo</TableCell>
                      <TableCell align="right">Costo Total (Suma)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {datosProcesados
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map(([nombreVehiculo, stats]) => (
                        <TableRow key={nombreVehiculo}>
                          <TableCell component="th" scope="row">
                            {nombreVehiculo}
                          </TableCell>
                          <TableCell align="right">
                            {stats.count ?? 0}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(stats.min as number)}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(stats.average as number)}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(stats.max as number)}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            {formatCurrency(stats.sum as number)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={datosProcesados.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Filas por página:"
              />
            </>
          )}
        </>
      )}
    </Paper>
  );
};

export default ComparativaVehiculosCostos;
