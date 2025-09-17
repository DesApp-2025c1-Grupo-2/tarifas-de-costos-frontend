import { apiClient } from './apiClient';

export type Carga = {
  activo: boolean;
  id: number;
  nombre: string;
  descripcion: string;
};

// Todas las rutas con el prefijo /api
const CARGAS_URL = '/api/tipo-carga-tarifa';

export function obtenerCargas() {
  return apiClient.get<Carga[]>(CARGAS_URL);
}

export function crearCarga(data: Omit<Carga, 'id'>) {
  return apiClient.post<Carga>(CARGAS_URL, data);
}

export function actualizarCarga(id: number | string, data: Omit<Carga, 'id'>) {
  return apiClient.put<Carga>(`${CARGAS_URL}/${id}`, data);
}

export function eliminarCarga(id: number) {
  return apiClient.baja(`${CARGAS_URL}/${id}/baja`);
}
