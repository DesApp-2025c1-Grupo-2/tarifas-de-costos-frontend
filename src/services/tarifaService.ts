import { API_BASE_URL } from '../config/api';

export type Tarifa = {
  id: number;
  transportista: string;
  vehiculo: string;
  zona: string;
  carga: string;
  items: string[];
  costoBase: number;
  adicionales: number;
  total: number;
};

const TARIFAS_URL = `${API_BASE_URL}/tarifas`;

export async function obtenerTarifas(): Promise<Tarifa[]> {
  const res = await fetch(TARIFAS_URL);
  if (!res.ok) throw new Error('Error al obtener tarifas');
  return res.json();
}

export async function crearTarifa(data: Omit<Tarifa, 'id'>): Promise<Tarifa> {
  console.log(data)
  const res = await fetch(TARIFAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear tarifa');
  return res.json();
}

export async function actualizarTarifa(id: number | string, data: Omit<Tarifa, 'id'>): Promise<Tarifa> {
  const res = await fetch(`${TARIFAS_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar tarifa');
  return res.json();
}

export async function eliminarTarifa(id: number | string): Promise<void> {
  const res = await fetch(`${TARIFAS_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar tarifa');
}