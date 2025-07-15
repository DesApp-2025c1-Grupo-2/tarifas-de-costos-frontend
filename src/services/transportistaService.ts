
import { API_BASE_URL } from '../config/api';

export interface VehiculoPerfil {
  id: number;
  tipoVehiculo: string;
}

export interface ZonaOperacion {
  id: number;
  nombre: string;
}

export interface HistorialServicioPerfil {
  id: number;
  fechaViaje: string;
  nombreTarifaUtilizada: string;
  valorTotalTarifa: number;
  nombreCarga: string;
}

export interface TransportistaProfile extends Transportista {
  vehiculos: VehiculoPerfil[];
  zonasOperacion: ZonaOperacion[];
  historialServicios: HistorialServicioPerfil[];
}

export type Transportista = {
  activo: boolean;
  id: number;
  cuit: string; 
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

export async function actualizarTransportista(id: number, data: Omit<Transportista, 'id'>): Promise<Transportista> {
  const res = await fetch(`${TRANSPORTISTAS_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar transportista');
  return res.json();
}

export async function eliminarTransportista(id: number): Promise<void> {
  const res = await fetch(`${TRANSPORTISTAS_URL}/${id}/baja`, { method: 'PUT' });
  if (!res.ok) throw new Error('Error al eliminar transportista');
}

export async function getTransportistaProfile(id: number): Promise<TransportistaProfile> {
  const res = await fetch(`${TRANSPORTISTAS_URL}/${id}/profile`);
  
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('Transportista no encontrado.');
    }
    const errorText = await res.text();
    throw new Error(`Error al obtener el perfil del transportista: ${res.status} ${res.statusText} - ${errorText}`);
  }

  return res.json();
}