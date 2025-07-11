import { API_BASE_URL } from '../config/api';

export interface FrecuenciaAdicional {
  nombreAdicional: string;
  cantidad: number;
}

export interface TransportistaMasUtilizado {
  nombreTransportista: string;
  cantidadTarifas: number;
}

export interface Comparativa {
    transportista: string;
    costo: number;
}

export interface ComparativaTransportistaDTO {
    servicio: string;
    comparativas: Comparativa[];
}

export interface ComparativaZonaStats {
    average: number;
    count: number;
    max: number;
    min: number;
    sum: number;
}

const REPORTES_URL = `${API_BASE_URL}/reportes`;
const ZONAS_URL = `${API_BASE_URL}/zonas`;

export async function getFrecuenciaAdicionales(): Promise<FrecuenciaAdicional[]> {
  const res = await fetch(`${REPORTES_URL}/frecuencia-adicionales`);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al obtener el reporte de frecuencias: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return res.json();
}

export async function getTransportistasMasUtilizados(): Promise<TransportistaMasUtilizado[]> {
  const res = await fetch(`${REPORTES_URL}/transportistas-mas-utilizados`);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al obtener el reporte de transportistas: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return res.json();
}

export async function getComparativaCostos(params: { [key: string]: number }): Promise<ComparativaTransportistaDTO> {
  const query = new URLSearchParams(params as any).toString();
  const res = await fetch(`${REPORTES_URL}/comparativa-costos?${query}`);

  if (res.status === 204) {
      throw new Error('204: No Content');
  }
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al obtener la comparativa de costos: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return res.json();
}

export async function getComparativaGeneralPorZona(): Promise<Record<string, ComparativaZonaStats>> {
    const res = await fetch(`${ZONAS_URL}/comparativa-costos`);
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error al obtener la comparativa por zona: ${res.status} ${res.statusText} - ${errorText}`);
    }
    return res.json();
}