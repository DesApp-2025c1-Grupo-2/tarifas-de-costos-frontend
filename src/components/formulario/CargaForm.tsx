import React, { useState, useEffect, useRef } from 'react';
import FormularioDinamico, { Campo } from './FormularioDinamico';
import { estiloBoton } from '../Botones';
import {
  obtenerCargas,
  crearCarga,
  actualizarCarga,
  eliminarCarga,
  Carga,
} from '../../services/cargaService';

const camposCarga: Campo[] = [
  { tipo: 'input', nombre: 'Nombre', clase: 'text' },
  { tipo: 'input', nombre: 'Descripción', clase: 'textarea' },
];

export const FormCrearCarga: React.FC = () => {
  const [cargasList, setCargasList] = useState<Carga[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [editingCarga, setEditingCarga] = useState<Carga | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    cargarCargas();
  }, []);

  const cargarCargas = async () => {
    try {
      const data = await obtenerCargas();
      setCargasList(data);
    } catch (error) {
      console.error('Error al cargar cargas:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nuevaCarga = {
      nombre: formData.get('Nombre') as string,
      descripcion: formData.get('Descripción') as string,
    };

    try {
      if (editingCarga) {
        await actualizarCarga(editingCarga.id.toString(), nuevaCarga);
        setMensaje('Carga actualizada con éxito!');
      } else {
        await crearCarga(nuevaCarga);
        setMensaje('Carga creada con éxito!');
      }
      setEditingCarga(null);
      setMostrarFormulario(false);
      if (formRef.current) formRef.current.reset();
      cargarCargas();
    } catch (error) {
      console.error(error);
      setMensaje('Hubo un error al guardar la carga.');
    }

    setTimeout(() => setMensaje(''), 2000);
  };

  const handleEdit = (carga: Carga) => {
    setEditingCarga(carga);
    setMostrarFormulario(true);
    if (formRef.current) {
      (formRef.current.querySelector('input[name="Nombre"]') as HTMLInputElement)!.value = carga.nombre;
      (formRef.current.querySelector('textarea[name="Descripción"]') as HTMLTextAreaElement)!.value = carga.descripcion;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await eliminarCarga(id);
      setMensaje('Carga eliminada con éxito!');
      cargarCargas();
    } catch (error) {
      console.error(error);
      setMensaje('Error al eliminar la carga.');
    }
    setTimeout(() => setMensaje(''), 2000);
  };

  const handleCancelEdit = () => {
    setEditingCarga(null);
    setMostrarFormulario(false);
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  return (
    <div>
      {!mostrarFormulario && !editingCarga && (
        <button style={estiloBoton} onClick={() => setMostrarFormulario(true)}>
          Crear nueva carga
        </button>
      )}

      {(mostrarFormulario || editingCarga) && (
        <>
          <FormularioDinamico
            titulo={editingCarga ? 'Editar Carga' : 'Registrar nueva carga'}
            campos={camposCarga}
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
        <h2>Cargas Registradas</h2>
        {cargasList.length === 0 ? (
          <p>No hay cargas registradas.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {cargasList.map(carga => (
                <tr key={carga.id}>
                  <td>{carga.nombre}</td>
                  <td>{carga.descripcion}</td>
                  <td>
                    <button className="edit-button" onClick={() => handleEdit(carga)}>
                      Editar
                    </button>
                    <button className="delete-button" onClick={() => handleDelete(carga.id.toString())}>
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