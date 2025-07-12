import { API_BASE_URL } from '../config/api';
import { apiClient } from './apiClient'; // 👈 1. Importar el apiClient

// --- TIPOS (Sin cambios) ---
export type Transportista = {
  activo: boolean;
  id: number;
  cuit: string; 
  nombreEmpresa: string;       
  contactoNombre: string;      
  contactoEmail: string;      
  contactoTelefono: string;
};

// --- URL (Sin cambios) ---
const TRANSPORTISTAS_URL = `${API_BASE_URL}/transportistas`;

// --- FUNCIONES (Refactorizadas) ---

// 👇 2. Reemplazado fetch con apiClient.get
export function obtenerTransportistas(): Promise<Transportista[]> {
  return apiClient.get<Transportista[]>(TRANSPORTISTAS_URL);
}

// 👇 3. Reemplazado fetch con apiClient.post
export function crearTransportista(data: Omit<Transportista, 'id'>): Promise<Transportista> {
  return apiClient.post<Transportista>(TRANSPORTISTAS_URL, data);
}
  
// 👇 4. Reemplazado fetch con apiClient.put
export function actualizarTransportista(id: number, data: Omit<Transportista, 'id'>): Promise<Transportista> {
  return apiClient.put<Transportista>(`${TRANSPORTISTAS_URL}/${id}`, data);
}
  
// 👇 5. Reemplazado fetch con apiClient.baja
export function eliminarTransportista(id: number): Promise<void> {
  return apiClient.baja(`${TRANSPORTISTAS_URL}/${id}/baja`);
}