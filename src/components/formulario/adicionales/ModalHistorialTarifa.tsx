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
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { obtenerHistorialPorTarifaId, HistorialTarifa } from '../../../services/historialService';

type Props = {
  open: boolean;
  onClose: () => void;
  tarifaId: number | null;
};

export const ModalHistorialTarifa: React.FC<Props> = ({ open, onClose, tarifaId }) => {
  const [historial, setHistorial] = useState<HistorialTarifa[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            setHistorial(data);
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

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  
  const formatDate = (dateString: any) => {
    if (typeof dateString !== 'string' || !dateString) {
      return 'N/A';
    }
    
    const compatibleDateString = dateString.replace('T', ' ');
    const date = new Date(compatibleDateString);
    
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    return date.toLocaleString('es-AR');
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
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="info">{error}</Alert>
        ) : (
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
                    <TableCell>{formatDate(item.fechaModificacion)}</TableCell>
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
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};