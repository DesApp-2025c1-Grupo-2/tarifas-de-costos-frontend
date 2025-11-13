// desapp-2025c1-grupo-2/tarifas-de-costos-frontend/tarifas-de-costos-frontend-feature-final/src/components/tablas/tablaDinamica.tsx
import React, { useState, useMemo } from "react";
// --- (Importaciones de componentes de Tabla se mantienen) ---
import {
  Paper,
  Collapse,
  Alert,
  Divider,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  // --- (Importaciones de paginación) ---
  Pagination,
  Select,
  MenuItem,
} from "@mui/material";
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
  // MenuItem, // <--- Ya está importado arriba
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
// --- (Resto de importaciones se mantienen) ---
import { BotonDetalles, BotonEditar, BotonEliminar } from "../Botones";
import FilterListIcon from "@mui/icons-material/FilterList";
import HistoryIcon from "@mui/icons-material/History";
import EntityCard, { CardConfig } from "./EntityCard";
import { keyframes } from "@emotion/react";
import { Funnel, X } from "lucide-react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import VisibilityOutlinedIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/Delete";

// --- (Definición de ColumnDef se mantiene) ---
interface ColumnDef {
  field: string;
  headerName: string;
  width?: number;
  align?: "left" | "right" | "center";
  headerAlign?: "left" | "right" | "center";
  sortable?: boolean;
  renderCell?: (params: { row: any; value: any }) => React.ReactNode;
  valueGetter?: (...args: any[]) => any;
  valueFormatter?: (...args: any[]) => any;
}

interface DataTableProps {
  // ... (props se mantienen igual) ...
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

// ... (cardConfigs y highlightAnimation se mantienen igual) ...
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
  // ... (resto de cardConfigs se mantienen) ...
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
  const columnasBase = columnas[entidad] as ColumnDef[];
  const [filtros, setFiltros] = useState<{ [key: string]: string }>({});
  const [filtrosVisibles, setFiltrosVisibles] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ... (rowsFiltrados se mantiene igual) ...
  const rowsFiltrados = useMemo(() => {
    if (!rows) return [];
    const filteredRows =
      entidad === "tarifa"
        ? rows.filter((row) => row.esVigente !== false)
        : rows.filter((row) => row.activo !== false);
    return filteredRows.filter((row) =>
      columnasBase.every((col: ColumnDef) => {
        const valFiltro = filtros[col.field];
        if (!valFiltro) return true;
        return row[col.field]
          ?.toString()
          .toLowerCase()
          .includes(valFiltro.toLowerCase());
      })
    );
  }, [rows, entidad, filtros, columnasBase]);

  // ... (valoresUnicosPorColumna se mantiene igual) ...
  const valoresUnicosPorColumna = useMemo(() => {
    const valores: { [key: string]: (string | number)[] } = {};
    if (!columnasBase) return valores;
    columnasBase.forEach((col: ColumnDef) => {
      const field = col.field;
      const unicos = Array.from(
        new Set(rowsFiltrados.map((r) => r[field]).filter(Boolean))
      );
      valores[field] = unicos;
    });
    return valores;
  }, [rowsFiltrados, columnasBase]);

