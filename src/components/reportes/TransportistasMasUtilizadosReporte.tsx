import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography
} from '@mui/material';

interface TransportistaData {
  nombreTransportista: string;
  cantidadTarifas: number;
}

export const TransportistasMasUtilizadosReporte: React.FC = () => {
  const [data, setData] = useState<TransportistaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:7070/api/reportes/transportistas-mas-utilizados');
        if (!response.ok) {
          throw new Error('Error al obtener los datos del reporte');
        }
        const result: TransportistaData[] = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="reporte transportistas mas utilizados">
        <TableHead>
          <TableRow>
            <TableCell>Nombre del Transportista</TableCell>
            <TableCell align="right">Cantidad de Tarifas</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.nombreTransportista}>
              <TableCell component="th" scope="row">
                {row.nombreTransportista}
              </TableCell>
              <TableCell align="right">{row.cantidadTarifas}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};