import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, CircularProgress, Alert, List, ListItem, ListItemText, TextField } from '@mui/material';
import { obtenerComparativaCostosPorZona, ZonaComparativa } from '../../services/zonaService';
 

interface MinMaxZonaData {
  nombre: string;
  average: number;
}

const formatCurrency = (value: number | undefined) => {
  return `$${(value ?? 0).toFixed(2)}`;
};

const ComparativaZonasCostos: React.FC = () => {
  const [comparativaData, setComparativaData] = useState<Record<string, ZonaComparativa>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busquedaZona, setBusquedaZona] = useState<string>('');

  useEffect(() => {
    const fetchComparativa = async () => {
      try {
        const data = await obtenerComparativaCostosPorZona(); 
        setComparativaData(data);
      } catch (err) {
        console.error("Error al cargar la comparativa de zonas y costos:", err);
        setError("No se pudo cargar la comparativa de zonas. Asegúrese de que el backend esté funcionando y tenga datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchComparativa();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const datosFiltrados = Object.entries(comparativaData).filter(([zona]) =>
    zona.toLowerCase().includes(busquedaZona.toLowerCase())
  );

  const zonasConPromedioValido: MinMaxZonaData[] = Object.entries(comparativaData)
    .filter(([, stats]) => stats.average !== undefined && stats.average !== null && stats.average > 0) 
    .map(([nombreZona, stats]) => ({
      nombre: nombreZona,
      average: stats.average as number 
    }));

  let zonaMayorCosto: MinMaxZonaData | null = null;
  let zonaMenorCosto: MinMaxZonaData | null = null;

  if (zonasConPromedioValido.length > 0) {
    zonaMayorCosto = zonasConPromedioValido.reduce((prev, current) =>
      (prev.average > current.average) ? prev : current
    );
    zonaMenorCosto = zonasConPromedioValido.reduce((prev, current) =>
      (prev.average < current.average) ? prev : current
    );
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Comparativa de Costos por Zona Geográfica
      </Typography>
      <TextField
        label="Buscar Zona"
        variant="outlined"
        size="small"
        fullWidth
        sx={{ my: 2 }}
        value={busquedaZona}
        onChange={(e) => setBusquedaZona(e.target.value)}
      />
      <List>
        {datosFiltrados.map(([nombreZona, stats]) => (
          <ListItem key={nombreZona} divider>
            <ListItemText
              primary={<Typography variant="subtitle1">{nombreZona}</Typography>}
              secondary={

                <Box>
                  {stats.count === 0 && stats.average === 0 ? (
                    <Typography variant="body2" color="textSecondary">No hay tarifas registradas en esta zona.</Typography>
                  ) : (
                    <>
                      <Typography variant="body2">Total Tarifas: {stats.count ?? 0}</Typography>
                      <Typography variant="body2">Costo Mínimo: {formatCurrency(stats.min)}</Typography>
                      <Typography variant="body2">Costo Máximo: {formatCurrency(stats.max)}</Typography>
                      <Typography variant="body1" color="primary">Costo Promedio: {formatCurrency(stats.average)}</Typography>
                    </>
                  )}
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Zonas Destacadas por Costo Promedio
      </Typography>
      <List>
        {zonaMayorCosto && (
          <ListItem divider>
            <ListItemText
              primary="Zona con MAYOR Costo Promedio"
              secondary={
                <Typography color="error">
                  {zonaMayorCosto.nombre}: {formatCurrency(zonaMayorCosto.average)}
                </Typography>
              }
            />
          </ListItem>
        )}
        {zonaMenorCosto && (
          <ListItem>
            <ListItemText
              primary="Zona con MENOR Costo Promedio"
              secondary={
                <Typography color="success">
                  {zonaMenorCosto.nombre}: {formatCurrency(zonaMenorCosto.average)}
                </Typography>
              }
            />
          </ListItem>
        )}
        {zonasConPromedioValido.length === 0 && (
            <ListItem><ListItemText primary="No hay datos de tarifas válidos para comparar zonas." /></ListItem>
        )}
      </List>
    </Paper>
  );
};

export default ComparativaZonasCostos;