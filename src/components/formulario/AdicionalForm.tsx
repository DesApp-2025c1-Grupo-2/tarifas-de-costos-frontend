
import React, { useState, useEffect, useRef } from 'react';
import FormularioDinamico, { Campo } from './FormularioDinamico';
import { BotonPrimario, BotonEditar, BotonEliminar } from '../Botones';
import {
  obtenerAdicionales,
  crearAdicional,
  actualizarAdicional,
  eliminarAdicional,
  Adicional
} from '../../services/adicionalService';

import DataTable from '../tablas/tablaDinamica'; 

export const AdicionalForm: React.FC = () => {
  const [adicionales, setAdicionales] = useState<Adicional[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [editando, setEditando] = useState<Adicional | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    cargarAdicionales();
  }, []);

  const cargarAdicionales = async () => {
    try {
      const data = await obtenerAdicionales();
      setAdicionales(data);
    } catch (error) {
      console.error('Error al cargar adicionales:', error);
      setMensaje('Error al cargar los adicionales. Inténtalo de nuevo más tarde.');
    }
  };

  const handleSubmit = async (valores: Record<string, any>) => {
    if (!valores.nombreAdicional || valores.nombreAdicional.trim() === '' ||
        !valores.costoAdicional || isNaN(Number(valores.costoAdicional)) ||
        !valores.descripcionAdicional || valores.descripcionAdicional.trim() === '') {
      setMensaje('Por favor, completa todos los campos (Nombre, Costo y Descripción).');
      setTimeout(() => setMensaje(''), 2000);
      return;
    }

    const nuevoAdicional: Omit<Adicional, 'id'> = {
      nombre: valores.nombreAdicional,
      costoDefault: Number(valores.costoAdicional),
      descripcion: valores.descripcionAdicional,
    };

    try {
      if (editando) {
        await actualizarAdicional(String(editando.id), nuevoAdicional);
        setMensaje('Adicional actualizado con éxito.');
      } else {
        await crearAdicional(nuevoAdicional);
        setMensaje('Adicional creado con éxito.');
      }

      setEditando(null);
      setMostrarFormulario(false);
      if (formRef.current) formRef.current.reset();
      cargarAdicionales();
    } catch (err) {
      console.error('Error al guardar el adicional:', err);
      setMensaje(`Error al guardar el adicional: ${(err as Error).message || 'Hubo un problema.'}`);
    }

    setTimeout(() => setMensaje(''), 3000);
  };

  const handleEdit = (adicional: Adicional) => {
    setEditando(adicional);
    setMostrarFormulario(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await eliminarAdicional(String(id));
      setMensaje('Adicional eliminado con éxito.');
      cargarAdicionales();
    } catch (err) {
      console.error('Error al eliminar el adicional:', err);
      setMensaje(`Error al eliminar el adicional: ${(err as Error).message || 'Hubo un problema.'}`);
    }
    setTimeout(() => setMensaje(''), 3000);
  };

   const handleCancel = () => {
    setEditando(null);
    setMostrarFormulario(false);
    if (formRef.current) formRef.current.reset();
  };

  const camposAdicional: Campo[] = [
    { tipo: 'text', nombre: 'Nombre del Adicional', clave: 'nombreAdicional' },
    { tipo: 'costoBase', nombre: 'Costo del Adicional', clave: 'costoAdicional' },
    { tipo: 'text', nombre: 'Descripción', clave: 'descripcionAdicional' },
  ];

  return (
    <div>
      {!mostrarFormulario && !editando && (
        <BotonPrimario onClick={() => setMostrarFormulario(true)}>Crear nuevo adicional</BotonPrimario>
      )}

      {(mostrarFormulario || editando) && (
        <>
          <FormularioDinamico
            titulo={editando ? 'Editar Adicional' : 'Registrar Nuevo Adicional'}
            campos={camposAdicional}
            onSubmit={handleSubmit}
            modal={true}
            open={mostrarFormulario || !!editando}
            onClose={handleCancel}
            formRef={formRef}
          />
        </>
      )}

      {mensaje && <div className="mensaje-exito">{mensaje}</div>}

      
      <DataTable
        entidad="adicional"
        rows={adicionales}
        handleEdit={handleEdit} 
        handleDelete={handleDelete} 
      />
    </div>
  );
};