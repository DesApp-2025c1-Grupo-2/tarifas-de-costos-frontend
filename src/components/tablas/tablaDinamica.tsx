import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { columnas, Entidad } from './columnas';
import { BotonEditar, BotonEliminar } from '../Botones';
import { useState, useMemo } from 'react';
import {
  Box,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Button,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';


interface DataTableProps {
  rows: any[];
  entidad: Entidad;
  handleEdit: (row: any) => void;
  handleDelete: (id: number) => void;
}

export default function DataTable({ rows, entidad, handleEdit, handleDelete }: DataTableProps) {
  const columnasBase = columnas[entidad];
  const [filtros, setFiltros] = useState<{ [key: string]: string }>({});

  // ⚠️ Solo considerar los activos
  const rowsActivos = useMemo(() => {
    return rows.filter((row) => {
      if ('activo' in row) {
        return row.activo === true;
      } else if ('esVigente' in row) {
        return row.esVigente === true;
      }
      return true; // Si no tiene ninguno de los dos campos, se incluye
    });
  }, [rows]);

  // Valores únicos para filtros, basados en los activos
  const valoresUnicosPorColumna = useMemo(() => {
    const valores: { [key: string]: string[] } = {};

    columnasBase.forEach((col) => {
      const field = col.field;
      const unicos = Array.from(new Set(rowsActivos.map((r) => r[field]).filter(Boolean)));
      valores[field] = unicos;
    });

    return valores;
  }, [rowsActivos, columnasBase]);

  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  const limpiarFiltros = () => setFiltros({});

  // Aplicar filtros sobre los datos activos
  const rowsFiltrados = useMemo(() => {
    return rowsActivos.filter((row) =>
      columnasBase.every((col) => {
        const valFiltro = filtros[col.field];
        if (!valFiltro) return true;
        return row[col.field]?.toString() === valFiltro;
      })
    );
  }, [rowsActivos, filtros, columnasBase]);

  const columnasConAcciones: GridColDef[] = [
    ...columnasBase,
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 250,
      renderCell: (params) => (
        <>
          <BotonEditar onClick={() => handleEdit(params.row)}>Editar</BotonEditar>
          <BotonEliminar onClick={() => handleDelete(params.row.id)}>Eliminar</BotonEliminar>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filtros
        </Typography>
        <Grid component="div" sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {columnasBase.map((col) => (
            <Grid key={col.field} component="div" sx={{ flex: '1 1 25%' }}>
              <FormControl fullWidth variant="outlined" size="small" className="filtro-grande">
                <InputLabel>{col.headerName}</InputLabel>
                <Select
                  label={col.headerName}
                  value={filtros[col.field] || ''}
                  onChange={(e) => handleFiltroChange(col.field, e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {valoresUnicosPorColumna[col.field]?.map((val) => (
                    <MenuItem key={val} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          ))}
          <Grid component="div" sx={{ flex: '1 1 25%' }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={limpiarFiltros}
              sx={{ height: '100%' }}
            >
              Limpiar Filtros
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <DataGrid
          rows={rowsFiltrados}
          columns={columnasConAcciones}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10]} 
          sx={{ border: 0 }}
        />
      </Paper>
    </Box>
  );
}