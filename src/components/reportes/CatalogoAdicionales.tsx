import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Paper, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { obtenerAdicionales, Adicional } from '../../services/adicionalService';
import { getFrecuenciaAdicionales, FrecuenciaAdicional } from '../../services/reporteService';
import { esES as esESGrid } from "@mui/x-data-grid/locales";

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'nombre', headerName: 'Nombre Adicional', flex: 1 },
  { field: 'descripcion', headerName: 'Descripción', flex: 1 },
  {
    field: 'cantidad',
    headerName: 'Veces Utilizado',
    type: 'number',
    width: 180,
  },
  {
    field: 'costoDefault',
    headerName: 'Costo Base',
    type: 'number',
    width: 150,
    valueFormatter: (value) => `$${((value as number) ?? 0).toFixed(2)}`
  },
];

const CatalogoAdicionales: React.FC = () => {
  const [adicionalesCombinados, setAdicionalesCombinados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [adicionales, frecuencia] = await Promise.all([
          obtenerAdicionales(),
          getFrecuenciaAdicionales(),
        ]);

        const activos = adicionales.filter(a => a.activo !== false);

        // Crear un map rápido por nombre para unir
        const frecuenciaMap = new Map(
          frecuencia.map(f => [f.nombreAdicional, f.cantidad])
        );

        // Combinar datos
        const combinados = activos.map(a => ({
          ...a,
          cantidad: frecuenciaMap.get(a.nombre) ?? 0,
        }));

        setAdicionalesCombinados(combinados);
      } catch (err) {
        console.error("Error al cargar los datos de adicionales:", err);
        setError("No se pudieron cargar los datos. Intente más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
        Catálogo de Adicionales con Frecuencia de Uso
      </Typography>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={adicionalesCombinados}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
            sorting: {
              sortModel: [{ field: 'cantidad', sort: 'desc' }],
            },
          }}
          getRowId={(row) => row.id}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          localeText={esESGrid.components.MuiDataGrid.defaultProps.localeText}
        />
      </Box>
    </Paper>
  );
};

export default CatalogoAdicionales;
