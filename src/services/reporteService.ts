import { apiClient } from './apiClient';

export interface FrecuenciaAdicional { nombreAdicional: string; cantidad: number; }
export interface Comparativa { transportista: string; costo: number; tarifaId: number; nombreTarifa: string; }
export interface ComparativaTransportistaDTO { servicio: string; comparativas: Comparativa[]; }
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
  viajes: {
    fecha: string;
    km: number;
  }[];
  cargas: {
    fecha: string;
    litros: number;
  }[];
}

export type FrecuenciaAdicionalesParams = {
  fechaInicio?: string;
  fechaFin?: string;
};


const REPORTES_URL = '/api/reportes';

export const getFrecuenciaAdicionales = (params: FrecuenciaAdicionalesParams = {}) => {
  const qs = new URLSearchParams(params as any).toString();
  return apiClient.get<FrecuenciaAdicional[]>(`${REPORTES_URL}/frecuencia-adicionales?${qs}`);
};

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