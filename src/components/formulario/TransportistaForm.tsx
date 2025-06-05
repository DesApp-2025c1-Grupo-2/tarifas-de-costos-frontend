
import React, { useState, useEffect, useRef } from 'react';
import FormularioDinamico, { Campo } from './FormularioDinamico';
import { estiloBoton } from '../Botones';
import {
  obtenerTransportistas,
  crearTransportista,
  actualizarTransportista,
  eliminarTransportista,
  Transportista,
} from '../../services/transportistaService';

const camposTransportista: Campo[] = [
  { tipo: 'input', nombre: 'Nombre', clase: 'text' }, 
  { tipo: 'input', nombre: 'Empresa', clase: 'text' },
  { tipo: 'input', nombre: 'Correo electrónico', clase: 'email' },
  { tipo: 'input', nombre: 'Teléfono de contacto', clase: 'tel' },
];

export const FormCrearTransportista: React.FC = () => {
  const [transportistasList, setTransportistasList] = useState<Transportista[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [editingTransportista, setEditingTransportista] = useState<Transportista | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    cargarTransportistas();
  }, []);

  const cargarTransportistas = async () => {
    try {
      const data = await obtenerTransportistas();
      setTransportistasList(data);
    } catch (error) {
      console.error('Error al cargar transportistas:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nuevoTransportista = {
      nombreEmpresa: formData.get('Empresa') as string,
      contactoNombre: formData.get('Nombre') as string,
      contactoEmail: formData.get('Correo electrónico') as string,
      contactoTelefono: formData.get('Teléfono de contacto') as string,
      };

    try {
      if (editingTransportista) {
        await actualizarTransportista(editingTransportista.id.toString(), nuevoTransportista);
        setMensaje('Transportista actualizado con éxito!');
      } else {
        await crearTransportista(nuevoTransportista);
        setMensaje('Transportista creado con éxito!');
      }
      setEditingTransportista(null);
      setMostrarFormulario(false);
      if (formRef.current) formRef.current.reset();
      cargarTransportistas();
    } catch (error) {
      console.error(error);
      setMensaje('Hubo un error al guardar el transportista.');
    }

    setTimeout(() => setMensaje(''), 2000);
  };

  const handleEdit = (transportista: Transportista) => {
    setEditingTransportista(transportista);
    setMostrarFormulario(true);
    if (formRef.current) {
      (formRef.current.querySelector('input[name="Nombre"]') as HTMLInputElement)!.value = transportista.contactoNombre;
      (formRef.current.querySelector('input[name="Empresa"]') as HTMLInputElement)!.value = transportista.nombreEmpresa;
      (formRef.current.querySelector('input[name="Correo electrónico"]') as HTMLInputElement)!.value = transportista.contactoEmail;
      (formRef.current.querySelector('input[name="Teléfono de contacto"]') as HTMLInputElement)!.value = transportista.contactoTelefono;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await eliminarTransportista(id);
      setMensaje('Transportista eliminado con éxito!');
      cargarTransportistas();
    } catch (error) {
      console.error(error);
      setMensaje('Error al eliminar el transportista.');
    }
    setTimeout(() => setMensaje(''), 2000);
  };

  const handleCancelEdit = () => {
    setEditingTransportista(null);
    setMostrarFormulario(false);
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  return (
    <div>
      {!mostrarFormulario && !editingTransportista && (
        <button style={estiloBoton} onClick={() => setMostrarFormulario(true)}>
          Crear nuevo transportista
        </button>
      )}

      {(mostrarFormulario || editingTransportista) && (
        <>
          <FormularioDinamico
            titulo={editingTransportista ? 'Editar Transportista' : 'Registrar nuevo transportista'}
            campos={camposTransportista}
            redireccion="/"
            onSubmit={handleSubmit}
            formRef={formRef}
          />
          <button style={estiloBoton} className="cancel-button" onClick={handleCancelEdit}>
            Cancelar
          </button>
        </>
      )}

      {mensaje && <div className="mensaje-exito">{mensaje}</div>}

      <div className="transportista-list">
        <h2>Transportistas Registrados</h2>
        {transportistasList.length === 0 ? (
          <p>No hay transportistas registrados.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Empresa</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Acción</th>
              </tr>
            </thead>
<tbody>
  {transportistasList.map(transportista => (
    <tr key={transportista.id}>
      <td>{transportista.contactoNombre}</td>
      <td>{transportista.nombreEmpresa}</td>
      <td>{transportista.contactoEmail}</td>
      <td>{transportista.contactoTelefono}</td>
      {/* Envuelve los botones en un td */}
      <td>
        <button className="edit-button" onClick={() => handleEdit(transportista)}>
          Editar
        </button>
        <button className="delete-button" onClick={() => handleDelete(transportista.id.toString())}>
          Eliminar
        </button>
      </td>
    </tr>
  ))}
</tbody>
          </table>
        )}
      </div>
    </div>
  );
}