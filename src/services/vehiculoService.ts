import { apiClient } from './apiClient';

export type Vehiculo = {
  _id: string; // El ID que viene de la API
  patente: string;
  marca: string;
  modelo: string;
  tipo: string; // CORREGIDO: Ahora es un string (ID del tipo de vehículo)
  deletedAt?: string | null;
  // Añadimos 'id' para compatibilidad interna en el frontend
  id: string; 
};

const VEHICULOS_URL = '/api/camiones';

export const obtenerVehiculo = async (): Promise<Vehiculo[]> => {
  const data = await apiClient.get<any[]>(VEHICULOS_URL);
  // Mapeamos _id a id para estandarizar
  return data.map(v => ({ ...v, id: v._id }));
}