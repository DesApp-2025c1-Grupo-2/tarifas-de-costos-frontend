// Archivo: src/services/reporteService.ts
import { apiClient } from './apiClient';

export interface FrecuenciaAdicional { nombreAdicional: string; cantidad: number; }
export interface TransportistaMasUtilizado { nombreTransportista: string; cantidadTarifas: number; }
export interface Comparativa { transportista: string; costo: number; tarifaId: number; nombreTarifa: string; }
export interface ComparativaTransportistaDTO { servicio: string; comparativas: Comparativa[]; }
// --- TIPO ELIMINADO ---
// export interface ComparativaZonaStats { average: number; count: number; max: number; min: number; sum: number; }
export interface ComparativaAumento {
  tarifaId: number; nombreTarifa: string;
  valorInicial: number; fechaInicial: string;
  valorFinal: number; fechaFinal: string;
  variacionAbsoluta: number; variacionPorcentual: number;
}

export interface ReporteVehiculoCombustible {
  vehiculoPatente: string;
  cantidadViajes: number;
  cantidadCargasCombustible: number;
  costoTotalCombustible: number;
  fechaInicio: string;
  fechaFin: string;
  viajesPorCarga: number;
  totalKilometros: number;
  litrosTotales: number;
}

export type FrecuenciaAdicionalesParams = {
  fechaInicio?: string; // Formato YYYY-MM-DD
  fechaFin?: string; // Formato YYYY-MM-DD
};

// --- TIPO ELIMINADO ---
// export type ComparativaZonasParams = {
//   fechaInicio?: string; // Formato YYYY-MM-DD
//   fechaFin?: string; // Formato YYYY-MM-DD
//   zonaId?: string; // <-- AÑADIR ESTA PROPIEDAD
// };
// --- FIN DE LA CORRECCIÓN ---


const REPORTES_URL = '/api/reportes';
// --- CONSTANTE ELIMINADA (ya no se usa) ---
// const ZONAS_URL = '/api/zonas';

export const getFrecuenciaAdicionales = (params: FrecuenciaAdicionalesParams = {}) => {
  const qs = new URLSearchParams(params as any).toString();
  return apiClient.get<FrecuenciaAdicional[]>(`${REPORTES_URL}/frecuencia-adicionales?${qs}`);
};

export const getTransportistasMasUtilizados = () =>
  apiClient.get<TransportistaMasUtilizado[]>(`${REPORTES_URL}/transportistas-mas-utilizados`);

export const getComparativaCostos = (params: { [k: string]: string | number }) => {
  const qs = new URLSearchParams(params as any).toString();
  return apiClient.get<ComparativaTransportistaDTO>(`${REPORTES_URL}/comparativa-costos?${qs}`);
};


export const getComparativaAumentos = (fechaInicio: string, fechaFin: string) => {
  const qs = new URLSearchParams({ fechaInicio, fechaFin }).toString();
  return apiClient.get<ComparativaAumento[]>(`${REPORTES_URL}/comparativa-aumentos?${qs}`);
};

export const getReporteUsoCombustible = (vehiculoId: string, fechaInicio: string, fechaFin: string) => {
  const qs = new URLSearchParams({ vehiculoId, fechaInicio, fechaFin }).toString();
  return apiClient.get<ReporteVehiculoCombustible>(`${REPORTES_URL}/uso-combustible?${qs}`);
};