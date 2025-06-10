import { API_BASE_URL } from '../config/api';

export type TipoVehiculo = {
  id: number;
  nombre: string;
  capacidadPesoKG: number;
  capacidadVolumenM3: number;
  descripcion: string;
};

const TIPOS_VEHICULO_URL = `${API_BASE_URL}/tipos-vehiculo`;

export async function obtenerTiposVehiculo(): Promise<TipoVehiculo[]> {
  const res = await fetch(TIPOS_VEHICULO_URL);
  if (!res.ok) throw new Error('Error al obtener tipos de vehículo');
  return res.json();
}

export async function crearTipoVehiculo(data: Omit<TipoVehiculo, 'id'>): Promise<TipoVehiculo> {
  const res = await fetch(TIPOS_VEHICULO_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear tipo de vehículo');
  return res.json();
}

export async function actualizarTipoVehiculo(id: string, data: Omit<TipoVehiculo, 'id'>): Promise<TipoVehiculo> {
  const res = await fetch(`${TIPOS_VEHICULO_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar tipo de vehículo');
  return res.json();
}

export async function eliminarTipoVehiculo(id: string): Promise<void> {
  const res = await fetch(`${TIPOS_VEHICULO_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar tipo de vehículo');
}