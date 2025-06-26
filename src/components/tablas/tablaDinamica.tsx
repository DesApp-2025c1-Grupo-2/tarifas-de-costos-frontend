// ruta: src/components/tablas/tablaDinamica.tsx

import React, { useState, useMemo } from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { columnas, Entidad } from "./columnas";
import { BotonEditar, BotonEliminar, BotonVer } from "../Botones";
import {
  Box,
  Autocomplete,
  FormControl,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";

// --- INICIO DE LA MODIFICACIÓN ---
// Se importa el objeto de localización desde la ruta correcta.
import { esES as esESGrid } from "@mui/x-data-grid/locales";
// --- FIN DE LA MODIFICACIÓN ---

interface DataTableProps {
  rows: any[];
  entidad: Entidad;
  handleEdit?: (row: any) => void;
  handleDelete?: (id: number) => void;
  handleView?: (row: any) => void;
  handleMostrarAdicionales?: (adicionales: any[]) => void;
}

export default function DataTable({
  rows,
  entidad,
  handleEdit,
  handleDelete,
  handleView,
  handleMostrarAdicionales,
}: DataTableProps) {
  const columnasBase = columnas[entidad];
  const [filtros, setFiltros] = useState<{ [key: string]: string }>({});

  const rowsFiltrados = useMemo(() => {
    const filteredRows =
      entidad === "tarifa"
        ? rows.filter((row) => row.esVigente !== false)
        : rows.filter((row) => row.activo !== false);

    return filteredRows.filter((row) =>
      columnasBase.every((col) => {
        const valFiltro = filtros[col.field];
        if (!valFiltro) return true;
        return row[col.field]
          ?.toString()
          .toLowerCase()
          .includes(valFiltro.toLowerCase());
      })
    );
  }, [rows, entidad, filtros, columnasBase]);

  const valoresUnicosPorColumna = useMemo(() => {
    const valores: { [key: string]: string[] } = {};
    columnasBase.forEach((col) => {
      const field = col.field;
      const unicos = Array.from(
        new Set(rowsFiltrados.map((r) => r[field]).filter(Boolean))
      );
      valores[field] = unicos as string[];
    });
    return valores;
  }, [rowsFiltrados, columnasBase]);

  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  const limpiarFiltros = () => setFiltros({});

  const columnasConAcciones: GridColDef[] = useMemo(() => {
    const cols = [...columnasBase];

    if (entidad === "tarifa") {
      cols.push({
        field: "adicionales",
        headerName: "Adicionales",
        width: 150,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
          const tieneAdicionales =
            params.value &&
            Array.isArray(params.value) &&
            params.value.length > 0;

          if (tieneAdicionales && handleMostrarAdicionales) {
            return (
              <Button
                variant="text"
                size="small"
                onClick={() => handleMostrarAdicionales(params.value)}
              >
                Mostrar ({params.value.length})
              </Button>
            );
          }
          return null;
        },
      });
    }

    cols.push({
      field: "acciones",
      headerName: "Acciones",
      width: 280,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          {handleView && <BotonVer onClick={() => handleView(params.row)} />}
          {handleEdit && <BotonEditar onClick={() => handleEdit(params.row)} />}
          {handleDelete && (
            <BotonEliminar onClick={() => handleDelete(params.row.id)} />
          )}
        </Box>
      ),
    });

    return cols;
  }, [
    columnasBase,
    entidad,
    handleMostrarAdicionales,
    handleView,
    handleEdit,
    handleDelete,
  ]);

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
          getRowId={(row) => row.id}
          initialState={{
            sorting: { sortModel: [{ field: "id", sort: "desc" }] },
            pagination: { paginationModel: { page: 0, pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10]}
          sx={{ border: 0 }}
          // --- INICIO DE LA MODIFICACIÓN ---
          // Se usa el objeto de localización importado desde la ruta correcta.
          localeText={esESGrid.components.MuiDataGrid.defaultProps.localeText}
          // --- FIN DE LA MODIFICACIÓN ---
        />
      </Paper>
    </Box>
  );
}
