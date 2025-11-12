import { apiClient } from './apiClient';

export type Adicional = {
  activo: boolean; // El backend espera/devuelve esto
  id: number;
  nombre: string;
  costoDefault: number;
  descripcion: string;
  esGlobal: boolean; // El backend espera/devuelve esto
};

const ADICIONALES_URL = '/api/adicionales';

// Obtener todos los adicionales (activos e inactivos, flotantes y no flotantes)
export const obtenerAdicionales = () =>
  apiClient.get<Adicional[]>(ADICIONALES_URL);

// Crear un nuevo adicional
export const crearAdicional = (data: Omit<Adicional, 'id'>) =>
  apiClient.post<Adicional>(ADICIONALES_URL, data);

// Actualizar un adicional existente por su ID
// Asegúrate de que 'data' incluya todos los campos esperados por el backend (activo, esGlobal, etc.)
export const actualizarAdicional = (id: number | string, data: Omit<Adicional, 'id'>) =>
  apiClient.put<Adicional>(`${ADICIONALES_URL}/${id}`, data);

// Realizar la baja lógica de un adicional por su ID
export const eliminarAdicional = (id: number | string) =>
  apiClient.baja(`${ADICIONALES_URL}/${id}/baja`);