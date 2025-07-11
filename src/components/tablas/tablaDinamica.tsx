import React, { useState, useMemo } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { columnas, Entidad } from "./columnas";
import {
  Box,
  Autocomplete,
  FormControl,
  TextField,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EntityCard, { CardConfig } from "./EntityCard";
import { esES as esESGrid } from "@mui/x-data-grid/locales";
import { keyframes } from "@emotion/react";

interface DataTableProps {
  rows: any[];
  entidad: Entidad;
  handleEdit?: (row: any) => void;
  handleDelete?: (row: any) => void;
  handleView?: (row: any) => void;
  handleMostrarAdicionales?: (adicionales: any[]) => void;
  highlightedId?: number | null;
}

const cardConfigs: Record<Entidad, CardConfig> = {
  tarifa: {
    titleField: "transportistaNombre",
    subtitleField: "total",
    detailFields: ["tipoVehiculoNombre", "zonaNombre", "tipoCargaNombre"],
    fieldLabels: {
      total: "Costo Total",
      tipoVehiculoNombre: "Vehículo",
      zonaNombre: "Zona",
      tipoCargaNombre: "Carga",
    },
  },
  transportista: {
    titleField: "nombreEmpresa",
    subtitleField: "contactoNombre",
    detailFields: ["contactoEmail", "contactoTelefono"],
    fieldLabels: {
      contactoNombre: "Contacto",
      contactoEmail: "Email",
      contactoTelefono: "Teléfono",
    },
  },
  tipoDeVehiculo: {
    titleField: "nombre",
    detailFields: ["capacidadPesoKG", "capacidadVolumenM3", "descripcion"],
    fieldLabels: {
      capacidadPesoKG: "Peso (KG)",
      capacidadVolumenM3: "Volumen (M³)",
      descripcion: "Descripción",
    },
  },
  tipoDeCarga: {
    titleField: "nombre",
    detailFields: ["descripcion"],
    fieldLabels: {
      descripcion: "Descripción",
    },
  },
  zona: {
    titleField: "nombre",
    detailFields: ["descripcion", "regionMapa"],
    fieldLabels: {
      descripcion: "Descripción",
      regionMapa: "Región",
    },
  },
  adicional: {
    titleField: "nombre",
    subtitleField: "costoDefault",
    detailFields: ["descripcion"],
    fieldLabels: {
      costoDefault: "Costo",
      descripcion: "Descripción",
    },
  },
};

const highlightAnimation = keyframes`
  0% { background-color: rgba(124, 179, 66, 0.4); }
  100% { background-color: transparent; }
`;

export default function DataTable({
  rows,
  entidad,
  handleEdit,
  handleDelete,
  handleView,
  handleMostrarAdicionales,
  highlightedId,
}: DataTableProps) {
  const theme = useTheme();
  const esMovil = useMediaQuery(theme.breakpoints.down("md"));
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
    const valores: { [key: string]: (string | number)[] } = {};
    columnasBase.forEach((col) => {
      const field = col.field;
      const unicos = Array.from(
        new Set(rowsFiltrados.map((r) => r[field]).filter(Boolean))
      );
      valores[field] = unicos;
    });
    return valores;
  }, [rowsFiltrados, columnasBase]);

  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  const limpiarFiltros = () => setFiltros({});

  const columnasConAcciones: GridColDef[] = useMemo(() => {
    let cols = [...columnasBase];

    if (entidad === "tarifa" && handleMostrarAdicionales) {
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
          if (tieneAdicionales) {
            return (
              <Button
                variant="text"
                size="small"
                onClick={() => handleMostrarAdicionales(params.value)}
              >
                VER ({params.value.length})
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
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 1,
          }}
        >
          {handleView && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleView(params.row)}
            >
              Ver
            </Button>
          )}
          {handleEdit && (
            <Button
              variant="contained"
              size="small"
              onClick={() => handleEdit(params.row)}
            >
              Editar
            </Button>
          )}
          {handleDelete && (
            <Button
              variant="contained"
              size="small"
              color="error"
              onClick={() => handleDelete(params.row)}
            >
              Eliminar
            </Button>
          )}
        </Box>
      ),
    });
    return cols;
  }, [
    columnasBase,
    entidad,
    handleEdit,
    handleDelete,
    handleView,
    handleMostrarAdicionales,
  ]);

  return (
    <Box sx={{ width: "100%" }}>
      <Accordion sx={{ mb: 3, boxShadow: "none", border: "1px solid #e0e0e0" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="filtros-panel-content"
          id="filtros-panel-header"
        >
          <Typography variant="h6">Filtros</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {columnasBase.map((col) => (
              <Box key={col.field} sx={{ flex: "1 1 200px" }}>
                <FormControl fullWidth variant="outlined" size="small">
                  <Autocomplete
                    options={valoresUnicosPorColumna[col.field] || []}
                    getOptionLabel={(option) => String(option)}
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
              </Box>
            ))}
            <Box sx={{ flex: "1 1 200px", alignSelf: "center" }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={limpiarFiltros}
                sx={{ height: "40px" }}
              >
                Limpiar Filtros
              </Button>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      {esMovil ? (
        <Box>
          {rowsFiltrados.map((row) => (
            <EntityCard
              key={row.id}
              item={row}
              config={cardConfigs[entidad]}
              onView={handleView!}
              onEdit={handleEdit!}
              onDelete={handleDelete!}
            />
          ))}
        </Box>
      ) : (
        <Paper sx={{ p: { xs: 1, md: 2 } }}>
          <DataGrid
            rows={rowsFiltrados}
            columns={columnasConAcciones}
            autoHeight
            disableColumnMenu
            checkboxSelection={false}
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
            getRowClassName={(params) =>
              params.id === highlightedId ? "highlight" : ""
            }
            initialState={{
              sorting: { sortModel: [{ field: "id", sort: "desc" }] },
              pagination: { paginationModel: { page: 0, pageSize: 5 } },
            }}
            pageSizeOptions={[5, 10]}
            sx={{
              border: 0,
              "& .highlight": {
                animation: `${highlightAnimation} 4s ease-out`,
              },
            }}
            localeText={esESGrid.components.MuiDataGrid.defaultProps.localeText}
          />
        </Paper>
      )}
    </Box>
  );
}
