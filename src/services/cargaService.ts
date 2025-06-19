import { API_BASE_URL } from '../config/api';

export type Carga = {
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

export async function actualizarCarga(id: string, data: Omit<Carga, 'id'>): Promise<Carga> {
  const res = await fetch(`${CARGAS_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar carga');
  return res.json();
}

export async function eliminarCarga(id: number): Promise<void> {
  const res = await fetch(`${CARGAS_URL}/${id}/baja`, {
    method: 'PUT',
  });
  if (!res.ok) throw new Error('Error al eliminar carga');
}