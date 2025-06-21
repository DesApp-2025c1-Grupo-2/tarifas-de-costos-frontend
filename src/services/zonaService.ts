import { API_BASE_URL } from '../config/api';

export type ZonaViaje = {
  activo: boolean;
  id: number;
  nombre: string;
  descripcion: string;
  regionMapa: string;
};

const ZONAS_URL = `${API_BASE_URL}/zonas`;

export async function obtenerZonas(): Promise<ZonaViaje[]> {
  const res = await fetch(ZONAS_URL);
  if (!res.ok) throw new Error('Error al obtener zonas');
  return res.json();
}

export async function crearZona(data: Omit<ZonaViaje, 'id'>): Promise<ZonaViaje> {
  const res = await fetch(ZONAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear zona');
  return res.json();
}

export async function actualizarZona(id: number, data: Omit<ZonaViaje, 'id'>): Promise<ZonaViaje> {
  const res = await fetch(`${ZONAS_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar zona');
  return res.json();
}

export async function eliminarZona(id: number): Promise<void> {
  const res = await fetch(`${ZONAS_URL}/${id}/baja`, { method: 'PUT' });
  if (!res.ok) throw new Error('Error al eliminar zona');
}