import React, { useState, useEffect, useRef } from 'react';
import FormularioDinamico, { Campo } from './FormularioDinamico';
import { estiloBoton } from '../Botones';
import {
  obtenerTarifas,
  crearTarifa,
  actualizarTarifa,
  eliminarTarifa,
  Tarifa,
} from '../../services/tarifaService';

const items: string[] = ['a', 'b', 'c', 'd'];
const transportistas: string[] = ['uno', 'dos'];
const vehiculos: string[] = ['auto', 'camion'];
const zonas: string[] = ['Hurlingham', 'Ituzaingo'];
const cargas: string[] = ['algodon', 'madera'];

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

export const FormCrearTarifa: React.FC = () => {
  const [tarifas, setTarifas] = useState<Tarifa[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [editando, setEditando] = useState<Tarifa | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    cargarTarifas();
  }, []);

  const cargarTarifas = async () => {
    try {
      const data = await obtenerTarifas();
      setTarifas(data);
    } catch (error) {
      console.error('Error al cargar tarifas:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const nuevaTarifa = {
      transportista: formData.get('Transportista') as string,
      vehiculo: formData.get('Tipo de vehiculo') as string,
      zona: formData.get('Zona') as string,
      carga: formData.get('Tipo de carga') as string,
      items: formData.getAll('chip') as string[],
      costoBase: 100,
      adicionales: 20,
      total: 120,
    };

    try {
      if (editando) {
        await actualizarTarifa(editando.id, nuevaTarifa);
        setMensaje('Tarifa actualizada con éxito');
      } else {
        await crearTarifa(nuevaTarifa);
        setMensaje('Tarifa creada con éxito');
      }

      setEditando(null);
      setMostrarFormulario(false);
      if (formRef.current) formRef.current.reset();
      cargarTarifas();
    } catch (err) {
      console.error(err);
      setMensaje('Error al guardar la tarifa');
    }

    setTimeout(() => setMensaje(''), 2000);
  };

  const handleEdit = (tarifa: Tarifa) => {
    setEditando(tarifa);
    setMostrarFormulario(true);
    // Opcional: puedes rellenar el formRef manualmente si FormularioDinamico no lo hace
  };

  const handleDelete = async (id: number) => {
    try {
      await eliminarTarifa(id);
      setMensaje('Tarifa eliminada con éxito');
      cargarTarifas();
    } catch (err) {
      console.error(err);
      setMensaje('Error al eliminar la tarifa');
    }
    setTimeout(() => setMensaje(''), 2000);
  };

  const handleCancel = () => {
    setEditando(null);
    setMostrarFormulario(false);
    if (formRef.current) formRef.current.reset();
  };

  return (
    <div>
      {!mostrarFormulario && !editando && (
        <button style={estiloBoton} onClick={() => setMostrarFormulario(true)}>
          Crear nueva tarifa
        </button>
      )}

      {(mostrarFormulario || editando) && (
        <>
          <FormularioDinamico
            titulo={editando ? 'Editar Tarifa' : 'Registrar nueva Tarifa'}
            campos={camposTarifa}
            redireccion="/"
            onSubmit={handleSubmit}
            formRef={formRef}
          />
          <button style={estiloBoton} onClick={handleCancel}>Cancelar</button>
        </>
      )}

      {mensaje && <div className="mensaje-exito">{mensaje}</div>}
      <div className="transportista-list">
        <h2>Tarifas Registradas</h2>
        {tarifas.length === 0 ? (
          <p>No hay tarifas registradas.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Transportista</th>
                <th>Vehículo</th>
                <th>Zona</th>
                <th>Carga</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tarifas.map((t) => (
                <tr key={t.id}>
                  <td>{t.transportista}</td>
                  <td>{t.vehiculo}</td>
                  <td>{t.zona}</td>
                  <td>{t.carga}</td>
                  <td>{t.total}</td>
                  <td>
                    <button onClick={() => handleEdit(t)}>Editar</button>
                    <button onClick={() => handleDelete(t.id)}>Eliminar</button>
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