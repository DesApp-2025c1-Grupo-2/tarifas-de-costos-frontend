/*import React, { useEffect, useState, useMemo } from "react";
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
} from "@mui/material";
import {
  getComparativaGeneralPorZona,
  ComparativaZonaStats,
} from "../../services/reporteService";

interface MinMaxZonaData {
  nombre: string;
  average: number;
}

const formatCurrency = (value: number) => {
  if (typeof value !== "number") return "$0";
  return `$${value.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

const ComparativaZonasCostos: React.FC = () => {
  const [comparativaData, setComparativaData] = useState<
    Record<string, ComparativaZonaStats>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busquedaZona, setBusquedaZona] = useState<string>("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchComparativa = async () => {
      try {
        const data = await getComparativaGeneralPorZona();
        setComparativaData(data);
      } catch (err) {
        console.error("Error al cargar la comparativa de zonas y costos:", err);
        setError("No se pudo cargar la comparativa de zonas.");
      } finally {
        setLoading(false);
      }
    };
    fetchComparativa();
  }, []);

  const datosProcesados = useMemo(() => {
    return Object.entries(comparativaData)
      .filter(([zona]) =>
        zona.toLowerCase().includes(busquedaZona.toLowerCase())
      )

      .sort(
        ([, statsA], [, statsB]) => (statsB.count ?? 0) - (statsA.count ?? 0)
      );
  }, [comparativaData, busquedaZona]);

  const zonasConPromedioValido: MinMaxZonaData[] = Object.entries(
    comparativaData
  )
    .filter(([, stats]) => stats.average > 0)
    .map(([nombreZona, stats]) => ({
      nombre: nombreZona,
      average: stats.average as number,
    }));

  let zonaMayorCosto: MinMaxZonaData | null = null;
  let zonaMenorCosto: MinMaxZonaData | null = null;

  if (zonasConPromedioValido.length > 0) {
    zonaMayorCosto = zonasConPromedioValido.reduce((prev, current) =>
      prev.average > current.average ? prev : current
    );
    zonaMenorCosto = zonasConPromedioValido.reduce((prev, current) =>
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

  if (loading) {
    return (
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
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Análisis de Costos por Zona de Viaje
      </Typography>
      <List sx={{ mb: "1.2em" }}>
        {zonaMayorCosto && (
          <ListItem divider>
            <ListItemText
              primary="Zona con MAYOR Costo Promedio"
              secondary={
                <Typography color="error" component="span">
                  {zonaMayorCosto.nombre}:{" "}
                  {formatCurrency(zonaMayorCosto.average)}
                </Typography>
              }
            />
          </ListItem>
        )}
        {zonaMenorCosto && (
          <ListItem>
            <ListItemText
              primary="Zona con MENOR Costo Promedio"
              secondary={
                <Typography color="success.main" component="span">
                  {zonaMenorCosto.nombre}:{" "}
                  {formatCurrency(zonaMenorCosto.average)}
                </Typography>
              }
            />
          </ListItem>
        )}
        {zonasConPromedioValido.length === 0 && !loading && (
          <ListItem>
            <ListItemText primary="No hay datos de tarifas válidos para comparar zonas." />
          </ListItem>
        )}
      </List>
      <TextField
        label="Buscar Zona"
        variant="outlined"
        size="small"
        fullWidth
        sx={{ my: 2 }}
        value={busquedaZona}
        onChange={(e) => setBusquedaZona(e.target.value)}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>Zona de Viaje</TableCell>
              <TableCell align="right">Tarifas Registradas</TableCell>
              <TableCell align="right">Costo Mínimo</TableCell>
              <TableCell align="right">Costo Promedio</TableCell>
              <TableCell align="right">Costo Máximo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datosProcesados
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(([nombreZona, stats]) => (
                <TableRow key={nombreZona}>
                  <TableCell component="th" scope="row">
                    {nombreZona}
                  </TableCell>
                  <TableCell align="right">{stats.count ?? 0}</TableCell>
                  <TableCell align="right">
                    {stats.count > 0
                      ? formatCurrency(stats.min as number)
                      : "-"}
                  </TableCell>
                  <TableCell align="right">
                    {stats.count > 0
                      ? formatCurrency(stats.average as number)
                      : "-"}
                  </TableCell>
                  <TableCell align="right">
                    {stats.count > 0
                      ? formatCurrency(stats.max as number)
                      : "-"}
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
    </Paper>
  );
};

export default ComparativaZonasCostos;
*/
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
  Button, // Importación necesaria
} from "@mui/material";
import {
  getComparativaGeneralPorZona,
  ComparativaZonaStats,
  ComparativaZonasParams, // Importación necesaria
} from "../../services/reporteService";

interface MinMaxZonaData {
  nombre: string;
  average: number;
}

