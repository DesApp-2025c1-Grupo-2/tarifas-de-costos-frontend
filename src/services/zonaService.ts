import { apiClient } from './apiClient';

export type ZonaViaje = {
  activo: boolean;
  id: number;
  nombre: string;
  descripcion: string;
  // ELIMINADO: regionMapa: string;
  provincias?: any[]; // Para recibir datos del backend (si aún los envía por alguna razón)
  provinciasNombres?: string[]; // Nombres para enviar y recibir del DTO backend
};
// --- FIN CAMBIO ---

export type ZonaComparativa = {
  count?: number;
  min?: number;
  max?: number;
  average?: number;
  sum?: number;
};


const ZONAS_URL = '/api/zonas';


export const obtenerZonas = () => apiClient.get<ZonaViaje[]>(ZONAS_URL);

// El tipo de 'data' debe coincidir con lo que espera el backend DTO (sin regionMapa)
export const crearZona = (data: Omit<ZonaViaje, 'id' | 'provincias'>) =>
    apiClient.post<ZonaViaje>(ZONAS_URL, data);

// El tipo de 'data' debe coincidir con lo que espera el backend DTO (sin regionMapa)
export const actualizarZona = (id: number | string, data: Omit<ZonaViaje, 'id' | 'provincias'>) =>
  apiClient.put<ZonaViaje>(`${ZONAS_URL}/${id}`, data);

// Este método ahora hace la BAJA LÓGICA (PUT a /baja)
export const eliminarZona = (id: number | string) =>
    apiClient.baja(`${ZONAS_URL}/${id}/baja`);

