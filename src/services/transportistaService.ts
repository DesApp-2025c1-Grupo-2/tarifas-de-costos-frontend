import { apiClient } from './apiClient';

// Tipo principal para la lista general de transportistas
export type Transportista = {
  id: string;
  cuit: string;
  nombre_comercial: string; // <-- Usar esta propiedad consistentemente
  contacto: {
    nombre: string;
    email: string;
    telefono: Telefono; // Usar el nuevo tipo Telefono
  };
  activo?: boolean; // Mantenemos por si acaso
};

// Tipo Telefono que coincide con el DTO del backend
export type Telefono = {
  codigo_pais?: string | null;
  codigo_area?: string | null;
  numero: string; // Asumimos que el número siempre está
  id?: string | null; // Id interno de la API de viajes
};

// Tipo específico para el perfil detallado del transportista
export interface TransportistaProfile {
  id: string;
  nombreEmpresa: string; // Nombre como viene en el endpoint de Profile
  cuit: string;
  contactoNombre: string;
  contactoEmail: string;
  contactoTelefono: Telefono | null; // El teléfono podría ser null o el objeto Telefono
  tiposVehiculo: { id: string; nombre: string }[]; // <-- CORREGIDO: Renombrado de 'vehiculos'
  zonasOperacion: { id: number; nombre: string }[];
  historialServicios: {
    id: number;
    fecha: string | number[]; // Puede ser string ISO o array numérico del backend
    nombreTarifaUtilizada?: string;
    valorTotalTarifa: number;
    nombreCarga?: string;
  }[];
}

const TRANSPORTISTAS_URL = '/api/transportistas';

// Devuelve la lista general
export const obtenerTransportistas = () =>
  apiClient.get<Transportista[]>(TRANSPORTISTAS_URL);

// Asumimos que la API para crear/actualizar espera nombre_comercial
export const crearTransportista = (data: Omit<Transportista, 'id'>) =>
  apiClient.post<Transportista>(TRANSPORTISTAS_URL, data);

export const actualizarTransportista = (id: number | string, data: Omit<Transportista, 'id'>) =>
  apiClient.put<Transportista>(`${TRANSPORTISTAS_URL}/${id}`, data);

export const eliminarTransportista = (id: number | string) =>
  apiClient.baja(`${TRANSPORTISTAS_URL}/${id}/baja`);

// Devuelve el perfil detallado
export const getTransportistaProfile = (id: number | string) =>
  apiClient.get<TransportistaProfile>(`${TRANSPORTISTAS_URL}/${id}/profile`);