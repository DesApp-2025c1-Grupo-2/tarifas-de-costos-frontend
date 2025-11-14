import { apiClient } from './apiClient';

export type Tarifa = {
  id: number;
  nombreTarifa: string;
  valorBase: number;
  esVigente?: boolean;
  transportistaId: string;
  transportistaNombre: string;
  tipoVehiculoId: string;
  tipoVehiculoNombre: string;
  zonaId: number;
  zonaNombre: string;
  tipoCargaId: number;
  tipoCargaNombre: string;
  adicionales: {
    adicional: { id: number; nombre: string; descripcion: string; costoDefault: number };
    costoEspecifico: number;
  }[];
  total?: number;
};

const TARIFAS_URL = '/api/tarifas';

export async function obtenerTarifas(fechaInicio?: string): Promise<Tarifa[]> {
  const params = new URLSearchParams();
  if (fechaInicio) {
    params.append('fechaInicio', fechaInicio);
  }
  const data = await apiClient.get<Tarifa[]>(`${TARIFAS_URL}?${params.toString()}`);
  return data;
}

export const crearTarifa = (tarifa: any) =>
  apiClient.post<Tarifa>(TARIFAS_URL, tarifa);

export const actualizarTarifa = (id: number, data: any) =>
  apiClient.put<Tarifa>(`${TARIFAS_URL}/${id}`, data);

export const eliminarTarifa = (id: number | string) =>
  apiClient.baja(`${TARIFAS_URL}/${id}/baja`);

export const agregarAdicionalATarifa = (
  tarifaId: number,
  datosAdicional: { adicional: { id: number }, costoEspecifico?: number }
) => apiClient.post(`${TARIFAS_URL}/${tarifaId}/adicionales`, datosAdicional);