import { apiClient } from './apiClient';

export type ZonaViaje = {
  activo: boolean;
  id: number;
  nombre: string;
  descripcion: string;
  regionMapa: string;
};

export type ZonaComparativa = {
  count?: number;
  min?: number;
  max?: number;
  average?: number;
  sum?: number;
};

// En dev pedimos '/api/...'; en prod, apiClient antepone el host
const ZONAS_URL = '/api/zonas';
const REPORTES_ZONAS_COMPARATIVA_URL = '/api/zonas/comparativa-costos';

export const obtenerZonas = () => apiClient.get<ZonaViaje[]>(ZONAS_URL);
export const crearZona = (data: Omit<ZonaViaje, 'id'>) => apiClient.post<ZonaViaje>(ZONAS_URL, data);
export const actualizarZona = (id: number, data: Omit<ZonaViaje, 'id'>) =>
  apiClient.put<ZonaViaje>(`${ZONAS_URL}/${id}`, data);
export const eliminarZona = (id: number) => apiClient.baja(`${ZONAS_URL}/${id}/baja`);

export async function obtenerComparativaCostosPorZona(): Promise<Record<string, ZonaComparativa>> {
  const raw = await apiClient.get<Record<string, ZonaComparativa | string>>(REPORTES_ZONAS_COMPARATIVA_URL);
  const out: Record<string, ZonaComparativa> = {};
  for (const [k, v] of Object.entries(raw)) {
    out[k] = typeof v === 'string' ? { count: 0, min: 0, max: 0, average: 0, sum: 0 } : v;
  }
  return out;
}