  // ... (handleFiltroChange y limpiarFiltros se mantienen igual) ...
  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };
  const limpiarFiltros = () => setFiltros({});

  // ... (pluralEntityMap se mantiene igual) ...
  const pluralEntityMap: Partial<Record<Entidad, string>> = {
    tarifa: "tarifas",
    transportista: "transportistas",
    vehiculo: "vehículos",
    tipoDeVehiculo: "tipos de vehículo",
    tipoDeCarga: "cargas",
    zona: "zonas",
    adicional: "adicionales",
    combustible: "cargas",
  };
  const entidadPlural = pluralEntityMap[entidad] || entidad;

  // ... (Funciones de paginación se mantienen) ...
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<any>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ... (paginatedRows se mantiene igual) ...
  const paginatedRows = useMemo(
    () =>
      rowsFiltrados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [rowsFiltrados, page, rowsPerPage]
  );
  // ... (columnasConAcciones se mantiene igual) ...
  const columnasConAcciones = useMemo(() => {
    if (!columnasBase) return [];
    let cols: ColumnDef[] = [...columnasBase];

    // ... (lógica de 'adicionales' se mantiene) ...
    if (entidad === "tarifa" && handleMostrarAdicionales) {
      cols.push({
        field: "adicionales",
        headerName: "Adicionales",
        width: 150,
        sortable: false,
        // @ts-ignore
        renderCell: (params: { row: any; value: any }) => {
          // ... (código se mantiene) ...
          const tieneAdicionales =
            params.value &&
            Array.isArray(params.value) &&
            params.value.length > 0;
          if (tieneAdicionales) {
            return (
              <Button
                variant="text"
                size="small"
                onClick={() =>
                  handleMostrarAdicionales &&
                  handleMostrarAdicionales(params.value)
                }
              >
                VER ({params.value.length})
              </Button>
            );
          }
          return null;
        },
      });
    }

    // ... (lógica de 'acciones' se mantiene) ...
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
        // @ts-ignore
        renderCell: (params: { row: any }) => {
          // ... (código de renderCell se mantiene igual) ...
          const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(
            null
          );
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
          };

          const actionCount = [
            handleView,
            handleEdit,
            handleDelete,
            entidad === "tarifa" && handleMostrarHistorial,
          ].filter(Boolean).length;

          if (actionCount === 0) {
            return null;
          }

          return (
            <Box>
              <Tooltip title="Acciones">
                <IconButton
                  aria-label="acciones"
                  id="acciones-button"
                  aria-controls={open ? "acciones-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
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
                  "aria-labelledby": "acciones-button",
                  subheader: (
                    <ListSubheader component="div" sx={{ textAlign: "center" }}>
                      Acciones
                    </ListSubheader>
                  ),
                }}
              >
                {handleEdit && (
                  <MenuItem
                    onClick={handleEditClick}
                    sx={{
                      color: editColors.text,
                      paddingY: "6px",
                      paddingX: "12px",
                    }}
                  >
                    <ListItemIcon>
                      <EditIcon
                        fontSize="small"
                        sx={{ color: editColors.text }}
                      />
                    </ListItemIcon>
                    <ListItemText>Editar</ListItemText>
                  </MenuItem>
                )}

                {handleDelete && (
                  <MenuItem
                    onClick={handleDeleteClick}
                    sx={{
                      color: deleteColors.text,
                      paddingY: "6px",
                      paddingX: "12px",
                    }}
                  >
                    <ListItemIcon>
                      <DeleteOutlineIcon
                        fontSize="small"
                        sx={{ color: deleteColors.text }}
                      />
                    </ListItemIcon>
                    <ListItemText>Eliminar</ListItemText>
                  </MenuItem>
                )}

                {handleView && (
                  <MenuItem
                    onClick={handleViewClick}
                    sx={{
                      color: detailsColors.text,
                      paddingY: "6px",
                      paddingX: "12px",
                    }}
                  >
                    <ListItemIcon>
                      <VisibilityOutlinedIcon
                        fontSize="small"
                        sx={{ color: detailsColors.text }}
                      />
                    </ListItemIcon>
                    <ListItemText>Detalles</ListItemText>
                  </MenuItem>
                )}

                {entidad === "tarifa" && handleMostrarHistorial && (
                  <MenuItem
                    onClick={handleHistoryClick}
                    sx={{
                      paddingY: "6px",
                      paddingX: "12px",
                    }}
                  >
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
  // ... (filterTitles se mantiene igual) ...
  const filterTitles: { [key: string]: string } = {
    // ... (resto de filterTitles se mantienen) ...
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
      {/* ... (Filtros se mantiene igual) ... */}
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
            {columnasBase.map((col: ColumnDef) => (
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
                      <TextField {...params} label="" variant="outlined" />
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
      {/* ... (Fin Filtros) ... */}

      {/* --- (Contenido de Tabla/Cards) --- */}
      {esMovil ? (
        <Box>
          {paginatedRows.map((row) => (
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
        <Box>
          <Paper
            variant="outlined"
            sx={{
              width: "100%",
              overflow: "hidden",
              border: "1px solid #e0e0e0",
              backgroundColor: "white",
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}
          >
            <TableContainer>
              <Table
                stickyHeader
                sx={{
                  // ... (estilos de tabla se mantienen) ...
                  "& .MuiTableCell-head": {
                    backgroundColor: "#f5f6f7",
                    color: "#5A5A65",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    letterSpacing: 0.3,
                    borderBottom: "1px solid #e5e7eb",
                  },
                  "& .MuiTableCell-body": {
                    borderBottom: "1px solid #f0f0f0",
                    fontSize: "0.9rem",
                    color: "#5A5A65",
                  },
                  "& .MuiTableRow-root:hover": {
                    backgroundColor: "#FFFBEB", // Ámbar pálido
                  },
                  "& .highlight": {
                    animation: `${highlightAnimation} 4s ease-out`,
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    {columnasConAcciones.map((col: ColumnDef) => (
                      <TableCell
                        key={col.field}
                        align={col.align || "left"}
                        style={{
                          width: col.width,
                          minWidth: col.width,
                          padding: "14px 18px",
                        }}
                      >
                        {col.headerName}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRows.map((row) => (
                    <TableRow
                      key={row.id}
                      className={row.id === highlightedId ? "highlight" : ""}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        borderTop: "0.5px solid #C7C7C7",
                      }}
                    >
                      {columnasConAcciones.map((col: ColumnDef) => {
                        let cellValue: any;
                        if (col.valueGetter) {
                          // @ts-ignore
                          cellValue = col.valueGetter(
                            row[col.field],
                            row,
                            col,
                            React.createRef()
                          );
                        } else {
                          cellValue = row[col.field];
                        }

                        let cellContent: React.ReactNode;
                        if (col.renderCell) {
                          // @ts-ignore
                          cellContent = col.renderCell({
                            row: row,
                            value: cellValue,
                          });
                        } else if (col.valueFormatter) {
                          // @ts-ignore
                          cellContent = col.valueFormatter(cellValue);
                        } else {
                          cellContent = cellValue;
                        }

                        return (
                          <TableCell
                            key={col.field}
                            align={col.align || "left"}
                            sx={{ padding: "20px 18px" }}
                          >
                            {cellContent}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      )}
      {/* --- (Fin Contenido de Tabla/Cards) --- */}

      {/* --- INICIO: PIE DE PÁGINA PERSONALIZADO (Corregido) --- */}
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          padding: theme.spacing(1, 2),
          borderTop: "none",
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          backgroundColor: "white",
          gap: 2,
          [theme.breakpoints.down("md")]: {
            flexDirection: "column",
            alignItems: "center",
          },
        }}
      >
        {/* 1. Lado Izquierdo: Mostrando... */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            [theme.breakpoints.down("md")]: {
              order: 1,
            },
          }}
        >
          Mostrando {rowsFiltrados.length > 0 ? page * rowsPerPage + 1 : 0}–
          {Math.min((page + 1) * rowsPerPage, rowsFiltrados.length)} de{" "}
          {rowsFiltrados.length} {entidadPlural}
        </Typography>

        {/* 2. Contenedor Derecho */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            [theme.breakpoints.down("md")]: {
              order: 2,
              flexDirection: "column",
              gap: 2,
            },
          }}
        >
          {/* 2a. Filas por página */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              [theme.breakpoints.down("md")]: {
                order: 1,
              },
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Filas por página
            </Typography>
            <FormControl variant="outlined" size="small">
              <Select
                value={rowsPerPage}
                // @ts-ignore
                onChange={handleChangeRowsPerPage}
                sx={{
                  fontSize: "0.875rem",
                  "& .MuiSelect-select": {
                    paddingTop: "6px",
                    paddingBottom: "6px",
                  },
                }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* 2b. Paginación */}
          <Pagination
            count={Math.ceil(rowsFiltrados.length / rowsPerPage)}
            page={page + 1}
            onChange={(event, newPage) => handleChangePage(null, newPage - 1)}
            color="primary"
            size={esMovil ? "small" : "large"}
            showFirstButton={false}
            showLastButton={false}
            sx={{
              [theme.breakpoints.down("md")]: {
                order: 2,
              },

              // --- INICIO: MODIFICACIÓN "HÍBRIDA" ---

              "& .MuiPaginationItem-root": {
                fontWeight: 600,
                borderRadius: "8px",
              },

              "& .MuiPaginationItem-page.Mui-selected": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                border: `1px solid ${theme.palette.primary.main}`,
                "&:hover": {
                  backgroundColor: "#C94715", // Naranja más oscuro
                },
              },

              // --- INICIO DE LA MODIFICACIÓN (HOVER) ---
              "& .MuiPaginationItem-page:not(.Mui-selected)": {
                backgroundColor: "white",
                color: theme.palette.primary.main,
                border: `1px solid ${theme.palette.primary.main}`,
                "&:hover": {
                  // Usamos el color ÁMBAR (secondary.main) para el hover
                  backgroundColor: theme.palette.secondary.main,
                  color: theme.palette.primary.main, // Mantenemos el texto naranja
                },
              },

              "& .MuiPaginationItem-previousNext": {
                backgroundColor: "white",
                color: theme.palette.primary.main,
                border: `1px solid ${theme.palette.primary.main}`,
                "&:hover": {
                  // Usamos el color ÁMBAR (secondary.main) para el hover
                  backgroundColor: theme.palette.secondary.main,
                },
              },
              // --- FIN DE LA MODIFICACIÓN (HOVER) ---

              "& .MuiPaginationItem-ellipsis": {
                border: "none",
                backgroundColor: "transparent",
                color: theme.palette.text.primary,
              },
              // --- FIN: MODIFICACIÓN "HÍBRIDA" ---
            }}
          />
        </Box>
        {/* --- FIN: Contenedor Derecho --- */}
      </Paper>
      {/* --- FIN: PIE DE PÁGINA PERSONALIZADO --- */}
    </Box>
  );
}
