import { apiClient } from './apiClient';

export type CargaDeCombustible = {
  id: number;
  vehiculoId: string;
  fecha: string;
  litrosCargados: number;
  numeroTicket: string;
  precioTotal: number;
  esVigente: boolean;
};

const CARGA_DE_COMBUSTIBLE_URL = '/api/cargasDeCombustible';

export const obtenerCargasDeCombustible = (fechaInicio?: string) => {
  const params = new URLSearchParams();
  if (fechaInicio) {
    params.append('fechaInicio', fechaInicio);
  }
  return apiClient.get<CargaDeCombustible[]>(`${CARGA_DE_COMBUSTIBLE_URL}?${params.toString()}`);
};

export const crearCargaDeCombustible = (data: Omit<CargaDeCombustible, 'id'>) =>
  apiClient.post<CargaDeCombustible>(CARGA_DE_COMBUSTIBLE_URL, data);

export const actualizarCargaDeCombustible = (id: number | string, data: Omit<CargaDeCombustible, 'id'>) =>
  apiClient.put<CargaDeCombustible>(`${CARGA_DE_COMBUSTIBLE_URL}/${id}`, data);

export const eliminarCargaDeCombustible = (id: number | string) =>
  apiClient.baja(`${CARGA_DE_COMBUSTIBLE_URL}/${id}/baja`);