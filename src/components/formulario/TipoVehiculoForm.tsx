import React, { useState, useEffect, useRef } from 'react';
import FormularioDinamico, { Campo } from './FormularioDinamico';
import { BotonPrimario, BotonEditar, BotonEliminar } from '../Botones';
import {
  obtenerTiposVehiculo,
  crearTipoVehiculo,
  actualizarTipoVehiculo,
  eliminarTipoVehiculo,
  TipoVehiculo,
} from '../../services/tipoVehiculoService';
import TablaDinamica from '../tablas/tablaDinamica';
import DataTable from '../tablas/tablaDinamica';

const camposTipoVehiculo: Campo[] = [
  { tipo: 'text', nombre: 'Nombre', clave: "nombre" },
  { tipo: 'text', nombre: 'Capacidad de peso (KG)', clave: "peso" },
  { tipo: 'text', nombre: 'Capacidad de volumen (m³)', clave: "volumen" },
  { tipo: 'text', nombre: 'Descripción', clave: "descripcion" }
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

    const handleSubmit = async (valores: Record<string, string>) => {
      const nuevoTipo = {
        nombre: valores['nombre'],
        capacidadPesoKG: parseFloat(valores['peso']),
        capacidadVolumenM3: parseFloat(valores['volumen']),
        descripcion: valores['descripcion']
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
        <BotonPrimario onClick={() => setMostrarFormulario(true)} >Crear nuevo tipo de vehiculo</BotonPrimario>
      )}

      {(mostrarFormulario || editingTipo) && (
        <>
          <FormularioDinamico
            titulo={editingTipo ? 'Editar Tipo de Vehículo' : 'Registrar nuevo Tipo de Vehículo'}
            campos={camposTipoVehiculo}
            onSubmit={handleSubmit}
            modal
            open={mostrarFormulario}
            onClose={handleCancelEdit}
          />
          <BotonPrimario onClick={handleCancelEdit} >Cancelar</BotonPrimario>
        </>
      )}

      {mensaje && <div className="mensaje-exito">{mensaje}</div>}

      <DataTable entidad="tipoDeVehiculo" rows={tiposVehiculoList} handleEdit={handleEdit} handleDelete={handleDelete}></DataTable>
    </div>
  );
};