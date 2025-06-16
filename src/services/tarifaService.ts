import { API_BASE_URL } from '../config/api';

export type Tarifa = {
  id: number;
  transportista: { id: number };
  tipoVehiculo: { id: number };
  zonaViaje: { id: number };
  tipoCargaTarifa: { id: number };
  valorBase: number;
  total: number;
  adicionales: any[];
};

const TARIFAS_URL = `${API_BASE_URL}/tarifas`;

export async function obtenerTarifas(): Promise<Tarifa[]> {
  const res = await fetch(TARIFAS_URL);
  if (!res.ok) throw new Error('Error al obtener tarifas');
  return res.json();
}

export const crearTarifa = async (tarifa: Omit<Tarifa, 'id'>) => {
  const response = await fetch('/api/tarifas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tarifa),
  });

  if (!response.ok) {
    throw new Error('Error al crear la tarifa');
  }

  return await response.json(); // o como manejes la respuesta
};


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