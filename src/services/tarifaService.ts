// src/services/tarifaService.ts

import { API_BASE_URL } from '../config/api';

// Este tipo ahora es un espejo exacto del TarifaCostoDTO del backend.
export type Tarifa = {
  id: number;
  codigo?: string;
  nombre?: string;
  valorBase: number;
  esVigente?: boolean;
  
  // Nombres de campo corregidos para que coincidan con el DTO
  transportistaId?: number;
  transportistaNombre?: string;

  zonaId?: number; // Corregido de zonaViajeId
  zonaNombre?: string;

  tipoCargaId?: number; // Corregido de tipoCargaTarifaId
  tipoCargaNombre?: string;

  tipoVehiculoId?: number;
  tipoVehiculoNombre?: string;

  adicionales?: any[]; // Se mantiene flexible
  total?: number;      // El DTO no lo incluye, pero la entidad sí. Lo dejamos opcional.
};

const TARIFAS_URL = `${API_BASE_URL}/tarifas`;

export async function obtenerTarifas(): Promise<Tarifa[]> {
  const res = await fetch(TARIFAS_URL);
  if (!res.ok) throw new Error('Error al obtener tarifas');
  return res.json();
}

// ... El resto de las funciones (crear, actualizar, eliminar) no cambian.
export const crearTarifa = async (tarifa: any) => {
  const response = await fetch(TARIFAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tarifa),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al crear la tarifa: ${errorText}`);
  }
  return response.json();
};

export async function actualizarTarifa(id: number | string, data: any): Promise<Tarifa> {
  const res = await fetch(`${TARIFAS_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar tarifa. Endpoint no encontrado en el backend.');
  return res.json();
}

export async function eliminarTarifa(id: number | string): Promise<void> {
  const res = await fetch(`${TARIFAS_URL}/${id}/baja`, {
    method: 'PUT',
  });
  if (!res.ok) throw new Error('Error al eliminar tarifa');
}