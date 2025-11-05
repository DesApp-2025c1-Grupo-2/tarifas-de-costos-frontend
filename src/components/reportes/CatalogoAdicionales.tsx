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
// --- IMPORTACIONES DE RECHARTS ELIMINADAS ---
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

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "nombre", headerName: "Nombre Adicional", flex: 1 },
  {
    field: "cantidad",
    headerName: "Veces Utilizado",
    type: "number",
    flex: 1,
  },
  {
    field: "costoDefault",
    headerName: "Costo Base",
    type: "number",
    width: 150,
    valueFormatter: (value) => formatCurrency(value),
  },
];

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
      const [adicionales, frecuenciaData] = await Promise.all([
        obtenerAdicionales(),
        getFrecuenciaAdicionales(params),
      ]);

      // Si frecuenciaData es undefined (por 204) o null, trátalo como array vacío
      const frecuencia = Array.isArray(frecuenciaData) ? frecuenciaData : [];

      const frecuenciaMap = new Map(
        frecuencia.map((f) => [f.nombreAdicional, f.cantidad])
      );

      const combinados: AdicionalConFrecuencia[] = adicionales.map((a) => ({
        ...a,
        cantidad: frecuenciaMap.get(a.nombre) ?? 0,
      }));

      setAdicionalesCombinados(combinados);

      // Si se aplicó filtro pero el resultado está vacío (porque frecuenciaMap estaba vacío)
      if ((params.fechaInicio || params.fechaFin) && frecuencia.length === 0) {
        setError(
          "No se encontró uso de adicionales en el período seleccionado."
        );
      }
    } catch (err: any) {
      console.error("Error al cargar los datos de adicionales:", err);
      // Manejar el 204 explícitamente si el servicio (apiClient) lo lanza como error
      if (err.message.includes("204")) {
        setError(
          "No se encontró uso de adicionales en el período seleccionado."
        );
        setAdicionalesCombinados([]); // Limpiar datos si da 204
      } else {
        // Manejar otros errores (ej. TypeError si la corrección 2 no estuviera)
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

  // --- CORRECCIÓN 3: ELIMINADO calculo de costoPromedio ---
  const kpis = useMemo(() => {
    if (loading || datosFiltrados.length === 0) {
      return { masUsado: null, menosUsado: null };
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

    return { masUsado, menosUsado };
  }, [loading, datosFiltrados]);
  // --- FIN CORRECCIÓN 3 ---

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
          {/* --- CORRECCIÓN 4: ELIMINADA la tarjeta de Costo Promedio --- */}
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
          </Grid>
          {/* --- FIN CORRECCIÓN 4 --- */}

          {/* --- BLOQUE DEL GRÁFICO DE TORTA ELIMINADO --- */}

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
