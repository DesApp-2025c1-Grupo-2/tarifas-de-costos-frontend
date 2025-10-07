import { apiClient } from './apiClient';

export type CargaDeCombustible = {
  id: number;
  vehiculoId: string;
  valorBase: number;
  esVigente?: boolean;
};

const CARGA_DE_COMBUSTIBLE_URL = '/api/cargasDeCombustible';

export async function obtenerCargasDeCombustible(): Promise<CargaDeCombustible[]> {
  const data = await apiClient.get<CargaDeCombustible[]>(CARGA_DE_COMBUSTIBLE_URL);
  return data;
}

export const crearCargaDeCombustible = (cargaDeCombustible: any) =>
  apiClient.post<CargaDeCombustible>(CARGA_DE_COMBUSTIBLE_URL, cargaDeCombustible);

export const actualizarCargaDeCombustible = (id: number, data: any) =>
  apiClient.put<CargaDeCombustible>(`${CARGA_DE_COMBUSTIBLE_URL}/${id}`, data);

export const eliminarCargaDeCombustible = (id: number | string) =>
  apiClient.baja(`${CARGA_DE_COMBUSTIBLE_URL}/${id}/baja`);