// Archivo: src/components/reportes/ReporteHistorialServicios.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  ListItemText,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  Autocomplete,
  TextField,
} from "@mui/material";
import {
  getTransportistaProfile,
  TransportistaProfile,
} from "../../services/transportistaService";
import {
  obtenerTransportistas,
  Transportista, // <-- Tipo para la lista del dropdown
} from "../../services/transportistaService";

const parseDateArray = (dateArray: number[]): Date | null => {
  if (!Array.isArray(dateArray) || dateArray.length < 5) {
    return null;
  }
  const [year, month, day, hour, minute, second] = dateArray;
  const date = new Date(year, month - 1, day, hour, minute, second || 0);
  return isNaN(date.getTime()) ? null : date;
};

const ReporteHistorialServicios: React.FC = () => {
  const [transportistas, setTransportistas] = useState<Transportista[]>([]);
  const [selectedTransportistaId, setSelectedTransportistaId] =
    useState<string>("");

  const [profile, setProfile] = useState<TransportistaProfile | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingFiltros, setLoadingFiltros] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const esMovil = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const cargarTransportistas = async () => {
      try {
        const data = await obtenerTransportistas();
        // Filtrar transportistas inactivos si es necesario (asumiendo que 'activo' existe)
        setTransportistas(data.filter((t) => t.activo !== false));
      } catch (err) {
        setError("No se pudieron cargar los transportistas.");
      } finally {
        setLoadingFiltros(false);
      }
    };
    cargarTransportistas();
  }, []);

  const handleTransportistaChange = (event: SelectChangeEvent) => {
    const id = event.target.value;
    setSelectedTransportistaId(id);
    setProfile(null); // Limpiar perfil al cambiar selección
    setError(null);
  };

  const handleGenerarReporte = async () => {
    if (!selectedTransportistaId) {
      setError("Por favor, seleccione un transportista.");
      return;
    }
    setLoading(true);
    setError(null);
    setProfile(null);

    try {
      // Usar directamente el ID string que viene de la API de Viajes
      const profileData = await getTransportistaProfile(selectedTransportistaId);
      setProfile(profileData);
      if (!profileData?.historialServicios?.length) {
         // Puedes setear un mensaje de info en lugar de error si prefieres
         setError("Este transportista no tiene un historial de servicios registrado.");
      }
    } catch (err: any) {
        // Manejar error 404 Not Found si el perfil no existe
        if (err.message.includes('404')) {
            setError("No se encontró el perfil para el transportista seleccionado.");
        } else {
            setError(err.message || "Ocurrió un error al generar el reporte.");
        }
        console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateInput: string | number[]) => {
    if (!dateInput) return "N/A";

    let date: Date | null = null;

    if (Array.isArray(dateInput)) {
      date = parseDateArray(dateInput);
    } else {
      // Intentar parsear como ISO string
      const parsed = new Date(dateInput);
      if (!isNaN(parsed.getTime())) {
        date = parsed;
      }
    }

    if (!date) return "Fecha inválida";

    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      // Opcional: añadir hora si es relevante
      // hour: '2-digit',
      // minute: '2-digit',
    });
  };

  const formatCurrency = (value: number | undefined) => {
    const number = Number(value) || 0;
    return `$${number.toLocaleString("es-AR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  // --- Función para formatear teléfono ---
  const formatTelefono = (telefono: { numero: string, codigo_area?: string | null, codigo_pais?: string | null } | null): string => {
    if (!telefono || !telefono.numero) return "N/A";
    let formatted = "";
    if (telefono.codigo_pais) formatted += `+${telefono.codigo_pais} `;
    if (telefono.codigo_area) formatted += `(${telefono.codigo_area}) `;
    formatted += telefono.numero;
    return formatted;
  }

  return (
    <Paper sx={{ padding: 3, marginTop: 2 }}>
      <Typography variant="h6" gutterBottom>
        Ficha de Transportista
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <Autocomplete
          options={transportistas}
          getOptionLabel={(option) => `${option.nombre_comercial || `ID: ${option.id}`} (${option.cuit})` || ''}
          value={transportistas.find(t => t.id === selectedTransportistaId) || null} // Busca el objeto completo
          onChange={(_, newValue: Transportista | null) => {
            setSelectedTransportistaId(newValue ? newValue.id : ""); // Guarda solo el ID
            setProfile(null); // Limpia el perfil anterior al cambiar
            setError(null);  // Limpia el error anterior al cambiar
          }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Transportista"
              size="small"
            />
          )}
          disabled={loadingFiltros} // Se deshabilita mientras cargan los transportistas
          sx={{ minWidth: 240, maxWidth: 400, flexGrow: 1 }} // Estilos
          size="small"
        />

        <Button
          variant="contained"
          onClick={handleGenerarReporte}
          disabled={loading || loadingFiltros || !selectedTransportistaId}
          sx={{ height: "40px" }}
        >
          {loading ? <CircularProgress size={24} /> : "Ver Ficha"}
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Mostrar error o mensaje informativo */}
      {error && (
        <Alert severity={error.includes("historial") ? "info" : "error"} sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {profile && !loading && (
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, mt: 2 }}>
          {/* CORRECCIÓN 3: Usar nombreEmpresa del profile */}
          <Typography variant="h5" gutterBottom>
            {profile.nombreEmpresa || "Nombre no disponible"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            CUIT: {profile.cuit || "N/A"}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Contacto
            </Typography>
            <ListItemText
              primary={profile.contactoNombre || "N/A"}
              secondary={
                <>
                  {profile.contactoEmail || "Email no disponible"}
                  <br />
                  {/* Usar función para formatear teléfono */}
                  Tel: {formatTelefono(profile.contactoTelefono)}
                </>
              }
            />
          </Box>

          <Divider sx={{ my: 2 }}>
            <Chip label="Activos Operativos" size="small" />
          </Divider>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 2, md: 3 },
            }}
          >
            <Box sx={{ width: { xs: "100%", md: "50%" } }}>
              <Typography variant="h6" gutterBottom fontSize="1.1rem">
                Tipos de Vehículo Asociados {/* Cambiado título */}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {/* Usar 'tiposVehiculo' */}
                {profile.tiposVehiculo && profile.tiposVehiculo.length > 0 ? (
                  profile.tiposVehiculo.map((v) => (
                    <Chip key={v.id} label={v.nombre} size="small" />
                  ))
                ) : (
                  <Typography variant="body2">No hay tipos de vehículo asociados en las tarifas.</Typography>
                )}
              </Box>
            </Box>
            <Box sx={{ width: { xs: "100%", md: "50%" } }}>
              <Typography variant="h6" gutterBottom fontSize="1.1rem">
                Zonas de Operación (según tarifas)
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {profile.zonasOperacion && profile.zonasOperacion.length > 0 ? (
                  profile.zonasOperacion.map((z) => (
                    <Chip key={z.id} label={z.nombre} size="small" />
                  ))
                ) : (
                  <Typography variant="body2">No hay zonas asociadas en las tarifas.</Typography>
                )}
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }}>
            <Chip label="Historial de Servicios" size="small" />
          </Divider>
          {/* Solo mostrar la tabla si hay historial y no hay error */}
          {profile.historialServicios && profile.historialServicios.length > 0 ? (
            esMovil ? (
              <List disablePadding>
                {profile.historialServicios.map((s) => (
                  <ListItem key={s.id} sx={{ p: 0, my: 1 }}>
                    <Paper sx={{ p: 2, width: "100%" }} variant="outlined">
                      <Typography variant="body2" fontWeight="bold" gutterBottom>
                         {formatDate(s.fecha)} {/* Mover fecha aquí */}
                      </Typography>
                      {/* <Divider sx={{ my: 1 }} /> */}
                      <ListItemText
                        primary="Tarifa Utilizada"
                        secondary={s.nombreTarifaUtilizada || "N/A"}
                      />
                      <ListItemText
                        primary="Costo de Tarifa ($)"
                        secondary={formatCurrency(s.valorTotalTarifa)}
                      />
                      <ListItemText
                        primary="Tipo de Carga"
                        secondary={s.nombreCarga || "N/A"}
                      />
                    </Paper>
                  </ListItem>
                ))}
              </List>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha</TableCell> {/* Cambiado orden */}
                      <TableCell>Tarifa Utilizada</TableCell>
                      <TableCell>Tipo de Carga</TableCell>
                      <TableCell align="right">Costo de Tarifa ($)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {profile.historialServicios.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>{formatDate(s.fecha)}</TableCell>
                        <TableCell>
                          {s.nombreTarifaUtilizada || "N/A"}
                        </TableCell>
                         <TableCell>{s.nombreCarga || "N/A"}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(s.valorTotalTarifa)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )
          ) : (
            // No mostrar nada aquí si ya mostramos el Alert de info arriba
             !error && <Typography variant="body2" color="textSecondary" sx={{mt: 1}}>No hay historial de servicios disponible.</Typography>
          )}
        </Paper>
      )}
    </Paper>
  );
};

export default ReporteHistorialServicios;