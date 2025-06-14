import React, { useState } from 'react';
import FormularioDinamico, { Campo } from './FormularioDinamico';
import { BotonPrimario, BotonEditar, BotonEliminar } from '../Botones';

type Zona = {
    id: string;
    nombre: string;
    descripcion: string;
    region: string;
};

const initialZona: Zona[] = [
    { id: '1', nombre: 'deadsa', descripcion: 'zona 1', region: 'AMBA' },
    { id: '2', nombre: 'ggdrg', descripcion: 'zona 2', region: 'CABA' },
];

const camposZona: Campo[] = [
    { tipo: 'input', nombre: 'Nombre', clase: 'text' },
    { tipo: 'input', nombre: 'Descripcion', clase: 'textarea' },
    { tipo: 'input', nombre: 'Region', clase: 'text' }
];

export const FormCrearZona: React.FC = () => {
    const [zonasList, setZonasList] = useState<Zona[]>(initialZona);
    const [mensaje, setMensaje] = useState('');
    const [editingZona, setEditingZona] = useState<Zona | null>(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const formRef = React.useRef<HTMLFormElement>(null) as React.RefObject<HTMLFormElement>;
  
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const zonaData: Zona = {
        id: editingZona ? editingZona.id : Date.now().toString(),
        nombre: formData.get('Nombre') as string,
        descripcion: formData.get('Descripcion') as string,
        region: formData.get('Region') as string,
      };
  
      if (editingZona) {
        setZonasList(
          zonasList.map(z => (z.id === editingZona.id ? zonaData : z))
        );
        setMensaje('Zona actualizada con éxito!');
        setEditingZona(null);
      } else {
        setZonasList([...zonasList, zonaData]);
        setMensaje('Zona registrada con éxito!');
      }
  
      setTimeout(() => setMensaje(''), 2000);
      event.currentTarget.reset();
      setMostrarFormulario(false);
    };
  
    const handleEdit = (zona: Zona) => {
      setEditingZona(zona);
      setMostrarFormulario(true);
      if (formRef.current) {
        (formRef.current.querySelector('input[name="Nombre"]') as HTMLInputElement)!.value = zona.nombre;
        (formRef.current.querySelector('input[name="Descripcion"]') as HTMLInputElement)!.value = zona.descripcion;
        (formRef.current.querySelector('input[name="Region"]') as HTMLInputElement)!.value = zona.region;
      }
    };
  
    const handleDelete = (id: string) => {
      setZonasList(zonasList.filter(z => z.id !== id));
      setMensaje('Zona eliminada con éxito!');
      setEditingZona(null);
      setTimeout(() => setMensaje(''), 2000);
    };
  
    const handleCancelEdit = () => {
      setEditingZona(null);
      if (formRef.current) {
        formRef.current.reset();
      }
      setMostrarFormulario(false);
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
              redireccion="/"
              onSubmit={handleSubmit}
              formRef={formRef}
            />
            <BotonPrimario onClick={handleCancelEdit} >Cancelar</BotonPrimario>
          </>
        )}
  
        {mensaje && <div className="mensaje-exito">{mensaje}</div>}
  
        <div className="transportista-list">
          <h2>Zonas Registradas</h2>
          {zonasList.length === 0 ? (
            <p>No hay zonas registradas.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Región</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {zonasList.map(zona => (
                  <tr key={zona.id}>
                    <td>{zona.nombre}</td>
                    <td>{zona.descripcion}</td>
                    <td>{zona.region}</td>
                    <td>
                      <button className="edit-button" onClick={() => handleEdit(zona)}>
                        Editar
                      </button>
                      <button className="delete-button" onClick={() => handleDelete(zona.id)}>
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