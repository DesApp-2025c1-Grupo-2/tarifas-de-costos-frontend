import { apiClient } from './apiClient';

export type TipoVehiculo = {
  activo: boolean; // Se mantiene por si se usa en otros lados, aunque el filtro sea por deletedAt
  id: string;
  nombre: string;
  descripcion: string;
  licencia_permitida: string;
  deletedAt?: string | null; // <-- Propiedad añadida
};

const TIPOS_VEHICULO_URL = '/api/tipos-vehiculo';

export const obtenerTiposVehiculo = () =>
  apiClient.get<TipoVehiculo[]>(TIPOS_VEHICULO_URL);

// Se excluye deletedAt al crear/actualizar ya que es gestionado por el backend
export const crearTipoVehiculo = (data: Omit<TipoVehiculo, 'id' | 'deletedAt'>) =>
  apiClient.post<TipoVehiculo>(TIPOS_VEHICULO_URL, data);

export const actualizarTipoVehiculo = (id: number | string, data: Omit<TipoVehiculo, 'id' | 'deletedAt'>) =>
  apiClient.put<TipoVehiculo>(`${TIPOS_VEHICULO_URL}/${id}`, data);

export const eliminarTipoVehiculo = (id: number | string) =>
  apiClient.baja(`${TIPOS_VEHICULO_URL}/${id}/baja`);