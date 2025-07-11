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
import {
  getComparativaCostos,
  ComparativaTransportistaDTO,
} from "../../services/reporteService";
import {
  obtenerTransportistas,
  Transportista,
} from "../../services/transportistaService";
import { obtenerTarifas, Tarifa } from "../../services/tarifaService"; // Se usa tu servicio existente

const ComparativaCostosTransportistas: React.FC = () => {
  const [transportistas, setTransportistas] = useState<Transportista[]>([]);
  const [tarifas, setTarifas] = useState<Tarifa[]>([]);

  const [selectedTransportistas, setSelectedTransportistas] = useState<
    string[]
  >([]);
  const [selectedTarifaId, setSelectedTarifaId] = useState<string>("");

  const [reporte, setReporte] = useState<ComparativaTransportistaDTO | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [loadingFiltros, setLoadingFiltros] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatosFiltros = async () => {
      try {
        const [transportistasData, tarifasData] = await Promise.all([
          obtenerTransportistas(),
          obtenerTarifas(),
        ]);
        setTransportistas(transportistasData.filter((t) => t.activo));
        setTarifas(tarifasData.filter((t) => t.esVigente));
      } catch (err) {
        setError("Error al cargar los filtros. Intente recargar la página.");
      } finally {
        setLoadingFiltros(false);
      }
    };
    cargarDatosFiltros();
  }, []);

  const handleTransportistaChange = (
    event: SelectChangeEvent<typeof selectedTransportistas>
  ) => {
    const {
      target: { value },
    } = event;
    setSelectedTransportistas(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTransportistas.length < 2 || !selectedTarifaId) {
      setError(
        "Debe seleccionar al menos dos transportistas y un servicio base para comparar."
      );
      return;
    }
    setLoading(true);
    setError(null);
    setReporte(null);

    const tarifaBase = tarifas.find((t) => t.id === Number(selectedTarifaId));
    if (!tarifaBase) {
      setError("No se encontró la tarifa base seleccionada.");
      setLoading(false);
      return;
    }

    const params = {
      zonaId: tarifaBase.zonaId,
      tipoVehiculoId: tarifaBase.tipoVehiculoId,
      tipoCargaId: tarifaBase.tipoCargaId,
    };

    try {
      const data = await getComparativaCostos(params);

      const resultadoFiltrado = {
        ...data,
        comparativas: data.comparativas.filter((c) =>
          selectedTransportistas.includes(c.transportista)
        ),
      };

      if (resultadoFiltrado.comparativas.length === 0) {
        setError(
          "Ninguno de los transportistas seleccionados ofrece un servicio con las características del servicio base elegido."
        );
      }

      setReporte(resultadoFiltrado);
    } catch (err: any) {
      setError(
        err.message.includes("204")
          ? "No se encontraron tarifas para el servicio base."
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
          Seleccione los transportistas que desea comparar y un servicio base
          para ver sus costos.
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
              value={selectedTransportistas}
              onChange={handleTransportistaChange}
              input={<OutlinedInput label="Transportistas a Comparar" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {transportistas.map((t) => (
                <MenuItem key={t.id} value={t.nombreEmpresa}>
                  <Checkbox
                    checked={
                      selectedTransportistas.indexOf(t.nombreEmpresa) > -1
                    }
                  />{" "}
                  <ListItemText primary={t.nombreEmpresa} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel id="servicio-base-label">
              Servicio Base para Comparar
            </InputLabel>
            <Select
              labelId="servicio-base-label"
              value={selectedTarifaId}
              label="Servicio Base para Comparar"
              onChange={(e) => setSelectedTarifaId(e.target.value)}
            >
              {tarifas.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.nombreTarifa}
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

      {reporte && reporte.comparativas.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>Transportista</TableCell>
                <TableCell align="right">Costo del Servicio (ARS)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reporte.comparativas.map((item, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {item.transportista}
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
