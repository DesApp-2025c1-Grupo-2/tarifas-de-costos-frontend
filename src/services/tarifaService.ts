// ruta: src/services/tarifaService.ts

import { API_BASE_URL } from '../config/api';

// --- INICIO DE LA MODIFICACIÓN ---
// Se define el tipo 'Tarifa' para que coincida con los datos que la API envía y el formulario necesita.
// Tu DTO en el backend debe enviar todos estos campos.
export type Tarifa = {
  id: number;
  nombreTarifa: string;
  valorBase: number;
  esVigente?: boolean;

  transportistaId: number;
  transportistaNombre: string;
  
  tipoVehiculoId: number;
  tipoVehiculoNombre: string;

  zonaId: number;
  zonaNombre: string;

  tipoCargaId: number;
  tipoCargaNombre: string;

  adicionales: {
    adicional: {
      id: number;
      nombre: string;
      descripcion: string;
      costoDefault: number;
    };
    costoEspecifico: number;
  }[];
  
  total?: number;
};
// --- FIN DE LA MODIFICACIÓN ---


const TARIFAS_URL = `${API_BASE_URL}/tarifas`;

export async function obtenerTarifas(): Promise<Tarifa[]> {
  const res = await fetch(TARIFAS_URL);
  if (!res.ok) throw new Error('Error al obtener tarifas');
  return res.json();
}

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

export async function actualizarTarifa(id: number, data: any): Promise<Tarifa> {
  const res = await fetch(`${TARIFAS_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error al actualizar la tarifa: ${errorText}`);
  }
  return res.json();
}

export async function eliminarTarifa(id: number | string): Promise<void> {
  const res = await fetch(`${TARIFAS_URL}/${id}/baja`, {
    method: 'PUT',
  });
  if (!res.ok) throw new Error('Error al eliminar tarifa');
}