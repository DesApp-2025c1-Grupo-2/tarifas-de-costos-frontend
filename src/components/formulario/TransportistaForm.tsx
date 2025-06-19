import React, { useState, useEffect, useRef } from 'react';
import FormularioDinamico, { Campo } from './FormularioDinamico';
import { BotonPrimario, BotonEditar, BotonEliminar } from '../Botones';
import {
  obtenerTransportistas,
  crearTransportista,
  actualizarTransportista,
  eliminarTransportista,
  Transportista,
} from '../../services/transportistaService';
import DataTable from '../tablas/tablaDinamica';

const camposTransportista: Campo[] = [
  { tipo: 'text', nombre: 'Nombre', clave: "nombre" },
  { tipo: 'text', nombre: 'Empresa', clave: "empresa" },
  { tipo: 'text', nombre: 'Correo', clave: "correo" },
  { tipo: 'text', nombre: 'Telefono', clave: "telefono" }
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

  const handleSubmit = async (valores: Record<string, string>) => {
    const nuevoTransportista = {
      contactoNombre: valores['nombre'],
      nombreEmpresa: valores['empresa'],
      contactoEmail: valores['correo'],
      contactoTelefono: valores['telefono']
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
      (formRef.current.querySelector('input[name="Nombre"]') as HTMLInputElement)!.value = transportista.contactoNombre;
      (formRef.current.querySelector('input[name="Empresa"]') as HTMLInputElement)!.value = transportista.nombreEmpresa;
      (formRef.current.querySelector('input[name="Correo electrónico"]') as HTMLInputElement)!.value = transportista.contactoEmail;
      (formRef.current.querySelector('input[name="Teléfono de contacto"]') as HTMLInputElement)!.value = transportista.contactoTelefono;
    }
  };

  const handleDelete = async (id: number) => {
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
        // <Button variant="contained" onClick={() => setMostrarFormulario(true)}>
        //   Crear nuevo transportista
        // </Button>
        <BotonPrimario onClick={() => setMostrarFormulario(true)} >Crear nuevo transportista</BotonPrimario>
      )}

      {(mostrarFormulario || editingTransportista) && (
        <>
          <FormularioDinamico
            titulo={editingTransportista ? 'Editar Transportista' : 'Registrar nuevo transportista'}
            campos={camposTransportista}
            onSubmit={handleSubmit}
            modal
            open={mostrarFormulario}
            onClose={handleCancelEdit}
          />
          <BotonPrimario onClick={handleCancelEdit} >Cancelar</BotonPrimario>
        </>
      )}

      {mensaje && <div className="mensaje-exito">{mensaje}</div>}

      <DataTable entidad="transportista" rows={transportistasList} handleEdit={handleEdit} handleDelete={handleDelete}></DataTable>
    </div>
  );
}