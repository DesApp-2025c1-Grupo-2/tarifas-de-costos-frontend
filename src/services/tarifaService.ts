import { API_BASE_URL } from '../config/api';
import { apiClient } from './apiClient'; // 👈 1. Importar el apiClient

// --- TIPOS (Sin cambios) ---
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

// --- URL (Sin cambios) ---
const TARIFAS_URL = `${API_BASE_URL}/tarifas`;

// --- FUNCIONES (Refactorizadas) ---

// 👇 2. Se usa apiClient.get y se mantiene la lógica de mapeo
export async function obtenerTarifas(): Promise<Tarifa[]> {
  const data = await apiClient.get<any[]>(TARIFAS_URL);
  
  // Se conserva la lógica de transformación específica de este endpoint
  return data.map((tarifa: any) => ({
    ...tarifa,
    // El backend devuelve 'nombre' pero el frontend espera 'nombreTarifa'
    nombreTarifa: tarifa.nombre 
  }));
}

// 👇 3. Reemplazado fetch con apiClient.post
export function crearTarifa(tarifa: any): Promise<Tarifa> {
  return apiClient.post<Tarifa>(TARIFAS_URL, tarifa);
};

// 👇 4. Reemplazado fetch con apiClient.put
export function actualizarTarifa(id: number, data: any): Promise<Tarifa> {
  return apiClient.put<Tarifa>(`${TARIFAS_URL}/${id}`, data);
}

// 👇 5. Reemplazado fetch con apiClient.baja
export function eliminarTarifa(id: number | string): Promise<void> {
  return apiClient.baja(`${TARIFAS_URL}/${id}/baja`);
}

// 👇 6. Reemplazado fetch con apiClient.post para agregar adicionales
export function agregarAdicionalATarifa(tarifaId: number, datosAdicional: { adicional: { id: number }, costoEspecifico?: number }): Promise<any> {
  return apiClient.post(`${TARIFAS_URL}/${tarifaId}/adicionales`, datosAdicional);
}