import { apiClient } from './apiClient';

export type CargaDeCombustible = {
  id: number;
  vehiculoId: string;
  fecha: string;
  cantidadTanques: number;
  precioPorLitro: number;
  costoTotal: number;
  esVigente: boolean;
};



const CARGA_DE_COMBUSTIBLE_URL = '/api/cargasDeCombustible';

export async function obtenerCargasDeCombustible(): Promise<CargaDeCombustible[]> {
  const data = await apiClient.get<CargaDeCombustible[]>(CARGA_DE_COMBUSTIBLE_URL);

  return data.map(item => ({ ...item, activo: item.esVigente }));
}

export const crearCargaDeCombustible = (data: Omit<CargaDeCombustible, 'id'>) =>
  apiClient.post<CargaDeCombustible>(CARGA_DE_COMBUSTIBLE_URL, data);

export const actualizarCargaDeCombustible = (id: number | string, data: Omit<CargaDeCombustible, 'id'>) =>
  apiClient.put<CargaDeCombustible>(`${CARGA_DE_COMBUSTIBLE_URL}/${id}`, data);

export const eliminarCargaDeCombustible = (id: number | string) =>
  apiClient.baja(`${CARGA_DE_COMBUSTIBLE_URL}/${id}/baja`);