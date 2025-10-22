import { apiClient } from './apiClient';

export type TipoVehiculo = {
  activo: boolean;
  id: string; // Cambiado de number a string
  nombre: string;
  descripcion: string;
  licencia_permitida: string;
};

const TIPOS_VEHICULO_URL = '/api/tipos-vehiculo';

export const obtenerTiposVehiculo = () =>
  apiClient.get<TipoVehiculo[]>(TIPOS_VEHICULO_URL);

export const crearTipoVehiculo = (data: Omit<TipoVehiculo, 'id'>) =>
  apiClient.post<TipoVehiculo>(TIPOS_VEHICULO_URL, data);

export const actualizarTipoVehiculo = (id: number | string, data: Omit<TipoVehiculo, 'id'>) =>
  apiClient.put<TipoVehiculo>(`${TIPOS_VEHICULO_URL}/${id}`, data);

export const eliminarTipoVehiculo = (id: number | string) =>
  apiClient.baja(`${TIPOS_VEHICULO_URL}/${id}/baja`);