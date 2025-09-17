import { apiClient } from './apiClient';

export type Adicional = {
  activo: boolean;
  id: number;
  nombre: string;
  costoDefault: number;
  descripcion: string;
  esGlobal?: boolean;
};

const ADICIONALES_URL = '/api/adicionales';

export const obtenerAdicionales = () =>
  apiClient.get<Adicional[]>(ADICIONALES_URL);

export const crearAdicional = (data: Omit<Adicional, 'id'>) =>
  apiClient.post<Adicional>(ADICIONALES_URL, data);

export const actualizarAdicional = (id: number | string, data: Omit<Adicional, 'id'>) =>
  apiClient.put<Adicional>(`${ADICIONALES_URL}/${id}`, data);

export const eliminarAdicional = (id: number | string) =>
  apiClient.baja(`${ADICIONALES_URL}/${id}/baja`);
