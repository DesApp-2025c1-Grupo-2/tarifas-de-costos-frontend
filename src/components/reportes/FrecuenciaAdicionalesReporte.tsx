import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Paper, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { getFrecuenciaAdicionales, FrecuenciaAdicional } from '../../services/reporteService';
import { esES as esESGrid } from "@mui/x-data-grid/locales";

const columns: GridColDef[] = [
  { field: 'nombreAdicional', headerName: 'Nombre Adicional', flex: 1 },
  { field: 'cantidad', headerName: 'Veces Utilizado', type: 'number', width: 180 },
];

export const FrecuenciaAdicionalesReporte: React.FC = () => {
  const [frecuencia, setFrecuencia] = useState<FrecuenciaAdicional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFrecuencia = async () => {
      try {
        const data = await getFrecuenciaAdicionales();
        setFrecuencia(data);
      } catch (err) {
        console.error("Error al cargar la frecuencia de adicionales:", err);
        setError("No se pudo cargar el reporte de frecuencias.");
      } finally {
        setLoading(false);
      }
    };

    fetchFrecuencia();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
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
        Frecuencia de Uso de Adicionales
      </Typography>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
        
          getRowId={(row) => row.nombreAdicional}
          rows={frecuencia}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
            sorting: {
              sortModel: [{ field: 'cantidad', sort: 'desc' }],
            },
          }}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          localeText={esESGrid.components.MuiDataGrid.defaultProps.localeText}
        />
      </Box>
    </Paper>
  );
};
