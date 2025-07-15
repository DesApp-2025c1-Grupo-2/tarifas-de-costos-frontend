import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { getTransportistasMasUtilizados } from "../../services/reporteService";

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
        // CORRECCIÓN: Se utiliza la función del servicio en lugar de fetch directo.
        const result = await getTransportistasMasUtilizados();
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Ocurrió un error desconocido"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Ranking de Transportistas por Tarifas Asociadas
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="reporte transportistas mas utilizados">
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
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
    </Paper>
  );
};
