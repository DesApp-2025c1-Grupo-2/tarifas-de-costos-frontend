import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Paper, Typography, Box, CircularProgress, Alert, TextField, Button } from "@mui/material";
import { obtenerAdicionales } from "../../services/adicionalService";
import { 
  getFrecuenciaAdicionales,
  FrecuenciaAdicionalesParams // <-- Importación de tipo corregida
} from "../../services/reporteService";
import { esES as esESGrid } from "@mui/x-data-grid/locales";

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
  { field: "descripcion", headerName: "Descripción", flex: 1 },
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

const CatalogoAdicionales: React.FC = () => {
  const [adicionalesCombinados, setAdicionalesCombinados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');


  const fetchData = async (params: FrecuenciaAdicionalesParams = {}) => { // <-- Uso del tipo para el parámetro
    setLoading(true);
    setError(null);
    try {
      const [adicionales, frecuencia] = await Promise.all([
        obtenerAdicionales(),
        getFrecuenciaAdicionales(params), // <-- Se pasan los parámetros
      ]);

      const activos = adicionales.filter((a) => a.activo);

      const frecuenciaMap = new Map(
        frecuencia.map((f) => [f.nombreAdicional, f.cantidad])
      );

      const combinados = activos.map((a) => ({
          ...a,
          cantidad: frecuenciaMap.get(a.nombre) ?? 0,
      }));

      setAdicionalesCombinados(combinados);
    } catch (err: any) {
      console.error("Error al cargar los datos de adicionales:", err);
      if (err.message.includes('204')) {
         setError("No se encontró uso de adicionales en el período seleccionado.");
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
  }

  useEffect(() => {
    fetchData(); 
  }, []);


  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Catálogo de Adicionales con Frecuencia de Uso
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
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
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={adicionalesCombinados}
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
            localeText={esESGrid.components.MuiDataGrid.defaultProps.localeText}
          />
        </Box>
      )}
    </Paper>
  );
};

export default CatalogoAdicionales;