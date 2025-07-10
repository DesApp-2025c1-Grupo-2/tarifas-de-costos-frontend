
import { API_BASE_URL } from '../config/api'; 

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
export async function obtenerAdicionales(): Promise<Adicional[]> {
  const res = await fetch(ADICIONALES_URL);
  if (!res.ok) {
    
    const errorText = await res.text(); 
    throw new Error(`Error al obtener adicionales: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return res.json();
}

/**
 * @param data 
 * @returns 
 */
export async function crearAdicional(data: Omit<Adicional, 'id'>): Promise<Adicional> {
  const res = await fetch(ADICIONALES_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al crear adicional: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return res.json();
}

/**

 * @param id 
 * @param data 
 * @returns 
 */
export async function actualizarAdicional(id: string | number, data: Omit<Adicional, 'id'>): Promise<Adicional> {
  const res = await fetch(`${ADICIONALES_URL}/${id}`, { 
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al actualizar adicional: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return res.json();
}

/**.
 * @param id 
 * @returns 
 */
export async function eliminarAdicional(id: string | number): Promise<void> {
  const res = await fetch(`${ADICIONALES_URL}/${id}/baja`, { 
    method: 'PUT',
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al eliminar adicional: ${res.status} ${res.statusText} - ${errorText}`);
  }
}