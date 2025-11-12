import React, { useState, useMemo } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Paper, Collapse, Alert, Divider, Grid } from "@mui/material";
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
  Tooltip,
  IconButton,
  FormControlLabel,
  Switch,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from "@mui/material";
import { BotonDetalles, BotonEditar, BotonEliminar} from "../Botones";
import FilterListIcon from "@mui/icons-material/FilterList";
import HistoryIcon from "@mui/icons-material/History";
import EntityCard, { CardConfig } from "./EntityCard";
import { esES as esESGrid } from "@mui/x-data-grid/locales";
import { keyframes } from "@emotion/react";
import { Funnel, X } from "lucide-react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import VisibilityOutlinedIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/Delete";

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
        width: 100,
        sortable: false,
        align: "center",
        headerAlign: "center",
        
        renderCell: (params) => {
          const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
          const open = Boolean(anchorEl);
          
          const theme = useTheme();
          const editColors = (theme.palette as any).actionButtons.edit;
          const deleteColors = (theme.palette as any).actionButtons.delete;
          const detailsColors = (theme.palette as any).actionButtons.details;

          const handleClick = (event: React.MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget);
          };

          const handleClose = () => {
            setAnchorEl(null);
          };

          const handleViewClick = () => {
            if (handleView) handleView(params.row);
            handleClose();
          };

          const handleEditClick = () => {
            if (handleEdit) handleEdit(params.row);
            handleClose();
          };

          const handleDeleteClick = () => {
            if (handleDelete) handleDelete(params.row);
            handleClose();
          };

          const handleHistoryClick = () => {
            if (handleMostrarHistorial) handleMostrarHistorial(params.row.id);
            handleClose();
          }

          const actionCount = [handleView, handleEdit, handleDelete, (entidad === "tarifa" && handleMostrarHistorial)].filter(Boolean).length;

          if (actionCount === 0) {
            return null;
          }

          return (
            <Box>
              <Tooltip title="Acciones">
                <IconButton
                  aria-label="acciones"
                  id="acciones-button"
                  aria-controls={open ? 'acciones-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                  disabled={actionsDisabled}
                >
                  <MoreHorizIcon />
                </IconButton>
              </Tooltip>
              <Menu
                id="acciones-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'acciones-button',
                  subheader: <ListSubheader component="div">Acciones</ListSubheader>,
                }}
              >
                {handleEdit && (
                  <MenuItem onClick={handleEditClick} sx={{ color: editColors.text }}>
                    <ListItemIcon>
                      <EditIcon fontSize="small" sx={{ color: editColors.text }} />
                    </ListItemIcon>
                    <ListItemText>Editar</ListItemText>
                  </MenuItem>
                )}

                {handleDelete && (
                  <MenuItem onClick={handleDeleteClick} sx={{ color: deleteColors.text }}>
                    <ListItemIcon>
                      <DeleteOutlineIcon fontSize="small" sx={{ color: deleteColors.text }} />
                    </ListItemIcon>
                    <ListItemText>Eliminar</ListItemText>
                  </MenuItem>
                )}
                
                {handleView && (
                  <MenuItem onClick={handleViewClick} sx={{ color: detailsColors.text }}>
                    <ListItemIcon>
                      <VisibilityOutlinedIcon fontSize="small" sx={{ color: detailsColors.text }} />
                    </ListItemIcon>
                    <ListItemText>Detalles</ListItemText>
                  </MenuItem>
                )}
                
                {entidad === "tarifa" && handleMostrarHistorial && (
                  <MenuItem onClick={handleHistoryClick}>
                    <ListItemIcon>
                      <HistoryIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Ver Historial</ListItemText>
                  </MenuItem>
                )}
              </Menu>
            </Box>
          );
        },
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
    actionsDisabled,
  ]);

  if (!columnasBase) {
    return (
      <Alert severity="warning">
        No hay una configuración de columnas para la entidad: '{entidad}'.
      </Alert>
    );
  }

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
            "&:hover": {
              backgroundColor: "#f5f5f5",
              borderColor: "#ccc",
            },
            boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            border: "0.5px solid #C7C7C7",
            padding: "8px 20px",
            textTransform: "none",
          }}
        >
          Filtros
        </Button>
      </Box>

      <Collapse in={filtrosVisibles}>
        <Paper
          elevation={3}
          sx={{
            p: 2.5,
            mb: 3,
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
            border: "1px solid #c7c7c7",
          }}
        >
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {columnasBase.map((col) => (
              <Grid item xs={12} sm={6} md={3} key={col.field}>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ mb: 0.5, display: "block", fontWeight: 500 }}
                >
                  {filterTitles[col.field] || col.headerName}
                </Typography>
                <FormControl fullWidth variant="outlined">
                  <Autocomplete
                    size="medium"
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
                      />
                    )}
                    fullWidth
                  />
                </FormControl>
              </Grid>
            ))}

            {showHistoricoSwitch && onHistoricoChange && (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  pt: { xs: 0, md: 3 },
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={historicoChecked}
                      onChange={onHistoricoChange}
                      color="primary"
                    />
                  }
                  label="Mostrar histórico completo"
                  sx={{ mb: 1 }}
                />
              </Grid>
            )}
          </Grid>

          <Box
            display="flex"
            mt={2}
            sx={{
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: { xs: "flex-start", md: "flex-end" },
              gap: 1,
              borderTop: "1px solid #EAEAEA",
              pt: 2,
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              startIcon={<X size={16} />}
              sx={{
                borderRadius: "8px",
                padding: "10px 20px",
                textTransform: "none",
                borderColor: "#D0D0D5",
                color: "#5A5A65",
                fontWeight: 600,
                fontSize: "0.9rem",
                "&:hover": {
                  backgroundColor: "#F6F6F8",
                  borderColor: "#B0B0B0",
                },
                width: { xs: "100%", md: "auto" },
              }}
              onClick={limpiarFiltros}
            >
              Limpiar filtros
            </Button>
            <Button
              variant="text"
              color="primary"
              startIcon={<Funnel size={16} />}
              sx={{
                borderRadius: "8px",
                padding: "10px 20px",
                textTransform: "none",
                backgroundColor: "#E65F2B",
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.9rem",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#C94715",
                  boxShadow: "none",
                },
                width: { xs: "100%", md: "auto" },
              }}
              onClick={() => setFiltrosVisibles(false)}
            >
              Aplicar filtros
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
