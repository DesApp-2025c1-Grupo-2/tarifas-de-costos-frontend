import { API_BASE_URL } from '../config/api';

export type Transportista = {
  id: number;  // Cambiado de string a number (si usas ID numérico en backend)
  nombreEmpresa: string;       
  contactoNombre: string;      
  contactoEmail: string;      
  contactoTelefono: string;
};

const TRANSPORTISTAS_URL = `${API_BASE_URL}/transportistas`;

export async function obtenerTransportistas(): Promise<Transportista[]> {
  const res = await fetch(TRANSPORTISTAS_URL);
  if (!res.ok) throw new Error('Error al obtener transportistas');
  return res.json();
}

  
  export async function crearTransportista(data: Omit<Transportista, 'id'>): Promise<Transportista> {
    const res = await fetch(TRANSPORTISTAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear transportista');
    return res.json();
  }
  
  export async function actualizarTransportista(id: string, data: Omit<Transportista, 'id'>): Promise<Transportista> {
    const res = await fetch(`${TRANSPORTISTAS_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar transportista');
    return res.json();
  }
  
  export async function eliminarTransportista(id: string): Promise<void> {
    const res = await fetch(`${TRANSPORTISTAS_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar transportista');
  }