// Formularios.tsx
import React, { useState } from 'react';
import FormularioDinamico, { Campo } from './FormularioDinamico';
import { estiloBoton } from '../Botones';

let items: Array<string> = ['a', 'b', 'c', 'd'];
let transportistas: Array<string> = ['uno', 'dos'];
let vehiculos: Array<string> = ['auto', 'camion'];
let zonas: Array<string> = ['Hurlingham', 'Ituzaingo'];
let cargas: Array<string> = ['algodon', 'madera'];

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

const camposTarifa: Campo[] = [
  { tipo: 'select', nombre: 'Transportista', opciones: transportistas },
  { tipo: 'select', nombre: 'Tipo de vehiculo', opciones: vehiculos },
  { tipo: 'select', nombre: 'Zona', opciones: zonas },
  { tipo: 'select', nombre: 'Tipo de carga', opciones: cargas },
  { tipo: 'chip', opciones: items },
  { tipo: 'resultado', nombre: 'COSTO BASE :' },
  { tipo: 'resultado', nombre: 'ADICIONALES :' },
  { tipo: 'resultado', nombre: 'COSTO TOTAL :' },
];

const camposTransportista: Campo[] = [
  { tipo: 'input', nombre: 'Nombre', clase: 'text' },
  { tipo: 'input', nombre: 'Empresa', clase: 'text' },
  { tipo: 'input', nombre: 'Correo electrónico', clase: 'email' },
  { tipo: 'input', nombre: 'Teléfono de contacto', clase: 'tel' },
];

export const FormCrearTarifa: React.FC = () => (
  <FormularioDinamico
    titulo="Gestionar Tarifa para nuevo viaje"
    campos={camposTarifa}
    redireccion="/"
  />
);

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
    setMostrarFormulario(false); // ocultar formulario tras enviar
  };

  const handleEdit = (transportista: Transportista) => {
    setEditingTransportista(transportista);
    setMostrarFormulario(true); // mostrar formulario al editar
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
    setMostrarFormulario(false); // ocultar formulario si se cancela
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