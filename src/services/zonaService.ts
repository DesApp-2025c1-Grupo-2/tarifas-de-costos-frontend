import { apiClient } from './apiClient';
import { ComparativaZonaStats } from './reporteService';

// --- CAMBIO AQUÍ: Eliminada la propiedad regionMapa ---
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

// Tipos para filtros de reportes (si los usas)
export type FrecuenciaAdicionalesParams = { fechaInicio?: string; fechaFin?: string; };
export type ComparativaZonasParams = { fechaInicio?: string; fechaFin?: string; };


const ZONAS_URL = '/api/zonas';
const REPORTES_ZONAS_COMPARATIVA_URL = '/api/zonas/comparativa-costos'; // Usado en reportes

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

// Función para reporte, mantenida igual
export async function obtenerComparativaCostosPorZona(params: ComparativaZonasParams = {}): Promise<Record<string, ComparativaZonaStats>> {
    const qs = new URLSearchParams(params as any).toString();
    const raw = await apiClient.get<Record<string, ComparativaZonaStats | string>>(`${REPORTES_ZONAS_COMPARATIVA_URL}?${qs}`);
    const out: Record<string, ComparativaZonaStats> = {};
    for (const [k, v] of Object.entries(raw)) {
        if (typeof v !== 'string') { // Filtrar respuestas "No hay tarifas"
            out[k] = v;
        }
    }
    return out;
}