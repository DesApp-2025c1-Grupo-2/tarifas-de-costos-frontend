import { apiClient } from './apiClient'; // 👈 1. Importar el apiClient
const API_URL = import.meta.env.VITE_API_BASE_URL;


// --- TIPOS (Sin cambios) ---
export type TipoVehiculo = {
  activo: boolean;
  id: number;
  nombre: string;
  capacidadPesoKG: number;
  capacidadVolumenM3: number;
  descripcion: string;
};

// --- URL (Sin cambios) ---
const TIPOS_VEHICULO_URL = `${API_URL}/vehiculos`;

// --- FUNCIONES (Refactorizadas) ---

// 👇 2. Reemplazado fetch con apiClient.get
export function obtenerTiposVehiculo(): Promise<TipoVehiculo[]> {
  return apiClient.get<TipoVehiculo[]>(TIPOS_VEHICULO_URL);
}

// 👇 3. Reemplazado fetch con apiClient.post
export function crearTipoVehiculo(data: Omit<TipoVehiculo, 'id'>): Promise<TipoVehiculo> {
  return apiClient.post<TipoVehiculo>(TIPOS_VEHICULO_URL, data);
}

// 👇 4. Reemplazado fetch con apiClient.put
export function actualizarTipoVehiculo(id: string | number, data: Omit<TipoVehiculo, 'id'>): Promise<TipoVehiculo> {
  return apiClient.put<TipoVehiculo>(`${TIPOS_VEHICULO_URL}/${id}`, data);
}

// 👇 5. Reemplazado fetch con apiClient.baja
export function eliminarTipoVehiculo(id: string | number): Promise<void> {
  return apiClient.baja(`${TIPOS_VEHICULO_URL}/${id}/baja`);
}