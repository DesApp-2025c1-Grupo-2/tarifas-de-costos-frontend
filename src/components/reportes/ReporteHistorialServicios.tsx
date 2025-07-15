import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { getTransportistaProfile, TransportistaProfile } from '../../services/transportistaService';
import { obtenerTransportistas, Transportista } from '../../services/transportistaService';

const ReporteHistorialServicios: React.FC = () => {
  const [transportistas, setTransportistas] = useState<Transportista[]>([]);
  const [selectedTransportistaId, setSelectedTransportistaId] = useState<string>('');
  
  const [profile, setProfile] = useState<TransportistaProfile | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingFiltros, setLoadingFiltros] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const esMovil = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const cargarTransportistas = async () => {
      try {
        const data = await obtenerTransportistas();
        setTransportistas(data.filter(t => t.activo));
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
    setProfile(null);
    setError(null);
  };

  const handleGenerarReporte = async () => {
    if (!selectedTransportistaId) {
      setError('Por favor, seleccione un transportista.');
      return;
    }
    setLoading(true);
    setError(null);
    setProfile(null);
    
    try {
      const profileData = await getTransportistaProfile(Number(selectedTransportistaId));
      setProfile(profileData);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al generar el reporte.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Fecha inválida' : date.toLocaleDateString('es-AR');
  };

  const formatCurrency = (value: number) => `$${(value || 0).toFixed(2)}`;

  return (
    <Paper sx={{ padding: 3, marginTop: 2 }}>
      <Typography variant="h6" gutterBottom>
        Ficha de Transportista
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
        <FormControl fullWidth size="small" sx={{ minWidth: 240, maxWidth: 400 }}>
          <InputLabel id="transportista-select-label">Transportista</InputLabel>
          <Select
            labelId="transportista-select-label"
            value={selectedTransportistaId}
            label="Transportista"
            onChange={handleTransportistaChange}
            disabled={loadingFiltros}
          >
            {transportistas.map((t) => (
              <MenuItem key={t.id} value={t.id.toString()}>
                {t.nombreEmpresa} ({t.cuit})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleGenerarReporte}
          disabled={loading || loadingFiltros || !selectedTransportistaId}
          sx={{ height: '40px' }}
        >
          {loading ? <CircularProgress size={24} /> : 'Ver Ficha'}
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      {profile && !loading && (
        <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
          <Typography variant="h5" gutterBottom>{profile.nombreEmpresa}</Typography>
          <Typography variant="body1" color="text.secondary">CUIT: {profile.cuit}</Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">Contacto</Typography>
              <ListItemText primary={profile.contactoNombre} secondary={`${profile.contactoEmail} | ${profile.contactoTelefono}`} />
          </Box>

          <Divider sx={{ my: 2 }}><Chip label="Activos Operativos" /></Divider>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
            <Box sx={{ width: { xs: '100%', md: '50%' } }}>
              <Typography variant="h6" gutterBottom>Vehículos Disponibles</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {profile.vehiculos.length > 0 ? profile.vehiculos.map(v => (
                  <Chip key={v.id} label={v.tipoVehiculo} />
                )) : <Typography>No hay vehículos registrados.</Typography>}
              </Box>
            </Box>
            <Box sx={{ width: { xs: '100%', md: '50%' } }}>
              <Typography variant="h6" gutterBottom>Zonas de Operación</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {profile.zonasOperacion.length > 0 ? profile.zonasOperacion.map(z => (
                  <Chip key={z.id} label={z.nombre} />
                )) : <Typography>No hay zonas registradas.</Typography>}
              </Box>
            </Box>
          </Box>
          
          <Divider sx={{ my: 2 }}><Chip label="Historial de Servicios" /></Divider>
          {profile.historialServicios.length > 0 ? (
            esMovil ? (
              <List disablePadding>
                {profile.historialServicios.map(s => (
                  <ListItem key={s.id} sx={{ p: 0, my: 1 }}>
                    <Paper sx={{ p: 2, width: '100%' }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Viaje del {formatDate(s.fechaViaje)}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <ListItemText primary="Tarifa Utilizada" secondary={s.nombreTarifaUtilizada || 'N/A'} />
                      <ListItemText primary="Costo de Tarifa ($)" secondary={formatCurrency(s.valorTotalTarifa)} />
                      <ListItemText primary="Tipo de Carga" secondary={s.nombreCarga || 'N/A'} />
                    </Paper>
                  </ListItem>
                ))}
              </List>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha del Viaje</TableCell>
                      <TableCell>Tarifa Utilizada</TableCell>
                      <TableCell align="right">Costo de Tarifa ($)</TableCell>
                      <TableCell>Tipo de Carga</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {profile.historialServicios.map(s => (
                      <TableRow key={s.id}>
                        <TableCell>{formatDate(s.fechaViaje)}</TableCell>
                        <TableCell>{s.nombreTarifaUtilizada || 'N/A'}</TableCell>
                        <TableCell align="right">{formatCurrency(s.valorTotalTarifa)}</TableCell>
                        <TableCell>{s.nombreCarga || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )
          ) : <Alert severity="info" sx={{ mt: 2 }}>Este transportista no tiene un historial de servicios.</Alert>}
        </Paper>
      )}
    </Paper>
  );
};

export default ReporteHistorialServicios;