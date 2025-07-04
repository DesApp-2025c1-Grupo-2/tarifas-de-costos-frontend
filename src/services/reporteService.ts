import { API_BASE_URL } from '../config/api';

export interface FrecuenciaAdicional {
  nombreAdicional: string;
  cantidad: number;
}

export interface TransportistaMasUtilizado {
  nombreTransportista: string;
  cantidadTarifas: number;
}

const REPORTES_URL = `${API_BASE_URL}/reportes`;

/**
 * @returns 
 */
export async function getFrecuenciaAdicionales(): Promise<FrecuenciaAdicional[]> {
  const res = await fetch(`${REPORTES_URL}/frecuencia-adicionales`);


  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al obtener el reporte de frecuencias: ${res.status} ${res.statusText} - ${errorText}`);
  }

  return res.json();
}

/**
 * @returns 
 */
export async function getTransportistasMasUtilizados(): Promise<TransportistaMasUtilizado[]> {
  const res = await fetch(`${REPORTES_URL}/transportistas-mas-utilizados`);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al obtener el reporte de transportistas: ${res.status} ${res.statusText} - ${errorText}`);
  }

  return res.json();
}