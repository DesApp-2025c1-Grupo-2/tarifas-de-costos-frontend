import { apiClient } from './apiClient';

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

const HISTORIAL_URL = '/api/historial/tarifa';

export const obtenerHistorialPorTarifaId = (tarifaId: number) =>
  apiClient.get<HistorialTarifa[]>(`${HISTORIAL_URL}/${tarifaId}`);