const formatCurrency = (value: number) => {
  if (typeof value !== "number") return "$0";
  return `$${value.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

const ComparativaZonasCostos: React.FC = () => {
  const [comparativaData, setComparativaData] = useState<
    Record<string, ComparativaZonaStats>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busquedaZona, setBusquedaZona] = useState<string>("");

  // [NUEVO ESTADO PARA EL FILTRO]
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  // [FIN NUEVO ESTADO]

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // [NUEVA FUNCIÓN DE FETCH CON PARÁMETROS]
  const fetchComparativa = async (params: ComparativaZonasParams = {}) => {
    setLoading(true);
    setError(null);
    setComparativaData({});

    try {
      const data = await getComparativaGeneralPorZona(params); 
      // Se necesita filtrar los resultados que el backend devuelve como string "No hay tarifas"
      const filteredData: Record<string, ComparativaZonaStats> = {};
      for (const [key, value] of Object.entries(data)) {
        if (typeof value !== 'string') {
          filteredData[key] = value as ComparativaZonaStats;
        }
      }
      setComparativaData(filteredData);
    } catch (err) {
      console.error("Error al cargar la comparativa de zonas y costos:", err);
      setError("No se pudo cargar la comparativa de zonas.");
    } finally {
      setLoading(false);
    }
  };

  // [FUNCIÓN DE MANEJO DE FILTRO]
  const handleGenerarReporte = () => {
    if ((fechaInicio && !fechaFin) || (!fechaInicio && fechaFin)) {
      setError("Debe seleccionar ambas fechas (inicio y fin) para el filtro.");
      return;
    }
    fetchComparativa({ fechaInicio, fechaFin });
  }

  useEffect(() => {
    fetchComparativa();
  }, []);

  const datosProcesados = useMemo(() => {
    return Object.entries(comparativaData)
      .filter(([zona]) =>
        zona.toLowerCase().includes(busquedaZona.toLowerCase())
      )

      .sort(
        ([, statsA], [, statsB]) => (statsB.count ?? 0) - (statsA.count ?? 0)
      );
  }, [comparativaData, busquedaZona]);

  const zonasConPromedioValido: MinMaxZonaData[] = Object.entries(
    comparativaData
  )
    .filter(([, stats]) => stats.average > 0)
    .map(([nombreZona, stats]) => ({
      nombre: nombreZona,
      average: stats.average as number,
    }));

  let zonaMayorCosto: MinMaxZonaData | null = null;
  let zonaMenorCosto: MinMaxZonaData | null = null;

  if (zonasConPromedioValido.length > 0) {
    zonaMayorCosto = zonasConPromedioValido.reduce((prev, current) =>
      prev.average > current.average ? prev : current
    );
    zonaMenorCosto = zonasConPromedioValido.reduce((prev, current) =>
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

  if (loading) {
    return (
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
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Análisis de Costos por Zona de Viaje
      </Typography>

      {/* [NUEVA INTERFAZ DE FILTRO POR FECHA] */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
        <TextField
          label="Fecha de Inicio (Creación de Tarifa)"
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
        <TextField
          label="Fecha de Fin (Creación de Tarifa)"
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
      {/* [FIN NUEVA INTERFAZ] */}

      <List sx={{ mb: "1.2em" }}>
        {zonaMayorCosto && (
          <ListItem divider>
            <ListItemText
              primary="Zona con MAYOR Costo Promedio"
              secondary={
                <Typography color="error" component="span">
                  {zonaMayorCosto.nombre}:{" "}
                  {formatCurrency(zonaMayorCosto.average)}
                </Typography>
              }
            />
          </ListItem>
        )}
        {zonaMenorCosto && (
          <ListItem>
            <ListItemText
              primary="Zona con MENOR Costo Promedio"
              secondary={
                <Typography color="success.main" component="span">
                  {zonaMenorCosto.nombre}:{" "}
                  {formatCurrency(zonaMenorCosto.average)}
                </Typography>
              }
            />
          </ListItem>
        )}
        {zonasConPromedioValido.length === 0 && !loading && (
          <ListItem>
            <ListItemText primary="No hay datos de tarifas válidos para comparar zonas." />
          </ListItem>
        )}
      </List>
      <TextField
        label="Buscar Zona"
        variant="outlined"
        size="small"
        fullWidth
        sx={{ my: 2 }}
        value={busquedaZona}
        onChange={(e) => setBusquedaZona(e.target.value)}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>Zona de Viaje</TableCell>
              <TableCell align="right">Tarifas Registradas</TableCell>
              <TableCell align="right">Costo Mínimo</TableCell>
              <TableCell align="right">Costo Promedio</TableCell>
              <TableCell align="right">Costo Máximo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datosProcesados
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(([nombreZona, stats]) => (
                <TableRow key={nombreZona}>
                  <TableCell component="th" scope="row">
                    {nombreZona}
                  </TableCell>
                  <TableCell align="right">{stats.count ?? 0}</TableCell>
                  <TableCell align="right">
                    {stats.count > 0
                      ? formatCurrency(stats.min as number)
                      : "-"}
                  </TableCell>
                  <TableCell align="right">
                    {stats.count > 0
                      ? formatCurrency(stats.average as number)
                      : "-"}
                  </TableCell>
                  <TableCell align="right">
                    {stats.count > 0
                      ? formatCurrency(stats.max as number)
                      : "-"}
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
    </Paper>
  );
};

export default ComparativaZonasCostos;