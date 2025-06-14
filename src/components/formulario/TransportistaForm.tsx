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
            redireccion="/"
            onSubmit={handleSubmit}
            formRef={formRef}
          />
          <BotonPrimario onClick={handleCancelEdit} >Cancelar</BotonPrimario>
        </>
      )}

      {mensaje && <div className="mensaje-exito">{mensaje}</div>}

      <DataTable entidad="transportista" rows={transportistasList} handleEdit={handleEdit} handleDelete={handleDelete}></DataTable>
    </div>
  );
}