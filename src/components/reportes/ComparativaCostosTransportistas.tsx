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
  Transportista, // <-- Usará la definición actualizada de transportistaService.ts
} from "../../services/transportistaService";
import {
  obtenerTiposVehiculo,
  TipoVehiculo,
} from "../../services/tipoVehiculoService";
import { obtenerCargas, Carga } from "../../services/cargaService";
import { obtenerZonas, ZonaViaje } from "../../services/zonaService";

interface ReporteEnriquecido {
  id: string; // ID ahora es string para coincidir con Transportista
  displayName: string;
  costo: number; // Costo siempre será number después de filtrar nulls
}

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
      tipoVehiculoId: Number(selectedVehiculoId), // API espera number
      tipoCargaId: Number(selectedCargaId), // API espera number
      zonaId: Number(selectedZonaId), // API espera number
    };

    try {
      const data = await getComparativaCostos(params);

      // Mapeo inicial (costo puede ser null)
      const reporteConPosibleNull = transportistas
        .filter((t) => selectedTransportistaIds.includes(String(t.id)))
        .map((transportista) => {
          const infoCosto = data.comparativas.find(
            // --- CORRECCIÓN FINAL AQUÍ (nombre_comercial) ---
            (comp) => comp.transportista === transportista.nombre_comercial
            // --- FIN CORRECCIÓN FINAL ---
          );
          return {
            id: String(transportista.id),
            // --- CORRECCIÓN FINAL AQUÍ (nombre_comercial y contacto.nombre) ---
            displayName: `${transportista.nombre_comercial} (${
              transportista.contacto?.nombre || "N/A"
            })`,
            // --- FIN CORRECCIÓN FINAL ---
            costo: infoCosto ? infoCosto.costo : null,
          };
        });

      // Filtrar nulls y asegurar el tipo correcto para ReporteEnriquecido[]
      const reporteFinal: ReporteEnriquecido[] = reporteConPosibleNull
        .filter(
          (item): item is { id: string; displayName: string; costo: number } =>
            item.costo !== null
        )
        .sort((a, b) => a.costo - b.costo);

      if (reporteFinal.length === 0) {
        if (data.comparativas && data.comparativas.length > 0) {
          setError(
            "Ninguno de los transportistas seleccionados tiene una tarifa registrada para los criterios elegidos."
          );
        } else {
          setError(
            "No se encontraron tarifas que coincidan con los criterios seleccionados para ningún transportista."
          );
        }
      } else {
        setReporte(reporteFinal);
      }
    } catch (err: any) {
      console.error("Error al generar reporte:", err);
      setError(
        err.message.includes("204")
          ? "No se encontraron tarifas para los criterios seleccionados."
          : "Ocurrió un error al generar el reporte."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "N/A";
    const number = Number(value);
    return `$${number.toLocaleString("es-AR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
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
                return (
                  transportistas
                    .filter((t) => selectedIds.includes(String(t.id)))
                    // --- CORRECCIÓN FINAL AQUÍ ---
                    .map(
                      (t) =>
                        `${t.nombre_comercial} (${t.contacto?.nombre || "N/A"})`
                    )
                    // --- FIN CORRECCIÓN FINAL ---
                    .join(", ")
                );
              }}
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
                    // --- CORRECCIÓN FINAL AQUÍ ---
                    primary={`${t.nombre_comercial} (${
                      t.contacto?.nombre || "N/A"
                    })`}
                    // --- FIN CORRECCIÓN FINAL ---
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
                <MenuItem key={c.id} value={String(c.id)}>
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
                <MenuItem key={z.id} value={String(z.id)}>
                  {z.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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

      {error && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {reporte && reporte.length > 0 && (
        <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>Transportista</TableCell>
                <TableCell align="right">Costo del Servicio (ARS)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reporte.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {item.displayName}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(item.costo)}
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
