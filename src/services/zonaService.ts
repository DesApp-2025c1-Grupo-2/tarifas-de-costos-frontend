import { API_BASE_URL } from '../config/api'; 

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

const ZONAS_URL = `${API_BASE_URL}/zonas`;
const REPORTES_ZONAS_COMPARATIVA_URL = `${API_BASE_URL}/zonas/comparativa-costos`;

export async function obtenerZonas(): Promise<ZonaViaje[]> {
  const res = await fetch(ZONAS_URL);
  if (!res.ok) throw new Error('Error al obtener zonas');
  return res.json();
}

export async function crearZona(data: Omit<ZonaViaje, 'id'>): Promise<ZonaViaje> {
  const res = await fetch(ZONAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear zona');
  return res.json();
}

export async function actualizarZona(id: number, data: Omit<ZonaViaje, 'id'>): Promise<ZonaViaje> {
  const res = await fetch(`${ZONAS_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar zona');
  return res.json();
}

export async function eliminarZona(id: number): Promise<void> {
  const res = await fetch(`${ZONAS_URL}/${id}/baja`, { method: 'PUT' });
  if (!res.ok) throw new Error('Error al eliminar zona');
}

export async function obtenerComparativaCostosPorZona(): Promise<Record<string, ZonaComparativa>> { 
  const res = await fetch(REPORTES_ZONAS_COMPARATIVA_URL);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al obtener comparativa de costos por zona: ${res.status} ${res.statusText} - ${errorText}`);
  }

  const rawData: Record<string, ZonaComparativa | string> = await res.json();
  const processedData: Record<string, ZonaComparativa> = {};

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