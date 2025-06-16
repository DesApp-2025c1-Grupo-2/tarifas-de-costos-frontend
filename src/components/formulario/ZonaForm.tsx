import React, { useState, useEffect, useRef } from 'react';
import FormularioDinamico, { Campo } from './FormularioDinamico';
import { BotonPrimario, BotonEditar, BotonEliminar } from '../Botones';
import {
  obtenerZonas,
  crearZona,
  actualizarZona,
  eliminarZona,
  ZonaViaje,
} from '../../services/zonaService';
import DataTable from '../tablas/tablaDinamica';

const camposZona: Campo[] = [
  { tipo: 'text', nombre: 'Nombre', clave: "nombre" },
  { tipo: 'text', nombre: 'Descripcion', clave: "descripcion" },
  { tipo: 'text', nombre: 'Region', clave: "region" }
];

export const FormCrearZona: React.FC = () => {
  const [zonasList, setZonasList] = useState<ZonaViaje[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [editingZona, setEditingZona] = useState<ZonaViaje | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    cargarZonas();
  }, []);

  const cargarZonas = async () => {
    try {
      const data = await obtenerZonas();
      setZonasList(data);
    } catch (error) {
      console.error('Error al cargar zonas:', error);
    }
  };

  const handleSubmit = async (valores: Record<string, string>) => {
    const nuevaZona = {
      nombre: valores['nombre'],
      descripcion: valores['descripcion'],
      regionMapa: valores['region'],
    };
  
    try {
      if (editingZona) {
        await actualizarZona(editingZona.id, nuevaZona);
        setMensaje('Zona actualizada con éxito!');
      } else {
        await crearZona(nuevaZona);
        setMensaje('Zona creada con éxito!');
      }
  
      setEditingZona(null);
      setMostrarFormulario(false);
      if (formRef.current) formRef.current.reset();
      cargarZonas();
    } catch (error) {
      console.error(error);
      setMensaje('Hubo un error al guardar la zona.');
    }
  
    setTimeout(() => setMensaje(''), 2000);
  };

  const handleEdit = (zona: ZonaViaje) => {
    setEditingZona(zona);
    setMostrarFormulario(true);
    if (formRef.current) {
      (formRef.current.querySelector('input[name="nombre"]') as HTMLInputElement)!.value = zona.nombre;
      (formRef.current.querySelector('input[name="descripcion"]') as HTMLInputElement)!.value = zona.descripcion;
      (formRef.current.querySelector('input[name="region"]') as HTMLInputElement)!.value = zona.regionMapa;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await eliminarZona(id);
      setMensaje('Zona eliminada con éxito!');
      cargarZonas();
    } catch (error) {
      console.error(error);
      setMensaje('Error al eliminar la zona.');
    }
    setTimeout(() => setMensaje(''), 2000);
  };

  const handleCancelEdit = () => {
    setEditingZona(null);
    setMostrarFormulario(false);
    if (formRef.current) formRef.current.reset();
  };
  
    return (
      <div>
        {!mostrarFormulario && !editingZona && (
          <BotonPrimario onClick={() => setMostrarFormulario(true)} >Crear nueva zona</BotonPrimario>

        )}
  
        {(mostrarFormulario || editingZona) && (
          <>
            <FormularioDinamico
              titulo={editingZona ? "Editar Zona" : "Registrar nueva zona"}
              campos={camposZona}
              onSubmit={handleSubmit}
              modal
              open={mostrarFormulario}
              onClose={handleCancelEdit}
            />
            <BotonPrimario onClick={handleCancelEdit} >Cancelar</BotonPrimario>
          </>
        )}
  
        {mensaje && <div className="mensaje-exito">{mensaje}</div>}
  
        <DataTable 
          entidad="zona" 
          rows={zonasList} 
          handleEdit={handleEdit} 
          handleDelete={(id: string) => handleDelete(Number(id))}>
        </DataTable>
      </div>
    );
  };