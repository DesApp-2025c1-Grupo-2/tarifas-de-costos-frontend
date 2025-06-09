import React, { useState, useEffect, useRef } from 'react';
import FormularioDinamico, { Campo } from './FormularioDinamico';
import { estiloBoton } from '../Botones';
import {
  obtenerTiposVehiculo,
  crearTipoVehiculo,
  actualizarTipoVehiculo,
  eliminarTipoVehiculo,
  TipoVehiculo,
} from '../../services/tipoVehiculoService';

const camposTipoVehiculo: Campo[] = [
  { tipo: 'input', nombre: 'Nombre', clase: 'text' },
  { tipo: 'input', nombre: 'Capacidad de peso (KG)', clase: 'number' },
  { tipo: 'input', nombre: 'Capacidad de volumen (m³)', clase: 'number' },
  { tipo: 'input', nombre: 'Descripción', clase: 'text' },
];

export const FormCrearTipoVehiculo: React.FC = () => {
  const [tiposVehiculoList, setTiposVehiculoList] = useState<TipoVehiculo[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [editingTipo, setEditingTipo] = useState<TipoVehiculo | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    cargarTiposVehiculo();
  }, []);

  const cargarTiposVehiculo = async () => {
    try {
      const data = await obtenerTiposVehiculo();
      setTiposVehiculoList(data);
    } catch (error) {
      console.error('Error al cargar tipos de vehículo:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const nuevoTipo: Omit<TipoVehiculo, 'id'> = {
      nombre: formData.get('Nombre') as string,
      capacidadPesoKG: parseFloat(formData.get('Capacidad de peso (KG)') as string),
      capacidadVolumenM3: parseFloat(formData.get('Capacidad de volumen (m³)') as string),
      descripcion: formData.get('Descripción') as string,
    };

    try {
      if (editingTipo) {
        await actualizarTipoVehiculo(editingTipo.id.toString(), nuevoTipo);
        setMensaje('Tipo de vehículo actualizado con éxito!');
      } else {
        await crearTipoVehiculo(nuevoTipo);
        setMensaje('Tipo de vehículo creado con éxito!');
      }

      setEditingTipo(null);
      setMostrarFormulario(false);
      if (formRef.current) formRef.current.reset();
      cargarTiposVehiculo();
    } catch (error) {
      console.error(error);
      setMensaje('Hubo un error al guardar el tipo de vehículo.');
    }

    setTimeout(() => setMensaje(''), 2000);
  };

  const handleEdit = (tipo: TipoVehiculo) => {
    setEditingTipo(tipo);
    setMostrarFormulario(true);
    if (formRef.current) {
      (formRef.current.querySelector('input[name="Nombre"]') as HTMLInputElement)!.value = tipo.nombre;
      (formRef.current.querySelector('input[name="Capacidad de peso (KG)"]') as HTMLInputElement)!.value = tipo.capacidadPesoKG.toString();
      (formRef.current.querySelector('input[name="Capacidad de volumen (m³)"]') as HTMLInputElement)!.value = tipo.capacidadVolumenM3.toString();
      (formRef.current.querySelector('input[name="Descripción"]') as HTMLInputElement)!.value = tipo.descripcion;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await eliminarTipoVehiculo(id);
      setMensaje('Tipo de vehículo eliminado con éxito!');
      cargarTiposVehiculo();
    } catch (error) {
      console.error(error);
      setMensaje('Error al eliminar el tipo de vehículo.');
    }
    setTimeout(() => setMensaje(''), 2000);
  };

  const handleCancelEdit = () => {
    setEditingTipo(null);
    setMostrarFormulario(false);
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  return (
    <div>
      {!mostrarFormulario && !editingTipo && (
        <button style={estiloBoton} onClick={() => setMostrarFormulario(true)}>
          Crear nuevo tipo de vehículo
        </button>
      )}

      {(mostrarFormulario || editingTipo) && (
        <>
          <FormularioDinamico
            titulo={editingTipo ? 'Editar Tipo de Vehículo' : 'Registrar nuevo Tipo de Vehículo'}
            campos={camposTipoVehiculo}
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
        <h2>Tipos de Vehículo Registrados</h2>
        {tiposVehiculoList.length === 0 ? (
          <p>No hay tipos de vehículo registrados.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Capacidad Peso (KG)</th>
                <th>Capacidad Volumen (m³)</th>
                <th>Descripción</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {tiposVehiculoList.map(tipo => (
                <tr key={tipo.id}>
                  <td>{tipo.nombre}</td>
                  <td>{tipo.capacidadPesoKG}</td>
                  <td>{tipo.capacidadVolumenM3}</td>
                  <td>{tipo.descripcion}</td>
                  <td>
                    <button className="edit-button" onClick={() => handleEdit(tipo)}>Editar</button>
                    <button className="delete-button" onClick={() => handleDelete(tipo.id.toString())}>Eliminar</button>
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