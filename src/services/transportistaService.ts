import { API_BASE_URL } from '../config/api';

export type Transportista = {
    id: string;
    nombre: string;
    empresa: string;
    correo: string;
    telefono: string;
  };
  
  const API_URL = API_BASE_URL;
  
  //console.log('Base de la API:', API_BASE_URL);

  export async function obtenerTransportistas(): Promise<Transportista[]> {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Error al obtener transportistas');
    return res.json();
  }
  
  export async function crearTransportista(data: Omit<Transportista, 'id'>): Promise<Transportista> {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear transportista');
    return res.json();
  }
  
  export async function actualizarTransportista(id: string, data: Omit<Transportista, 'id'>): Promise<Transportista> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar transportista');
    return res.json();
  }
  
  export async function eliminarTransportista(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar transportista');
  }