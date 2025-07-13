import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Box,
  Alert,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { obtenerHistorialPorTarifaId, HistorialTarifa } from '../../../services/historialService';

type Props = {
  open: boolean;
  onClose: () => void;
  tarifaId: number | null;
};

const parseDateArray = (dateArray: number[]): Date | null => {
  if (!Array.isArray(dateArray) || dateArray.length < 6) {
    return null;
  }
  const [year, month, day, hour, minute, second] = dateArray;
  const date = new Date(year, month - 1, day, hour, minute, second);
  return isNaN(date.getTime()) ? null : date;
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
          if (data.length === 0) {
            setError("Esta tarifa no tiene un historial de cambios.");
          } else {
            const datosOrdenados = data.sort((a, b) => {
              const dateA = parseDateArray(a.fechaModificacion as any);
              const dateB = parseDateArray(b.fechaModificacion as any);
              if (!dateA || !dateB) return 0;
              return dateB.getTime() - dateA.getTime();
            });
            setHistorial(datosOrdenados);
          }
        })
        .catch(() => {
          setError("Ocurrió un error al cargar el historial.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, tarifaId]);

  const formatCurrency = (value: number) => `$${(value || 0).toFixed(2)}`;
  
  const formatDate = (dateArray: number[]) => {
    const date = parseDateArray(dateArray);
    if (!date) return 'N/A';
    
    return date.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderContenido = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return <Alert severity="info">{error}</Alert>;
    }

    if (esMovil) {
      return (
        <List sx={{ pt: 0 }}>
          {historial.map((item, index) => (
            <React.Fragment key={item.id}>
              <Paper sx={{ p: 2, my: 1 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Cambio del {formatDate(item.fechaModificacion as any)}
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <ListItemText primary="Nombre Anterior" secondary={item.nombreTarifa} />
                <ListItemText primary="Valor Base Anterior" secondary={formatCurrency(item.valorBase)} />
                <ListItemText primary="Vehículo Anterior" secondary={item.tipoVehiculo.nombre} />
                <ListItemText primary="Carga Anterior" secondary={item.tipoCargaTarifa.nombre} />
                <ListItemText primary="Zona Anterior" secondary={item.zonaViaje.nombre} />
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
                <TableCell>Fecha de Modificación</TableCell>
                <TableCell>Nombre Anterior</TableCell>
                <TableCell>Valor Base Anterior</TableCell>
                <TableCell>Vehículo Anterior</TableCell>
                <TableCell>Carga Anterior</TableCell>
                <TableCell>Zona Anterior</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historial.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{formatDate(item.fechaModificacion as any)}</TableCell>
                  <TableCell>{item.nombreTarifa}</TableCell>
                  <TableCell>{formatCurrency(item.valorBase)}</TableCell>
                  <TableCell>{item.tipoVehiculo.nombre}</TableCell>
                  <TableCell>{item.tipoCargaTarifa.nombre}</TableCell>
                  <TableCell>{item.zonaViaje.nombre}</TableCell>
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
        Historial de Cambios de la Tarifa
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {renderContenido()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};