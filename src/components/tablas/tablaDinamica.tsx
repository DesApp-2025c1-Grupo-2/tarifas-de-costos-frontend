import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { columnas, Entidad } from "./columnas";
import { BotonEditar, BotonEliminar } from "../Botones";
import { useState, useMemo } from "react";
import {
  Box,
  Autocomplete,
  FormControl,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface DataTableProps {
  rows: any[];
  entidad: Entidad;
  handleEdit?: (row: any) => void;
  handleDelete?: (id: number) => void;
  handleView?: (row: any) => void; // Nueva prop para manejar la vista
}

export default function DataTable({
  rows,
  entidad,
  handleEdit,
  handleDelete,
  handleView,
}: DataTableProps) {
  const columnasBase = columnas[entidad];
  const [filtros, setFiltros] = useState<{ [key: string]: string }>({});

  const rowsActivos = useMemo(() => {
    return rows.filter((row) => row.activo !== false);
  }, [rows]);

  const valoresUnicosPorColumna = useMemo(() => {
    const valores: { [key: string]: string[] } = {};
    columnasBase.forEach((col) => {
      const field = col.field;
      const unicos = Array.from(
        new Set(rowsActivos.map((r) => r[field]).filter(Boolean))
      );
      valores[field] = unicos;
    });
    return valores;
  }, [rowsActivos, columnasBase]);

  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  const limpiarFiltros = () => setFiltros({});

  const rowsFiltrados = useMemo(() => {
    return rowsActivos.filter((row) =>
      columnasBase.every((col) => {
        const valFiltro = filtros[col.field];
        if (!valFiltro) return true;
        return row[col.field]
          ?.toString()
          .toLowerCase()
          .includes(valFiltro.toLowerCase());
      })
    );
  }, [rowsActivos, filtros, columnasBase]);

  const columnasConAcciones: GridColDef[] = [
    ...columnasBase,
    {
      field: "acciones",
      headerName: "Acciones",
      width: 250,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%", // <-- ESTA ES LA PROPIEDAD QUE FALTABA
          }}
        >
          {handleView && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleView(params.row)}
              startIcon={<VisibilityIcon />}
            >
              Ver
            </Button>
          )}
          {handleEdit && (
            <BotonEditar onClick={() => handleEdit(params.row)}>
              Editar
            </BotonEditar>
          )}
          {handleDelete && (
            <BotonEliminar onClick={() => handleDelete(params.row.id)}>
              Eliminar
            </BotonEliminar>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filtros
        </Typography>
        <Grid
          component="div"
          sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}
        >
          {columnasBase.map((col) => (
            <Grid key={col.field} component="div" sx={{ flex: "1 1 25%" }}>
              <FormControl
                fullWidth
                variant="outlined"
                size="small"
                sx={{ minWidth: 120 }}
              >
                <Autocomplete
                  options={valoresUnicosPorColumna[col.field] || []}
                  onInputChange={(_, newValue) =>
                    handleFiltroChange(col.field, newValue || "")
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={col.headerName}
                      variant="outlined"
                      size="small"
                    />
                  )}
                  fullWidth
                />
              </FormControl>
            </Grid>
          ))}
          <Grid component="div" sx={{ flex: "1 1 25%" }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={limpiarFiltros}
              sx={{ height: "100%" }}
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
          disableColumnMenu
          initialState={{
            sorting: { sortModel: [{ field: "id", sort: "desc" }] },
            pagination: { paginationModel: { page: 0, pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10]}
          sx={{ border: 0 }}
        />
      </Paper>
    </Box>
  );
}
