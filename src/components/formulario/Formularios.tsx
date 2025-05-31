// Formularios.tsx
import React, { useState } from 'react';
import FormularioDinamico, { Campo } from './FormularioDinamico';

let items: Array<string> = ['a', 'b', 'c', 'd'];
let transportistas: Array<string> = ['uno', 'dos'];
let vehiculos: Array<string> = ['auto', 'camion'];
let zonas: Array<string> = ['Hurlingham', 'Ituzaingo'];
let cargas: Array<string> = ['algodon', 'madera'];

// Define a type for transportista data
type Transportista = {
  id: string;
  nombre: string;
  empresa: string;
  correo: string;
  telefono: string;
};

// esto cuando conectemos la api se borra
const initialTransportistas: Transportista[] = [
  { id: '1', nombre: 'Juan Pérez',  empresa: 'Acme SRL', correo: 'juan@example.com', telefono: '1234567890' },
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newTransportista: Transportista = {
      id: Date.now().toString(), // Simple unique ID
      nombre: formData.get('Nombre') as string,
      empresa: formData.get('Empresa') as string,
      correo: formData.get('Correo electrónico') as string,
      telefono: formData.get('Teléfono de contacto') as string,
    };
    setTransportistasList([...transportistasList, newTransportista]);
    setMensaje('Transportista registrado con éxito!');
    setTimeout(() => setMensaje(''), 2000);
    event.currentTarget.reset();
  };

  const handleDelete = (id: string) => {
    setTransportistasList(transportistasList.filter(t => t.id !== id));
    setMensaje('Transportista eliminado con éxito!');
    setTimeout(() => setMensaje(''), 2000);
  };

  return (
    <div className="crear-tarifa">
      <FormularioDinamico
        titulo="Registrar nuevo transportista"
        campos={camposTransportista}
        redireccion="/"
        onSubmit={handleSubmit} // Pass custom submit handler
      />
      {mensaje && <div className="mensaje-exito">{mensaje}</div>}
      <div className="transportista-list" style={{ marginTop: '2em' }}>
        <h3>Transportistas Registrados</h3>
        {transportistasList.length === 0 ? (
          <p>No hay transportistas registrados.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1em' }}>
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
                    <button
                      style={{
                        padding: '0.5em 1em',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleDelete(transportista.id)}
                    >
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