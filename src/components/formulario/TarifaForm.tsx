import React, { useState, useEffect, useRef } from 'react';
import FormularioDinamico, { Campo } from './FormularioDinamico';
import { BotonPrimario, BotonEditar, BotonEliminar } from '../Botones';
import {
  obtenerTarifas,
  crearTarifa,
  actualizarTarifa,
  eliminarTarifa,
  Tarifa,
} from '../../services/tarifaService';
import TablaDinamica from '../tablas/tablaDinamica';
import { obtenerTransportistas, Transportista } from '../../services/transportistaService';
import { obtenerTiposVehiculo, TipoVehiculo } from '../../services/tipoVehiculoService';
import { obtenerCargas, Carga } from '../../services/cargaService';

const items: string[] = ['a', 'b', 'c', 'd'];
const transportistas: string[] = ['uno', 'dos'];
const vehiculos: string[] = ['auto', 'camion'];
const zonas: string[] = ['Hurlingham', 'Ituzaingo'];
const cargas: string[] = ['algodon', 'madera'];

// const camposTarifa: Campo[] = [
//   { tipo: 'select', nombre: 'Transportista', opciones: transportistas },
//   { tipo: 'select', nombre: 'Tipo de vehiculo', opciones: vehiculos },
//   { tipo: 'select', nombre: 'Zona', opciones: zonas },
//   { tipo: 'select', nombre: 'Tipo de carga', opciones: cargas },
//   { tipo: 'chip', opciones: items },
//   { tipo: 'resultado', nombre: 'COSTO BASE :' },
//   { tipo: 'resultado', nombre: 'ADICIONALES :' },
//   { tipo: 'resultado', nombre: 'COSTO TOTAL :' },
// ];

export const FormCrearTarifa: React.FC = () => {
  const [tarifas, setTarifas] = useState<Tarifa[]>([]);
  const [transportistas, setTransportistas] = useState<Transportista[]>([]);
  const [tipoVehiculos, setTipoVehiculos] = useState<TipoVehiculo[]>([]);
  const [cargas, setCarga] = useState<Carga[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [editando, setEditando] = useState<Tarifa | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    cargarTarifas();
    cargarTransportistas();
    cargarTipoVehiculo();
    cargarCarga();
  }, []);

  const cargarTarifas = async () => {
    try {
      const data = await obtenerTarifas();
      setTarifas(data);
    } catch (error) {
      console.error('Error al cargar tarifas:', error);
    }
  };

  const cargarTransportistas = async () => {
    try {
      const data = await obtenerTransportistas();
      setTransportistas(data);
    } catch (error) {
      console.error('Error al cargar transportistas:', error);
    }
  };

  const cargarTipoVehiculo = async () => {
    try {
      const data = await obtenerTiposVehiculo();
      setTipoVehiculos(data);
    } catch (error) {
      console.error('Error al cargar tipo de vehiculo:', error);
    }
  };

  const cargarCarga = async () => {
    try {
      const data = await obtenerCargas();
      setCarga(data);
    } catch (error) {
      console.error('Error al cargar las cargas:', error);
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

  const camposTarifa: Campo[] = [
    {
      tipo: 'select',
      nombre: 'Transportista',
      opciones: transportistas.map(t => t.nombreEmpresa),
    },
    // Aquí irían vehiculos, zonas y cargas igual, usando su estado
    {
      tipo: 'select',
      nombre: 'Tipo de vehiculo',
      opciones: tipoVehiculos.map(t => t.nombre),
    },
    { tipo: 'select', nombre: 'Zona', opciones: ['Hurlingham', 'Ituzaingo'] },
    {
      tipo: 'select',
      nombre: 'Tipo de carga',
      opciones: cargas.map(t => t.nombre),
    },
    { tipo: 'chip', opciones: items },
    { tipo: 'costoBase' },
    { tipo: 'resultado', nombre: 'ADICIONALES :' },
    { tipo: 'resultado', nombre: 'COSTO TOTAL :' },
  ];

  return (
    <div>
      {!mostrarFormulario && !editando && (
                <BotonPrimario onClick={() => setMostrarFormulario(true)} >Crear nueva tarifa</BotonPrimario>

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
          <BotonPrimario onClick={handleCancel} >Cancelar</BotonPrimario>
        </>
      )}

      {mensaje && <div className="mensaje-exito">{mensaje}</div>}
      <TablaDinamica
        titulo="Tarifas Registradas"
        columnas={["Transportista", "Vehículo", "Zona", "Carga", "Total", "Acciones"]}
        datos={tarifas}
        mensaje={mensaje}
        condicionVacio="No hay tarifas registradas."
        renderFila={(t) => (
          <tr key={t.id}>
            <td>{t.transportista}</td>
            <td>{t.vehiculo}</td>
            <td>{t.zona}</td>
            <td>{t.carga}</td>
            <td>{t.total}</td>
            <td>
              <BotonEditar onClick={() => handleEdit(t)} children={undefined}></BotonEditar>
              <BotonEliminar onClick={() => handleDelete(t.id)} children={undefined}></BotonEliminar>
            </td>
          </tr>
        )}
      />
    </div>
  );
};