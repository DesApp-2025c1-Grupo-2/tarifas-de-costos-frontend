import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Autocomplete,
  TextField,
  Chip,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  getComparativaCostos,
  ComparativaTransportistaDTO,
} from "../../services/reporteService";
import {
  obtenerTransportistas,
  Transportista,
} from "../../services/transportistaService";
import {
  obtenerTiposVehiculo,
  TipoVehiculo,
} from "../../services/tipoVehiculoService";
import { obtenerCargas, Carga } from "../../services/cargaService";
import { obtenerZonas, ZonaViaje } from "../../services/zonaService";

interface ReporteEnriquecido {
  transportistaId: string;
  transportistaDisplayName: string;
  costo: number;
  tarifaId: number;
  nombreTarifa: string;
  uniqueKey: string;
}

const formatCurrency = (value: number | null | undefined) => {
  if (value === null || value === undefined) return "N/A";
  const number = Number(value);
  return `$${number.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

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

const ComparativaCostosTransportistas: React.FC = () => {
  const [transportistas, setTransportistas] = useState<Transportista[]>([]);
  const [tiposVehiculo, setTiposVehiculo] = useState<TipoVehiculo[]>([]);
  const [tiposCarga, setTiposCarga] = useState<Carga[]>([]);
  const [zonas, setZonas] = useState<ZonaViaje[]>([]);
  const [selectedTransportistaIds, setSelectedTransportistaIds] = useState<
    string[]
  >([]);
  const [selectedVehiculoId, setSelectedVehiculoId] = useState<string>("");
  const [selectedCargaId, setSelectedCargaId] = useState<string>("");
  const [selectedZonaId, setSelectedZonaId] = useState<string>("");
  const [reporte, setReporte] = useState<ReporteEnriquecido[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingFiltros, setLoadingFiltros] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtrosActivos, setFiltrosActivos] = useState<string[]>([]);

  useEffect(() => {
    const cargarDatosFiltros = async () => {
      try {
        setLoadingFiltros(true);
        setError(null);
        const [transportistasData, vehiculosData, cargasData, zonasData] =
          await Promise.all([
            obtenerTransportistas(),
            obtenerTiposVehiculo(),
            obtenerCargas(),
            obtenerZonas(),
          ]);
        setTransportistas(transportistasData);
        setTiposVehiculo(vehiculosData.filter((v) => !v.deletedAt));
        setTiposCarga(cargasData.filter((c) => c.activo));
        setZonas(zonasData.filter((z) => z.activo));
      } catch (err) {
        console.error("Error al cargar datos para filtros:", err);
        setError("Error al cargar los filtros. Intente recargar la página.");
      } finally {
        setLoadingFiltros(false);
      }
    };
    cargarDatosFiltros();
  }, []);

  const transportistaColorMap = useMemo(() => {
    const map = new Map<string, string>();
    transportistas.forEach((transportista, index) => {
      map.set(transportista.id, COLORS[index % COLORS.length]);
    });
    return map;
  }, [transportistas]);

  const handleTransportistaChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedTransportistaIds(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedTransportistaIds &&
      !selectedVehiculoId &&
      !selectedCargaId &&
      !selectedZonaId
    ) {
      setError(
        "Debe seleccionar al menos dos transportistas y al menos un criterio adicional (tipo de vehículo, tipo de carga o zona) para comparar."
      );
      return;
    }

    setLoading(true);
    setError(null);
    setReporte(null);
    setFiltrosActivos([]);

    const params: { [key: string]: string | number } = {};
    if (selectedVehiculoId) {
      params.tipoVehiculoId = selectedVehiculoId;
    }
    if (selectedCargaId) {
      params.tipoCargaId = Number(selectedCargaId);
    }
    if (selectedZonaId) {
      params.zonaId = Number(selectedZonaId);
    }

    const filtrosAplicados: string[] = [];
    try {
      if (selectedVehiculoId) {
        const vehiculo = tiposVehiculo.find((v) => v.id === selectedVehiculoId);
        if (vehiculo) filtrosAplicados.push(`Vehículo: ${vehiculo.nombre}`);
      }
      if (selectedCargaId) {
        const carga = tiposCarga.find((c) => String(c.id) === selectedCargaId);
        if (carga) filtrosAplicados.push(`Carga: ${carga.nombre}`);
      }
      if (selectedZonaId) {
        const zona = zonas.find((z) => String(z.id) === selectedZonaId);
        if (zona) filtrosAplicados.push(`Zona: ${zona.nombre}`);
      }
    } catch (e) {
      console.error("Error al buscar nombres de filtros", e);
    }

    try {
      const data: ComparativaTransportistaDTO = await getComparativaCostos(
        params
      );

      if (!data || !Array.isArray(data.comparativas)) {
        throw new Error("No existen transportistas con esas características.");
      }

      const reporteConNombres: ReporteEnriquecido[] = data.comparativas
        .filter((comp) => {
          const transportistaEncontrado = transportistas.find(
            (t) => t.nombre_comercial === comp.transportista
          );
          return transportistaEncontrado
            ? selectedTransportistaIds.includes(transportistaEncontrado.id)
            : false;
        })
        .map((comparativa) => {
          const transportistaEncontrado = transportistas.find(
            (t) => t.nombre_comercial === comparativa.transportista
          );
          const displayName = transportistaEncontrado
            ? `${transportistaEncontrado.nombre_comercial} (${
                transportistaEncontrado.contacto?.nombre || "N/A"
              })`
            : comparativa.transportista;
          const costoValido = comparativa.costo ?? 0;
          return {
            transportistaId: transportistaEncontrado
              ? transportistaEncontrado.id
              : "unknown",
            transportistaDisplayName: displayName,
            costo: costoValido,
            tarifaId: comparativa.tarifaId,
            nombreTarifa: comparativa.nombreTarifa
              ? comparativa.nombreTarifa.trim()
              : "Sin nombre",
            uniqueKey: `${displayName}_${comparativa.tarifaId}`,
          };
        })
        .sort((a, b) => a.costo - b.costo);

      if (reporteConNombres.length === 0) {
        setError(
          "Ninguno de los transportistas seleccionados tiene una tarifa registrada para los criterios elegidos o no se encontraron datos."
        );
        setFiltrosActivos([]);
      } else {
        setReporte(reporteConNombres);
        setFiltrosActivos(filtrosAplicados);
      }
    } catch (err: any) {
      console.error("Error al generar reporte:", err);
      const message = err?.message || "";
      setError(
        message.includes("204") || message.toLowerCase().includes("no content")
          ? "No se encontraron tarifas que coincidan con los criterios para los transportistas seleccionados."
          : `Ocurrió un error al generar el reporte: ${message}`
      );
      setFiltrosActivos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ padding: 3, marginTop: 2 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Comparativa de Costos entre Transportistas
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Seleccione transportistas y al menos un criterio (vehículo, carga o
          zona) para ver sus costos.
        </Typography>
      </Box>

      {loadingFiltros ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            alignItems: "center",
            mb: 4,
          }}
        >
          <FormControl fullWidth size="small">
            <InputLabel id="transportistas-select-label">
              Transportistas a Comparar
            </InputLabel>
            <Select
              labelId="transportistas-select-label"
              multiple
              value={selectedTransportistaIds}
              onChange={handleTransportistaChange}
              input={<OutlinedInput label="Transportistas a Comparar" />}
              renderValue={(selectedIds) =>
                transportistas
                  .filter((t) => selectedIds.includes(String(t.id)))
                  .map(
                    (t) =>
                      `${t.nombre_comercial} (${t.contacto?.nombre || "N/A"})`
                  )
                  .join(", ")
              }
              MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
            >
              {transportistas.map((t) => (
                <MenuItem key={t.id} value={String(t.id)}>
                  <Checkbox
                    checked={
                      selectedTransportistaIds.indexOf(String(t.id)) > -1
                    }
                  />
                  <ListItemText
                    primary={`${t.nombre_comercial} (${
                      t.contacto?.nombre || "N/A"
                    })`}
                    secondary={`CUIT: ${t.cuit}`}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Autocomplete
            options={tiposVehiculo}
            getOptionLabel={(option) => option.nombre || ""}
            value={
              tiposVehiculo.find((v) => v.id === selectedVehiculoId) || null
            }
            onChange={(_, newValue: TipoVehiculo | null) => {
              setSelectedVehiculoId(newValue ? newValue.id : "");
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField {...params} label="Tipo de Vehículo" size="small" />
            )}
            disabled={loadingFiltros}
            sx={{ minWidth: 180, flexGrow: 1 }}
            size="small"
          />
          <Autocomplete
            options={tiposCarga}
            getOptionLabel={(option) => option.nombre || ""}
            value={
              tiposCarga.find((c) => String(c.id) === selectedCargaId) || null
            }
            onChange={(_, newValue: Carga | null) => {
              setSelectedCargaId(newValue ? String(newValue.id) : "");
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField {...params} label="Tipo de Carga" size="small" />
            )}
            disabled={loadingFiltros}
            sx={{ minWidth: 180, flexGrow: 1 }}
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
              <TextField {...params} label="Zona" size="small" />
            )}
            disabled={loadingFiltros}
            sx={{ minWidth: 150, flexGrow: 1 }}
            size="small"
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading || loadingFiltros}
            sx={{ minWidth: "150px", height: "40px" }}
          >
            {loading ? <CircularProgress size={24} /> : "Comparar"}
          </Button>
        </Box>
      )}

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert
          severity={
            error.toLowerCase().includes("no se encontraron")
              ? "info"
              : "warning"
          }
          sx={{ mt: 2 }}
        >
          {error}
        </Alert>
      )}

      {reporte && reporte.length > 0 && (
        <Box
          sx={{
            height: Math.max(300, 60 * reporte.length),
            width: "100%",
            mt: 4,
            mb: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Gráfico Comparativo
          </Typography>

          {filtrosActivos.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                mb: 2,
                justifyContent: "flex-start",
              }}
            >
              <Typography
                variant="body2"
                sx={{ alignSelf: "center", mr: 1, fontWeight: 500 }}
              >
                Filtros Aplicados:
              </Typography>
              {filtrosActivos.map((filtro, index) => (
                <Chip
                  key={index}
                  label={filtro}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              ))}
            </Box>
          )}

          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={reporte}
              margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickFormatter={(value) => formatCurrency(value)}
              />
              <YAxis
                type="category"
                dataKey="uniqueKey"
                width={180}
                interval={0}
                tickFormatter={(value, index) => {
                  const item = reporte[index];
                  if (item) {
                    return `${item.transportistaDisplayName} (${item.nombreTarifa})`;
                  }
                  return value;
                }}
              />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
              <Bar dataKey="costo" name="Costo del Servicio">
                {reporte.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      transportistaColorMap.get(entry.transportistaId) ||
                      COLORS[index % COLORS.length]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}

      {reporte && reporte.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Datos de la Comparativa
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>Transportista</TableCell>
                  <TableCell>Tarifa</TableCell>
                  <TableCell align="right">Costo del Servicio (ARS)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reporte.map((item, index) => (
                  <TableRow
                    key={`${item.tarifaId}-${index}`}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {item.transportistaDisplayName}
                    </TableCell>
                    <TableCell>{item.nombreTarifa}</TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            transportistaColorMap.get(item.transportistaId) ||
                            COLORS[index % COLORS.length],
                          fontWeight: "bold",
                        }}
                      >
                        {formatCurrency(item.costo)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Paper>
  );
};

export default ComparativaCostosTransportistas;
