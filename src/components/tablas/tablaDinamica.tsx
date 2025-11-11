import React, { useState, useMemo } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
// --- INICIO MODIFICACIÓN 1: Importar Divider y Grid ---
import {
  Paper,
  Collapse,
  Alert,
  Divider, // <-- Importar Divider
  Grid, // <-- Importar Grid
} from "@mui/material";
// --- FIN MODIFICACIÓN 1 ---
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
  // --- Se quitan imports de Accordion ---
  Tooltip,
  IconButton,
  FormControlLabel, // <-- Importar
  Switch, // <-- Importar
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList"; // <-- Importar ícono de Filtro
import HistoryIcon from "@mui/icons-material/History";
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
  handleMostrarHistorial?: (tarifaId: number) => void;
  highlightedId?: number | string | null;
  actionsDisabled?: boolean;
  showHistoricoSwitch?: boolean;
  historicoChecked?: boolean;
  onHistoricoChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
    subtitleField: "cuit",
    detailFields: ["contactoNombre", "contactoEmail", "contactoTelefono"],
    fieldLabels: {
      cuit: "CUIT",
      contactoNombre: "Contacto",
      contactoEmail: "Email",
      contactoTelefono: "Teléfono",
    },
  },
  vehiculo: {
    titleField: "patente",
    subtitleField: "marca",
    detailFields: ["modelo", "anio", "tipoVehiculoNombre"],
    fieldLabels: {
      marca: "Marca",
      modelo: "Modelo",
      anio: "Año",
      tipoVehiculoNombre: "Tipo",
    },
  },
  tipoDeVehiculo: {
    titleField: "nombre",
    detailFields: ["descripcion"],
    fieldLabels: {
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
  combustible: {
    titleField: "vehiculoNombre",
    subtitleField: "precioTotal",
    detailFields: ["fecha", "numeroTicket", "litrosCargados"],
    fieldLabels: {
      precioTotal: "Precio Total",
      fecha: "Fecha",
      numeroTicket: "Ticket Nro.",
      litrosCargados: "Litros",
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
  handleMostrarHistorial,
  highlightedId,
  actionsDisabled = false,
  showHistoricoSwitch = false,
  historicoChecked = false,
  onHistoricoChange,
}: DataTableProps) {
  const theme = useTheme();
  const esMovil = useMediaQuery(theme.breakpoints.down("md"));
  const columnasBase = columnas[entidad];
  const [filtros, setFiltros] = useState<{ [key: string]: string }>({});
  const [filtrosVisibles, setFiltrosVisibles] = useState(false);

  const rowsFiltrados = useMemo(() => {
    if (!rows) return [];
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
    if (!columnasBase) return valores;
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
    if (!columnasBase) return [];
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

    if (
      entidad === "tarifa" ||
      entidad === "adicional" ||
      entidad === "zona" ||
      entidad === "tipoDeCarga" ||
      entidad === "combustible"
    ) {
      cols.push({
        field: "acciones",
        headerName: "Acciones",
        width: 280,
        sortable: false,
        align: "right",
        headerAlign: "right",
        renderCell: (params) => (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 1,
            }}
          >
            {entidad === "tarifa" && handleMostrarHistorial && (
              <Tooltip title="Ver Historial">
                <IconButton
                  onClick={() => handleMostrarHistorial(params.row.id)}
                  size="small"
                  disabled={actionsDisabled}
                >
                  <HistoryIcon />
                </IconButton>
              </Tooltip>
            )}
            {handleView && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleView(params.row)}
                disabled={actionsDisabled}
                sx={{
                  backgroundColor: (theme.palette as any).actionButtons.details
                    .background,
                  borderColor: (theme.palette as any).actionButtons.details
                    .border,
                  color: (theme.palette as any).actionButtons.details.text,
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                    borderColor: "#bdbdbd",
                  },
                }}
              >
                Ver
              </Button>
            )}
            {handleEdit && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleEdit(params.row)}
                disabled={actionsDisabled}
                sx={{
                  backgroundColor: (theme.palette as any).actionButtons.edit
                    .background,
                  borderColor: (theme.palette as any).actionButtons.edit.border,
                  color: (theme.palette as any).actionButtons.edit.text,
                  "&:hover": {
                    backgroundColor: "#c7dcfc",
                  },
                }}
              >
                Editar
              </Button>
            )}
            {handleDelete && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleDelete(params.row)}
                disabled={actionsDisabled}
                sx={{
                  backgroundColor: (theme.palette as any).actionButtons.delete
                    .background,
                  borderColor: (theme.palette as any).actionButtons.delete
                    .border,
                  color: (theme.palette as any).actionButtons.delete.text,
                  "&:hover": {
                    backgroundColor: "rgba(255, 53, 53, 0.4)",
                  },
                }}
              >
                Eliminar
              </Button>
            )}
          </Box>
        ),
      });
    }
    return cols;
  }, [
    columnasBase,
    entidad,
    handleEdit,
    handleDelete,
    handleView,
    handleMostrarAdicionales,
    handleMostrarHistorial,
    theme,
    actionsDisabled,
  ]);

  if (!columnasBase) {
    return (
      <Alert severity="warning">
        No hay una configuración de columnas para la entidad: '{entidad}'.
      </Alert>
    );
  }

  // Mapeo de campos a títulos de filtro
  const filterTitles: { [key: string]: string } = {
    // Tarifas
    id: "ID",
    nombreTarifa: "Nombre de Tarifa",
    transportistaNombre: "Transportista",
    tipoVehiculoNombre: "Tipo de Vehículo",
    zonaNombre: "Zona",
    tipoCargaNombre: "Tipo de Carga",
    valorBase: "Costo Base",
    total: "Costo Total",
    // Transportistas
    cuit: "CUIT",
    nombre_comercial: "Nombre Comercial",
    contactoNombre: "Nombre de Contacto",
    contactoEmail: "Email",
    contactoTelefono: "Teléfono",
    // Vehículos
    patente: "Patente",
    marca: "Marca",
    modelo: "Modelo",
    anio: "Año",
    // Genéricos (TipoVehiculo, TipoCarga, Zona, Adicional)
    nombre: "Nombre",
    descripcion: "Descripción",
    // Adicional
    costoDefault: "Costo Base",
    cantidad: "Veces Utilizado",
    // Combustible
    vehiculoNombre: "Vehículo",
    fecha: "Fecha de Carga",
    numeroTicket: "Nro. Ticket",
    litrosCargados: "Litros Cargados",
    precioTotal: "Precio Total",
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-start" }}>
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setFiltrosVisibles(!filtrosVisibles)}
          sx={{
            backgroundColor: "white",
            color: theme.palette.text.primary,
            borderColor: "#e0e0e0",
            "&:hover": {
              backgroundColor: "#f5f5f5",
              borderColor: "#ccc",
            },
          }}
        >
          Filtros
        </Button>
      </Box>

      <Collapse in={filtrosVisibles}>
        <Paper
          variant="outlined"
          sx={{ p: 3, mb: 3, backgroundColor: "white" }}
        >
          <Grid container spacing={3} sx={{ mb: 2 }}>
            {columnasBase.map((col) => (
              // --- INICIO DE LA MODIFICACIÓN (2 Columnas) ---
              <Grid item xs={12} sm={12} md={6} lg={6} key={col.field}>
                {/* --- FIN DE LA MODIFICACIÓN --- */}
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ mb: 0.5, display: "block", fontWeight: 500 }}
                >
                  {filterTitles[col.field] || col.headerName}
                </Typography>
                <FormControl fullWidth variant="outlined">
                  <Autocomplete
                    options={valoresUnicosPorColumna[col.field] || []}
                    getOptionLabel={(option) => String(option)}
                    onInputChange={(_, newValue) =>
                      handleFiltroChange(col.field, newValue || "")
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label=""
                        variant="outlined"
                        size="medium" // <-- Campos más altos
                      />
                    )}
                    fullWidth
                  />
                </FormControl>
              </Grid>
            ))}

            {showHistoricoSwitch && onHistoricoChange && (
              // --- INICIO DE LA MODIFICACIÓN (Ajuste para 2 columnas) ---
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={6}
                sx={{ display: "flex", alignItems: "flex-end" }}
              >
                {/* --- FIN DE LA MODIFICACIÓN --- */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={historicoChecked}
                      onChange={onHistoricoChange}
                      color="primary"
                    />
                  }
                  label="Mostrar histórico completo"
                  sx={{ mb: 1 }} // Ajuste de margen
                />
              </Grid>
            )}
          </Grid>
          <Divider sx={{ my: 2 }} /> {/* <-- Línea divisoria */}
          {/* Botones de acción de filtros */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={limpiarFiltros}
              sx={{ height: "40px" }}
            >
              Limpiar Filtros
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setFiltrosVisibles(false)}
              sx={{ height: "40px" }}
            >
              Aplicar Filtros
            </Button>
          </Box>
        </Paper>
      </Collapse>

      {esMovil ? (
        <Box>
          {rowsFiltrados.map((row) => (
            <EntityCard
              key={row.id}
              item={row}
              config={cardConfigs[entidad]}
              onView={handleView ? () => handleView(row) : undefined}
              onEdit={handleEdit ? () => handleEdit(row) : undefined}
              onDelete={handleDelete ? () => handleDelete(row) : undefined}
              onHistory={
                entidad === "tarifa" && handleMostrarHistorial
                  ? () => handleMostrarHistorial(row.id)
                  : undefined
              }
            />
          ))}
        </Box>
      ) : (
        <Paper
          variant="outlined"
          sx={{
            width: "100%",
            overflow: "hidden",
            border: "1px solid #e0e0e0",
            backgroundColor: "white",
          }}
        >
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
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme.palette.grey[100],
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: theme.palette.action.hover,
              },
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
