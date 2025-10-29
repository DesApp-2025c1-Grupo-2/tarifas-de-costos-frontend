import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, CircularProgress, Box, Alert, Typography,
  Divider, List, ListItem, ListItemText, useMediaQuery, useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { obtenerHistorialPorTarifaId, HistorialTarifa } from '../../../services/historialService';

type Props = {
  open: boolean;
  onClose: () => void;
  tarifaId: number | null;
};

const formatCurrency = (value: number | undefined) => {
  const number = Number(value) || 0;
  return `$${number.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const ModalHistorialTarifa: React.FC<Props> = ({ open, onClose, tarifaId }) => {
  const [historial, setHistorial] = useState<HistorialTarifa[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const esMovil = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (open && tarifaId) {
      setLoading(true);
      setError(null);
      setHistorial([]);

      obtenerHistorialPorTarifaId(tarifaId)
        .then(data => {
          if (!data || data.length === 0) {
            setError("Esta tarifa no tiene un historial de cambios.");
          } else {
            const datosOrdenados = data.sort((a, b) => {
              const dateA = a.fechaModificacion ? new Date(a.fechaModificacion) : null;
              const dateB = b.fechaModificacion ? new Date(b.fechaModificacion) : null;
              if (!dateA || !dateB) return 0;
              return dateB.getTime() - dateA.getTime();
            });
            setHistorial(datosOrdenados);
          }
        })
        .catch((err) => {
          console.error("Error fetching history:", err);
          setError("Ocurrió un error al cargar el historial. Revise la consola.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (!open) {
        setHistorial([]);
        setError(null);
        setLoading(false);
    }
  }, [open, tarifaId]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? 'Fecha inválida'
      : date.toLocaleString('es-AR', {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        });
  };

  const renderContenido = () => {
    if (loading) {
      return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
    }
    if (error) {
      const severity = error.includes("no tiene un historial") ? "info" : "error";
      return <Alert severity={severity}>{error}</Alert>;
    }
    if (historial.length === 0 && !loading) {
        return <Alert severity="info">No hay registros de historial para mostrar.</Alert>;
    }

    if (esMovil) {
      return (
        <List sx={{ pt: 0 }}>
          {historial.map((item) => (
            <React.Fragment key={item.id}>
              <Paper sx={{ p: 2, my: 1 }} variant="outlined">
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Cambio del {formatDate(item.fechaModificacion)}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Transportista: {item.transportistaNombre || 'N/A'}
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <ListItemText primary="Nombre Tarifa Anterior" secondary={item.nombreTarifa || 'N/A'} />
                <ListItemText primary="Valor Base Anterior" secondary={formatCurrency(item.valorBase)} />
                <ListItemText primary="Vehículo Anterior (ID)" secondary={item.tipoVehiculoId || 'N/A'} />
                <ListItemText primary="Carga Anterior" secondary={item.tipoCargaNombre || 'N/A'} />
                <ListItemText primary="Zona Anterior" secondary={item.zonaViajeNombre || 'N/A'} />
              </Paper>
            </React.Fragment>
          ))}
        </List>
      );
    } else {
      return (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Fecha Modificación</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Transportista</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Nombre Anterior</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="right">Valor Base Ant.</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Carga Anterior</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Zona Anterior</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historial.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{formatDate(item.fechaModificacion)}</TableCell>
                  <TableCell>{item.transportistaNombre || 'N/A'}</TableCell>
                  <TableCell>{item.nombreTarifa || 'N/A'}</TableCell>
                  <TableCell align="right">{formatCurrency(item.valorBase)}</TableCell>
                  <TableCell>{item.tipoCargaNombre || 'N/A'}</TableCell>
                  <TableCell>{item.zonaViajeNombre || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        Historial de Cambios de la Tarifa #{tarifaId ?? ''}
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {renderContenido()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};