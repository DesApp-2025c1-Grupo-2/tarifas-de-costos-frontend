
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

const initialTransportistas: Transportista[] = [
  { id: 1, nombre: 'Juan Pérez', empresa: 'Acme SRL', correo: 'juan@example.com', telefono: '1234567890' },
  { id: 2, nombre: 'María Gómez', empresa: 'Logística SA', correo: 'maria@example.com', telefono: '0987654321' },
];

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
      nombre: formData.get('Nombre') as string,
      empresa: formData.get('Empresa') as string,
      correo: formData.get('Correo electrónico') as string,
      telefono: formData.get('Teléfono de contacto') as string,
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
      (formRef.current.querySelector('input[name="Nombre"]') as HTMLInputElement)!.value = transportista.nombre;
      (formRef.current.querySelector('input[name="Empresa"]') as HTMLInputElement)!.value = transportista.empresa;
      (formRef.current.querySelector('input[name="Correo electrónico"]') as HTMLInputElement)!.value = transportista.correo;
      (formRef.current.querySelector('input[name="Teléfono de contacto"]') as HTMLInputElement)!.value = transportista.telefono;
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
                  <td>{transportista.nombre}</td>
                  <td>{transportista.empresa}</td>
                  <td>{transportista.correo}</td>
                  <td>{transportista.telefono}</td>
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