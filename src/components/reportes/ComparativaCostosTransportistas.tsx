import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { getComparativaCostos } from "../../services/reporteService";
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
  id: number;
  displayName: string;
  costo: number;
}

const ComparativaCostosTransportistas: React.FC = () => {
  const [transportistas, setTransportistas] = useState<Transportista[]>([]);
  const [tiposVehiculo, setTiposVehiculo] = useState<TipoVehiculo[]>([]);
  const [tiposCarga, setTiposCarga] = useState<Carga[]>([]);
  const [zonas, setZonas] = useState<ZonaViaje[]>([]);

  const [selectedTransportistaIds, setSelectedTransportistaIds] = useState<
    number[]
  >([]);
  const [selectedVehiculoId, setSelectedVehiculoId] = useState<string>("");
  const [selectedCargaId, setSelectedCargaId] = useState<string>("");
  const [selectedZonaId, setSelectedZonaId] = useState<string>("");

  const [reporte, setReporte] = useState<ReporteEnriquecido[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingFiltros, setLoadingFiltros] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatosFiltros = async () => {
      try {
        const [transportistasData, vehiculosData, cargasData, zonasData] =
          await Promise.all([
            obtenerTransportistas(),
            obtenerTiposVehiculo(),
            obtenerCargas(),
            obtenerZonas(),
          ]);
        setTransportistas(transportistasData.filter((t) => t.activo));
        setTiposVehiculo(vehiculosData.filter((v) => v.activo));
        setTiposCarga(cargasData.filter((c) => c.activo));
        setZonas(zonasData.filter((z) => z.activo));
      } catch (err) {
        setError("Error al cargar los filtros. Intente recargar la página.");
      } finally {
        setLoadingFiltros(false);
      }
    };
    cargarDatosFiltros();
  }, []);

  const handleTransportistaChange = (event: SelectChangeEvent<number[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedTransportistaIds(
      typeof value === "string" ? value.split(",").map(Number) : value
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      selectedTransportistaIds.length < 2 ||
      !selectedVehiculoId ||
      !selectedCargaId ||
      !selectedZonaId
    ) {
      setError(
        "Debe seleccionar al menos dos transportistas, un tipo de vehículo, un tipo de carga y una zona para comparar."
      );
      return;
    }
    setLoading(true);
    setError(null);
    setReporte(null);

    const params = {
      tipoVehiculoId: Number(selectedVehiculoId),
      tipoCargaId: Number(selectedCargaId),
      zonaId: Number(selectedZonaId),
    };

    try {
      const data = await getComparativaCostos(params);

      const transportistasSeleccionados = transportistas.filter((t) =>
        selectedTransportistaIds.includes(t.id)
      );

      const reporteFinal = transportistasSeleccionados
        .map((transportista) => {
          const infoCosto = data.comparativas.find(
            (comp) => comp.transportista === transportista.nombreEmpresa
          );
          return {
            id: transportista.id,
            displayName: `${transportista.nombreEmpresa} (${transportista.contactoNombre})`,
            costo: infoCosto ? infoCosto.costo : null,
          };
        })
        .filter((item) => item.costo !== null) as ReporteEnriquecido[];

      if (reporteFinal.length === 0) {
        setError(
          "Ninguno de los transportistas seleccionados ofrece un servicio con las características elegidas."
        );
      }

      setReporte(reporteFinal);
    } catch (err: any) {
      setError(
        err.message.includes("204")
          ? "No se encontraron tarifas para los criterios seleccionados."
          : "Ocurrió un error al generar el reporte."
      );
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
          Seleccione transportistas, tipo de vehículo, tipo de carga y zona para
          ver sus costos.
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
              renderValue={(selectedIds) => {
                return transportistas
                  .filter((t) => selectedIds.includes(t.id))
                  .map((t) => `${t.nombreEmpresa} (${t.contactoNombre})`)
                  .join(", ");
              }}
            >
              {transportistas.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  <Checkbox
                    checked={selectedTransportistaIds.indexOf(t.id) > -1}
                  />
                  <ListItemText
                    primary={`${t.nombreEmpresa} (${t.contactoNombre})`}
                    secondary={`CUIT: ${t.cuit}`}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel id="vehiculo-select-label">Tipo de Vehículo</InputLabel>
            <Select
              labelId="vehiculo-select-label"
              value={selectedVehiculoId}
              label="Tipo de Vehículo"
              onChange={(e) => setSelectedVehiculoId(e.target.value)}
            >
              {tiposVehiculo.map((v) => (
                <MenuItem key={v.id} value={v.id}>
                  {v.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel id="carga-select-label">Tipo de Carga</InputLabel>
            <Select
              labelId="carga-select-label"
              value={selectedCargaId}
              label="Tipo de Carga"
              onChange={(e) => setSelectedCargaId(e.target.value)}
            >
              {tiposCarga.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel id="zona-select-label">Zona</InputLabel>
            <Select
              labelId="zona-select-label"
              value={selectedZonaId}
              label="Zona"
              onChange={(e) => setSelectedZonaId(e.target.value)}
            >
              {zonas.map((z) => (
                <MenuItem key={z.id} value={z.id}>
                  {z.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ minWidth: "150px", height: "40px" }}
          >
            {loading ? <CircularProgress size={24} /> : "Comparar"}
          </Button>
        </Box>
      )}

      {error && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {reporte && reporte.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>Transportista</TableCell>
                <TableCell align="right">Costo del Servicio (ARS)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reporte.map((item) => (
                <TableRow key={item.id}>
                  <TableCell component="th" scope="row">
                    {item.displayName}
                  </TableCell>
                  <TableCell align="right">
                    $
                    {item.costo.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default ComparativaCostosTransportistas;
