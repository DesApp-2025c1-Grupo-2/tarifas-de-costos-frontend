
import { apiClient } from './apiClient';

export interface HistorialTarifa {
  id: number;
  tarifaOriginalId: number | null;
  codigoTarifa: string | null;
  nombreTarifa: string;
  tipoVehiculoId: string | null;
  transportistaId: string | null;
  transportistaNombre: string;
  tipoCargaId: number | null;
  tipoCargaNombre: string;
  zonaViajeId: number | null;
  zonaViajeNombre: string;
  valorBase: number;
  fechaModificacion: string;
  idUsuarioModifico: number | null;

}

const HISTORIAL_URL = '/api/historial/tarifa';

export const obtenerHistorialPorTarifaId = (tarifaId: number) =>
  apiClient.get<HistorialTarifa[]>(`${HISTORIAL_URL}/${tarifaId}`);