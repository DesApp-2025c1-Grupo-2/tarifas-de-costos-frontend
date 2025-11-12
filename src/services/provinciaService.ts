import { apiClient } from './apiClient';

export type Provincia = {
  activo: boolean;
  id: number;
  nombre: string;
};

const PROVINCIAS_URL = '/api/provincias';

export function obtenerProvincias() {
  return apiClient.get<Provincia[]>(PROVINCIAS_URL);
}