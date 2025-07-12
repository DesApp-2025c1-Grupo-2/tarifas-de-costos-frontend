import { API_BASE_URL } from '../config/api';
import { apiClient } from './apiClient'; // 👈 1. Importar el apiClient

// --- TIPOS (Sin cambios) ---
export type Carga = {
  activo: boolean;
  id: number;
  nombre: string;
  descripcion: string;
};

// --- URL (Sin cambios) ---
const CARGAS_URL = `${API_BASE_URL}/tipo-carga-tarifa`;

// --- FUNCIONES (Refactorizadas) ---

// 👇 2. Reemplazado fetch con apiClient.get
export function obtenerCargas(): Promise<Carga[]> {
  return apiClient.get<Carga[]>(CARGAS_URL);
}

// 👇 3. Reemplazado fetch con apiClient.post
export function crearCarga(data: Omit<Carga, 'id'>): Promise<Carga> {
  return apiClient.post<Carga>(CARGAS_URL, data);
}

// 👇 4. Reemplazado fetch con apiClient.put
export function actualizarCarga(id: string | number, data: Omit<Carga, 'id'>): Promise<Carga> {
  return apiClient.put<Carga>(`${CARGAS_URL}/${id}`, data);
}

// 👇 5. Reemplazado fetch con apiClient.baja
export function eliminarCarga(id: number): Promise<void> {
  return apiClient.baja(`${CARGAS_URL}/${id}/baja`);
}