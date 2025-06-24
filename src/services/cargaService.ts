import { API_BASE_URL } from '../config/api';

export type Carga = {
  activo: boolean;
  id: number;
  nombre: string;
  descripcion: string;
};

const CARGAS_URL = `${API_BASE_URL}/tipo-carga-tarifa`;

export async function obtenerCargas(): Promise<Carga[]> {
  const res = await fetch(CARGAS_URL);
  if (!res.ok) throw new Error('Error al obtener cargas');
  return res.json();
}

export async function crearCarga(data: Omit<Carga, 'id'>): Promise<Carga> {
  const res = await fetch(CARGAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear carga');
  return res.json();
}

/**
 * Esta función está correctamente implementada para usar PUT,
 * que es el método estándar para actualizaciones.
 * El backend debe ser ajustado para aceptar este método en esta ruta.
 */
export async function actualizarCarga(id: string, data: Omit<Carga, 'id'>): Promise<Carga> {
  const res = await fetch(`${CARGAS_URL}/${id}`, {
    method: 'PUT', // Se revierte a PUT, que es el método correcto.
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    // Este es el error que estás viendo, provocado por la respuesta 405 del servidor.
    throw new Error('Error al actualizar carga');
  }
  return res.json();
}

export async function eliminarCarga(id: number): Promise<void> {
  const res = await fetch(`${CARGAS_URL}/${id}/baja`, {
    method: 'PUT', // Nota: Tu endpoint de eliminación también usa PUT, lo cual es un poco inusual pero consistente en tu app.
  });
  if (!res.ok) throw new Error('Error al eliminar carga');
}