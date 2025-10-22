import { apiClient } from './apiClient';



export type Transportista = {
  id: string;
  nombreComercial: string; // Se cambia 'nombreEmpresa' por 'nombreComercial'
  cuit: string;
  nombre_comercial: string;
  contacto: {
    nombre: string;
    email: string;
    telefono: any;
  };
  nombreEmpresa?: string;
  contactoNombre?: string;
};


export interface TransportistaProfile {
  id: string;
  nombreEmpresa: string;
  cuit: string;
  contactoNombre: string;
  contactoEmail: string;
  contactoTelefono: string;
  vehiculos: { id: string; nombre: string }[];
  zonasOperacion: { id: number; nombre: string }[];
  historialServicios: {
    id: number;
    fecha: string | number[];
    nombreTarifaUtilizada?: string;
    valorTotalTarifa: number;
    nombreCarga?: string;
  }[];
}

const TRANSPORTISTAS_URL = '/api/transportistas';

export const obtenerTransportistas = () =>
  apiClient.get<Transportista[]>(TRANSPORTISTAS_URL);

export const crearTransportista = (data: Omit<Transportista, 'id'>) =>
  apiClient.post<Transportista>(TRANSPORTISTAS_URL, data);

export const actualizarTransportista = (id: number | string, data: Omit<Transportista, 'id'>) =>
  apiClient.put<Transportista>(`${TRANSPORTISTAS_URL}/${id}`, data);

export const eliminarTransportista = (id: number | string) =>
  apiClient.baja(`${TRANSPORTISTAS_URL}/${id}/baja`);

export const getTransportistaProfile = (id: number | string) =>
  apiClient.get<TransportistaProfile>(`${TRANSPORTISTAS_URL}/${id}/profile`);