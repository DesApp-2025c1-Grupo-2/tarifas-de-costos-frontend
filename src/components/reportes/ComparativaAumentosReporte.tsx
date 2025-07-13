import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
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
  useTheme,
  useMediaQuery,
  Divider,
  List,
  ListItemText,
} from '@mui/material';
import { getComparativaAumentos, ComparativaAumento } from '../../services/reporteService';

const ComparativaAumentosReporte: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [reporte, setReporte] = useState<ComparativaAumento[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const theme = useTheme();
  const esMovil = useMediaQuery(theme.breakpoints.down('md'));


  const handleGenerarReporte = async () => {
    if (!fechaInicio || !fechaFin) {
      setError('Por favor, seleccione una fecha de inicio y una de fin.');
      return;
    }
    setLoading(true);
    setError(null);
    setReporte(null);

    try {
      const data = await getComparativaAumentos(fechaInicio, fechaFin);
      if (data.length === 0) {
        setError('No se encontraron variaciones de tarifas para el período seleccionado.');
      } else {
        setReporte(data);
      }
    } catch (err) {
      setError('Ocurrió un error al generar el reporte. Intente más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString.replace('T', ' '));
    return isNaN(date.getTime()) ? 'Fecha inválida' : date.toLocaleString('es-AR');
  };

  const formatCurrency = (value: number) => `$${(value || 0).toFixed(2)}`;
  const formatPercentage = (value: number) => `${(value || 0).toFixed(2)}%`;

  const renderContenidoReporte = () => {
    if (!reporte || reporte.length === 0) return null;

    if (esMovil) {
      return (
        <List sx={{ pt: 0 }}>
          {reporte.map((item) => (
            <Paper key={item.tarifaId} sx={{ p: 2, my: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {item.nombreTarifa}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <ListItemText
                primary="Valor Inicial"
                secondary={`${formatCurrency(item.valorInicial)} (al ${formatDate(item.fechaInicial)})`}
              />
              <ListItemText
                primary="Valor Final"
                secondary={`${formatCurrency(item.valorFinal)} (al ${formatDate(item.fechaFinal)})`}
              />
              <ListItemText
                primary="Aumento Absoluto"
                secondary={formatCurrency(item.variacionAbsoluta)}
              />
              <ListItemText
                primary="Aumento Porcentual"
                secondary={formatPercentage(item.variacionPorcentual)}
              />
            </Paper>
          ))}
        </List>
      );
    } else {
      return (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Nombre de la Tarifa</TableCell>
                <TableCell align="right">Valor Inicial ($)</TableCell>
                <TableCell>Fecha Inicial</TableCell>
                <TableCell align="right">Valor Final ($)</TableCell>
                <TableCell>Fecha Final</TableCell>
                <TableCell align="right">Aumento ($)</TableCell>
                <TableCell align="right">Aumento (%)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reporte.map((item) => (
                <TableRow key={item.tarifaId}>
                  <TableCell>{item.nombreTarifa}</TableCell>
                  <TableCell align="right">{formatCurrency(item.valorInicial)}</TableCell>
                  <TableCell>{formatDate(item.fechaInicial)}</TableCell>
                  <TableCell align="right">{formatCurrency(item.valorFinal)}</TableCell>
                  <TableCell>{formatDate(item.fechaFinal)}</TableCell>
                  <TableCell align="right">{formatCurrency(item.variacionAbsoluta)}</TableCell>
                  <TableCell align="right">{formatPercentage(item.variacionPorcentual)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
  };

  return (
    <Paper sx={{ padding: 3, marginTop: 2 }}>
      <Typography variant="h6" gutterBottom>
        Análisis Comparativo de Aumentos de Tarifas
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
        <TextField
          label="Fecha de Inicio"
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
        <TextField
          label="Fecha de Fin"
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
        <Button
          variant="contained"
          onClick={handleGenerarReporte}
          disabled={loading}
          sx={{ height: '40px' }}
        >
          {loading ? <CircularProgress size={24} /> : 'Generar Reporte'}
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="info" sx={{ mt: 2 }}>{error}</Alert>}

      {renderContenidoReporte()}
    </Paper>
  );
};

export default ComparativaAumentosReporte;