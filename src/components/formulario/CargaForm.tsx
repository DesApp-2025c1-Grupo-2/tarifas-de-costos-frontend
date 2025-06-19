import React, { useState, useEffect, useRef } from 'react';
import FormularioDinamico, { Campo } from './FormularioDinamico';
import { BotonPrimario, BotonEditar, BotonEliminar } from '../Botones';
import {
  obtenerCargas,
  crearCarga,
  actualizarCarga,
  eliminarCarga,
  Carga,
} from '../../services/cargaService';
import DataTable from '../tablas/tablaDinamica';

const camposCarga: Campo[] = [
  { tipo: 'text', nombre: 'Nombre', clave: "nombre" },
  { tipo: 'text', nombre: 'Descripción', clave: "descripcion" }
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

  const handleSubmit = async (valores: Record<string, string>) => {
    const nuevaCarga = {
      nombre: valores['nombre'],
      descripcion: valores['descripcion']
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

  const handleDelete = async (id: number) => {
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
        <BotonPrimario onClick={() => setMostrarFormulario(true)} >Crear nuevo Tipo de Carga</BotonPrimario>
      )}

      {(mostrarFormulario || editingCarga) && (
        <>
          <FormularioDinamico
            titulo={editingCarga ? 'Editar Tipo de Carga' : 'Registrar nuevo Tipo de Carga'}
            campos={camposCarga}
            onSubmit={handleSubmit}
            modal
            open={mostrarFormulario}
            onClose={handleCancelEdit}
          />
          <BotonPrimario onClick={handleCancelEdit} >Cancelar</BotonPrimario>
        </>
      )}

      {mensaje && <div className="mensaje-exito">{mensaje}</div>}

      <DataTable entidad="tipoDeCarga" rows={cargasList} handleEdit={handleEdit} handleDelete={handleDelete}></DataTable>
    </div>
  );
};