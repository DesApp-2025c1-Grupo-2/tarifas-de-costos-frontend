import { apiClient } from './apiClient'; // 👈 1. Importar el apiClient
const API_URL = import.meta.env.VITE_API_BASE_URL;


// --- TIPOS (Sin cambios) ---
export type ZonaViaje = {
  activo: boolean;
  id: number;
  nombre: string;
  descripcion: string;
  regionMapa: string;
};

export type ZonaComparativa = {
  count?: number;
  min?: number;
  max?: number;
  average?: number; 
  sum?: number; 
};

// --- URLs (Sin cambios) ---
const ZONAS_URL = `${API_URL}/zonas`;
const REPORTES_ZONAS_COMPARATIVA_URL = `${API_URL}/zonas/comparativa-costos`;

// --- FUNCIONES (Refactorizadas) ---

// 👇 2. Reemplazado fetch con apiClient.get
export function obtenerZonas(): Promise<ZonaViaje[]> {
  return apiClient.get<ZonaViaje[]>(ZONAS_URL);
}

// 👇 3. Reemplazado fetch con apiClient.post
export function crearZona(data: Omit<ZonaViaje, 'id'>): Promise<ZonaViaje> {
  return apiClient.post<ZonaViaje>(ZONAS_URL, data);
}

// 👇 4. Reemplazado fetch con apiClient.put
export function actualizarZona(id: number, data: Omit<ZonaViaje, 'id'>): Promise<ZonaViaje> {
  return apiClient.put<ZonaViaje>(`${ZONAS_URL}/${id}`, data);
}

// 👇 5. Reemplazado fetch con apiClient.baja
export function eliminarZona(id: number): Promise<void> {
  return apiClient.baja(`${ZONAS_URL}/${id}/baja`);
}

// 👇 6. Esta función mantiene su lógica especial, pero usa apiClient.get para la petición
export async function obtenerComparativaCostosPorZona(): Promise<Record<string, ZonaComparativa>> { 
  // Usa apiClient.get para beneficiarse del cacheo de errores.
  const rawData = await apiClient.get<Record<string, ZonaComparativa | string>>(REPORTES_ZONAS_COMPARATIVA_URL);
  
  const processedData: Record<string, ZonaComparativa> = {};

  // La lógica de procesamiento para este endpoint específico se mantiene igual.
  for (const [key, value] of Object.entries(rawData)) {
    if (typeof value === 'string') {
      processedData[key] = {
        count: 0,
        min: 0,
        max: 0,
        average: 0,
        sum: 0,
      };
    } else {
      processedData[key] = value;
    }
  }

  return processedData;
}