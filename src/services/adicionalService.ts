
import { API_BASE_URL } from '../config/api'; 
import { apiClient } from './apiClient';

export type Adicional = {
  activo: boolean;
  id: number; 
  nombre: string;
  costoDefault: number; 
  descripcion: string;
  esGlobal?: boolean;
};


const ADICIONALES_URL = `${API_BASE_URL}/adicionales`; 

/**
 * @returns 
 */
export function obtenerAdicionales(): Promise<Adicional[]> {
  return apiClient.get<Adicional[]>(ADICIONALES_URL);
}


/**
 * @param data 
 * @returns 
 */

/** */
export function crearAdicional(data: Omit<Adicional, 'id'>): Promise<Adicional> {
  return apiClient.post<Adicional>(ADICIONALES_URL, data);
}


/**

 * @param id 
 * @param data 
 * @returns 
 */
export function actualizarAdicional(id: string | number, data: Omit<Adicional, 'id'>): Promise<Adicional> {
  return apiClient.put<Adicional>(`${ADICIONALES_URL}/${id}`, data);
}

/**.
 * @param id 
 * @returns 
 */
export function eliminarAdicional(id: string | number): Promise<void> {
  return apiClient.baja(`${ADICIONALES_URL}/${id}/baja`);
}
