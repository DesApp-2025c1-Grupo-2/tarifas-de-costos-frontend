import { API_BASE_URL } from '../config/api'; // Reutilizamos tu configuración base

// 1. Define el tipo de dato que esperamos del backend para este reporte
export interface FrecuenciaAdicional {
  nombreAdicional: string;
  cantidad: number;
}

const REPORTES_URL = `${API_BASE_URL}/reportes`; // URL base para los reportes

/**
 * Obtiene la frecuencia de uso de cada adicional desde la API.
 * @returns Una promesa con la lista de frecuencias de adicionales.
 */
export async function getFrecuenciaAdicionales(): Promise<FrecuenciaAdicional[]> {
  const res = await fetch(`${REPORTES_URL}/frecuencia-adicionales`);

  // Usamos el mismo manejo de errores que ya tienes
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al obtener el reporte de frecuencias: ${res.status} ${res.statusText} - ${errorText}`);
  }

  return res.json();
}