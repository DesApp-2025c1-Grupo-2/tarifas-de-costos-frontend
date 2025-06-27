import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Paper, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { obtenerAdicionales, Adicional } from '../../services/adicionalService';
import { esES as esESGrid } from "@mui/x-data-grid/locales"; 

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'nombre', headerName: 'Nombre Adicional', flex: 1 },
  { field: 'descripcion', headerName: 'Descripción', flex: 1 },
  { 
    field: 'costoDefault', 
    headerName: 'Costo Base', 
    type: 'number', 
    width: 150,
    
    valueFormatter: (value) => `$${((value as number) ?? 0).toFixed(2)}` 
    
  },
];

const CatalogoAdicionales: React.FC = () => {
  const [adicionales, setAdicionales] = useState<Adicional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdicionales = async () => {
      try {
        const data = await obtenerAdicionales();
        setAdicionales(data.filter(adicional => adicional.activo !== false));
      } catch (err) {
        console.error("Error al cargar el catálogo de adicionales:", err);
        setError("No se pudo cargar el catálogo de adicionales. Intente más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdicionales();
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
        Catálogo de Adicionales
      </Typography>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={adicionales}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
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

export default CatalogoAdicionales;