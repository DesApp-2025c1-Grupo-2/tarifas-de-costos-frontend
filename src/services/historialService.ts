import { API_BASE_URL } from '../config/api';

export interface HistorialTarifa {
  id: number;
  tarifaOriginal: { id: number; nombreTarifa: string };
  codigoTarifa: string;
  nombreTarifa: string;
  tipoVehiculo: { id: number; nombre: string };
  tipoCargaTarifa: { id: number; nombre: string };
  zonaViaje: { id: number; nombre: string };
  transportista: { id: number; nombreEmpresa: string };
  valorBase: number;
  fechaModificacion: string;
  idUsuarioModifico: null | number;
  comentarioCambio: string;
}

const HISTORIAL_URL = `${API_BASE_URL}/historial/tarifa`;

/**
 * @param tarifaId 
 * @returns 
 */
export async function obtenerHistorialPorTarifaId(tarifaId: number): Promise<HistorialTarifa[]> {
  const res = await fetch(`${HISTORIAL_URL}/${tarifaId}`);

  if (res.status === 204) {
    return [];
  }

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al obtener el historial: ${res.status} ${res.statusText} - ${errorText}`);
  }

  return res.json();
}