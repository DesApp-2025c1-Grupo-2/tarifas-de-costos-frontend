/*
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
  { id: '1', nombre: 'Juan Pérez', empresa: 'Acme SRL', correo: 'juan@example.com', telefono: '1234567890' },
  { id: '2', nombre: 'María Gómez', empresa: 'Logística SA', correo: 'maria@example.com', telefono: '0987654321' },
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
        await actualizarTransportista(editingTransportista.id, nuevoTransportista);
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
                    <button className="delete-button" onClick={() => handleDelete(transportista.id)}>
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
};
*/

import React, { useState } from 'react';
import FormularioDinamico, { Campo } from './FormularioDinamico';
import { estiloBoton } from '../Botones';

type Transportista = {
    id: string;
    nombre: string;
    empresa: string;
    correo: string;
    telefono: string;
};

const initialTransportistas: Transportista[] = [
    { id: '1', nombre: 'Juan Pérez', empresa: 'Acme SRL', correo: 'juan@example.com', telefono: '1234567890' },
    { id: '2', nombre: 'María Gómez', empresa: 'Logística SA', correo: 'maria@example.com', telefono: '0987654321' },
];

const camposTransportista: Campo[] = [
    { tipo: 'input', nombre: 'Nombre', clase: 'text' },
    { tipo: 'input', nombre: 'Empresa', clase: 'text' },
    { tipo: 'input', nombre: 'Correo electrónico', clase: 'email' },
    { tipo: 'input', nombre: 'Teléfono de contacto', clase: 'tel' },
];

export const FormCrearTransportista: React.FC = () => {
    const [transportistasList, setTransportistasList] = useState<Transportista[]>(initialTransportistas);
    const [mensaje, setMensaje] = useState('');
    const [editingTransportista, setEditingTransportista] = useState<Transportista | null>(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false); // nuevo estado
    const formRef = React.useRef<HTMLFormElement>(null) as React.RefObject<HTMLFormElement>;
  
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const transportistaData: Transportista = {
        id: editingTransportista ? editingTransportista.id : Date.now().toString(),
        nombre: formData.get('Nombre') as string,
        empresa: formData.get('Empresa') as string,
        correo: formData.get('Correo electrónico') as string,
        telefono: formData.get('Teléfono de contacto') as string,
      };
  
      if (editingTransportista) {
        setTransportistasList(
          transportistasList.map(t =>
            t.id === editingTransportista.id ? transportistaData : t
          )
        );
        setMensaje('Transportista actualizado con éxito!');
        setEditingTransportista(null);
      } else {
        setTransportistasList([...transportistasList, transportistaData]);
        setMensaje('Transportista registrado con éxito!');
      }
  
      setTimeout(() => setMensaje(''), 2000);
      event.currentTarget.reset();
      setMostrarFormulario(false);
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
  
    const handleDelete = (id: string) => {
      setTransportistasList(transportistasList.filter(t => t.id !== id));
      setMensaje('Transportista eliminado con éxito!');
      setEditingTransportista(null);
      setTimeout(() => setMensaje(''), 2000);
    };
  
    const handleCancelEdit = () => {
      setEditingTransportista(null);
      if (formRef.current) {
        formRef.current.reset();
      }
      setMostrarFormulario(false);
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
              titulo={editingTransportista ? "Editar Transportista" : "Registrar nuevo transportista"}
              campos={camposTransportista}
              redireccion="/"
              onSubmit={handleSubmit}
              formRef={formRef}
            />
            {(mostrarFormulario || editingTransportista) && (
              <button style={estiloBoton} className="cancel-button" onClick={handleCancelEdit}>
                Cancelar
              </button>
            )}
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
                      <button className="delete-button" onClick={() => handleDelete(transportista.id)}>
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
  };