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
  Autocomplete,
  TextField,
} from "@mui/material";
import { getComparativaCostos, ComparativaTransportistaDTO } from "../../services/reporteService"; // Import DTO type
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
  transportistaDisplayName: string;
  costo: number;
  tarifaId: number;
  nombreTarifa: string;
}

const ComparativaCostosTransportistas: React.FC = () => {
  // --- Estados (sin cambios) ---
  const [transportistas, setTransportistas] = useState<Transportista[]>([]);
  const [tiposVehiculo, setTiposVehiculo] = useState<TipoVehiculo[]>([]);
  const [tiposCarga, setTiposCarga] = useState<Carga[]>([]);
  const [zonas, setZonas] = useState<ZonaViaje[]>([]);
  const [selectedTransportistaIds, setSelectedTransportistaIds] = useState<string[]>([]);
  const [selectedVehiculoId, setSelectedVehiculoId] = useState<string>("");
  const [selectedCargaId, setSelectedCargaId] = useState<string>("");
  const [selectedZonaId, setSelectedZonaId] = useState<string>("");
  const [reporte, setReporte] = useState<ReporteEnriquecido[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingFiltros, setLoadingFiltros] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- useEffect para cargar filtros (sin cambios) ---
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

  // --- handleTransportistaChange (sin cambios) ---
  const handleTransportistaChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedTransportistaIds(
      typeof value === "string" ? value.split(",") : value
    );
  };

  // --- handleSubmit (CORREGIDO) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // *** CORRECCIÓN 1: Lógica de validación ***
    // Debe haber al menos 2 transportistas Y al menos un filtro adicional
    if (
      !selectedTransportistaIds/*.length < 2*/ && (
        !selectedVehiculoId &&
        !selectedCargaId &&
        !selectedZonaId
      )
    ) {
      setError(
        "Debe seleccionar al menos dos transportistas y al menos un criterio adicional (tipo de vehículo, tipo de carga o zona) para comparar."
      );
      return;
    }

    setLoading(true);
    setError(null);
    setReporte(null);

    // *** CORRECCIÓN 2: Construcción dinámica de params ***
    const params: { [key: string]: string | number } = {};
    if (selectedVehiculoId) {
      params.tipoVehiculoId = selectedVehiculoId; // string
    }
    if (selectedCargaId) {
      params.tipoCargaId = Number(selectedCargaId); // number
    }
    if (selectedZonaId) {
      params.zonaId = Number(selectedZonaId); // number
    }

    try {
      // *** CORRECCIÓN 3: Llamada al servicio ***
      const data: ComparativaTransportistaDTO = await getComparativaCostos(params); // Tipado explícito

      // *** CORRECCIÓN 4: Procesamiento de datos ***
      // Verificar si data.comparativas existe y es un array antes de procesar
      if (!data || !Array.isArray(data.comparativas)) {
           // Lanza un error o maneja el caso donde la respuesta no es la esperada
           throw new Error("No existen transportistas con esas características.");
      }

      const reporteConNombres: ReporteEnriquecido[] = data.comparativas
        .filter(comp => {
          const transportistaEncontrado = transportistas.find(t => t.nombre_comercial === comp.transportista);
          return transportistaEncontrado ? selectedTransportistaIds.includes(transportistaEncontrado.id) : false;
        })
        .map((comparativa) => {
          const transportistaEncontrado = transportistas.find(t => t.nombre_comercial === comparativa.transportista);
          const displayName = transportistaEncontrado
            ? `${transportistaEncontrado.nombre_comercial} (${transportistaEncontrado.contacto?.nombre || "N/A"})`
            : comparativa.transportista;

          // *** CORRECCIÓN 5: Asegurar que costo no sea null/undefined antes de usarlo ***
          const costoValido = comparativa.costo ?? 0; // Usar 0 si es null/undefined

          return {
            transportistaDisplayName: displayName,
            costo: costoValido, // Usar el valor validado
            tarifaId: comparativa.tarifaId,
            nombreTarifa: comparativa.nombreTarifa ? comparativa.nombreTarifa.trim() : "Sin nombre",          
          };
        })
        .sort((a, b) => a.costo - b.costo);

      if (reporteConNombres.length === 0) {
        setError(
          "Ninguno de los transportistas seleccionados tiene una tarifa registrada para los criterios elegidos o no se encontraron datos."
        );
      } else {
        setReporte(reporteConNombres);
      }
    } catch (err: any) {
      console.error("Error al generar reporte:", err);
      // *** CORRECCIÓN 6: Manejo de errores más robusto ***
      const message = err?.message || ''; // Obtener mensaje de error o string vacío
      setError(
        message.includes("204") || message.toLowerCase().includes("no content") // Chequear también por texto
          ? "No se encontraron tarifas que coincidan con los criterios para los transportistas seleccionados."
          : `Ocurrió un error al generar el reporte: ${message}` // Incluir el mensaje de error
      );
    } finally {
      setLoading(false);
    }
  };

  // --- formatCurrency (sin cambios) ---
  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "N/A";
    const number = Number(value);
    return `$${number.toLocaleString("es-AR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  // --- JSX de retorno (con correcciones menores) ---
  return (
    <Paper sx={{ padding: 3, marginTop: 2 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Comparativa de Costos entre Transportistas
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Seleccione transportistas y al menos un criterio (vehículo, carga o zona) para ver sus costos.
        </Typography>
      </Box>

      {/* --- Sección de Filtros (sin cambios funcionales) --- */}
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
          {/* FormControl Transportistas */}
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
              renderValue={(selectedIds) => (
                transportistas
                  .filter((t) => selectedIds.includes(String(t.id)))
                  .map((t) => `${t.nombre_comercial} (${t.contacto?.nombre || "N/A"})`)
                  .join(", ")
              )}
              MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
            >
              {transportistas.map((t) => (
                <MenuItem key={t.id} value={String(t.id)}>
                  <Checkbox checked={selectedTransportistaIds.indexOf(String(t.id)) > -1} />
                  <ListItemText
                    primary={`${t.nombre_comercial} (${t.contacto?.nombre || "N/A"})`}
                    secondary={`CUIT: ${t.cuit}`}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* FormControl Tipo de Vehículo */}
          <Autocomplete
            options={tiposVehiculo}
            getOptionLabel={(option) => option.nombre || ''}
            value={tiposVehiculo.find(v => v.id === selectedVehiculoId) || null}
            onChange={(_, newValue: TipoVehiculo | null) => {
              setSelectedVehiculoId(newValue ? newValue.id : "");
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField {...params} label="Tipo de Vehículo" size="small" />
            )}
            disabled={loadingFiltros}
            sx={{ minWidth: 180, flexGrow: 1 }} // Ajusta ancho
            size="small"
          />

          {/* FormControl Tipo de Carga */}
          <Autocomplete
            options={tiposCarga}
            getOptionLabel={(option) => option.nombre || ''}
            value={tiposCarga.find(c => String(c.id) === selectedCargaId) || null} // Compara como string
            onChange={(_, newValue: Carga | null) => {
              setSelectedCargaId(newValue ? String(newValue.id) : ""); // Guarda como string
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField {...params} label="Tipo de Carga" size="small" />
            )}
            disabled={loadingFiltros}
             sx={{ minWidth: 180, flexGrow: 1 }} // Ajusta ancho
            size="small"
          />

          {/* FormControl Zona */}
          <Autocomplete
            options={zonas}
            getOptionLabel={(option) => option.nombre || ''}
            value={zonas.find(z => String(z.id) === selectedZonaId) || null} // Compara como string
            onChange={(_, newValue: ZonaViaje | null) => {
              setSelectedZonaId(newValue ? String(newValue.id) : ""); // Guarda como string
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField {...params} label="Zona" size="small" />
            )}
            disabled={loadingFiltros}
            sx={{ minWidth: 150, flexGrow: 1 }} // Ajusta ancho
            size="small"
          />

          {/* Botón Comparar */}
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

      {/* --- Sección de Error y Tabla (con corrección en key) --- */}
      {error && (
        <Alert severity={error.toLowerCase().includes("no se encontraron") ? "info" : "warning"} sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {reporte && reporte.length > 0 && (
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
              {reporte.map((item, index) => ( // *** CORRECCIÓN 7: Usar index en la key para asegurar unicidad ***
                <TableRow
                  key={`${item.tarifaId}-${index}`} // Clave más robusta
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {item.transportistaDisplayName}
                  </TableCell>
                  <TableCell>{item.nombreTarifa}</TableCell>
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