import { apiClient } from './apiClient';

export type Vehiculo = {
  id: string; 
  patente: string;
  marca: string;
  modelo: string;
  tipo: string;
  deletedAt?: string | null;
  activo?: boolean;
};

const VEHICULOS_URL = '/api/camiones';

export const obtenerVehiculo = async (): Promise<Vehiculo[]> => {
  const data = await apiClient.get<Vehiculo[]>(VEHICULOS_URL);
  return data;
}