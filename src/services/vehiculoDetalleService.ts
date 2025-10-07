import { apiClient } from './apiClient';

export type VehiculoDetalle = {
  id?: number;
  vehiculoId: string;
  litrosPorTanque: number;
  kmPorTanque: number;
  tipoCombustible: string;
};

const URL = '/api/vehiculo-detalles';

export const obtenerDetallePorVehiculoId = (vehiculoId: string) =>
  apiClient.get<VehiculoDetalle>(`${URL}/vehiculo/${vehiculoId}`);

export const guardarDetalleVehiculo = (data: VehiculoDetalle) =>
  apiClient.post<VehiculoDetalle>(URL, data);