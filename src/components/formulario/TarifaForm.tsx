import React, { useState, useEffect, useRef } from 'react';
import FormularioDinamico, { Campo } from './FormularioDinamico';
import { BotonPrimario, BotonEditar, BotonEliminar } from '../Botones';
import {
  obtenerTarifas,
  crearTarifa,
  actualizarTarifa,
  eliminarTarifa,
  Tarifa
} from '../../services/tarifaService';
import { obtenerTransportistas, Transportista } from '../../services/transportistaService';
import { obtenerTiposVehiculo, TipoVehiculo } from '../../services/tipoVehiculoService';
import { obtenerZonas, ZonaViaje } from '../../services/zonaService';

import { obtenerCargas, Carga } from '../../services/cargaService';
import DataTable from '../tablas/tablaDinamica';
import { obtenerAdicionales, Adicional } from '../../services/adicionalService';


export const FormCrearTarifa: React.FC = () => {
  const [tarifas, setTarifas] = useState<Tarifa[]>([]);
  const [transportistas, setTransportistas] = useState<Transportista[]>([]);
  const [tipoVehiculos, setTipoVehiculos] = useState<TipoVehiculo[]>([]);
  const [zonas, setZonas] = useState<ZonaViaje[]>([]);
  const [cargas, setCarga] = useState<Carga[]>([]);
  const [adicionales, setAdicionales] = useState<Adicional[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [editando, setEditando] = useState<Tarifa | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    cargarTarifas();
    cargarTransportistas();
    cargarTipoVehiculo();
    cargarZona();
    cargarCarga();
    cargarAdicionales();
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
      const activos = data.filter((t: Transportista) => t.activo);
      setTransportistas(activos);
    } catch (error) {
      console.error('Error al cargar transportistas:', error);
    }
  };

  const cargarTipoVehiculo = async () => {
    try {
      const data = await obtenerTiposVehiculo();
      const activos = data.filter((t: TipoVehiculo) => t.activo);
      setTipoVehiculos(activos);
    } catch (error) {
      console.error('Error al cargar tipo de vehiculo:', error);
    }
  };

  const cargarZona = async () => {
    try {
      const data = await obtenerZonas();
      const activos = data.filter((z: ZonaViaje) => z.activo);
      setZonas(activos);
    } catch (error) {
      console.error('Error al cargar zonas:', error);
    }
  }

  const cargarCarga = async () => {
    try {
      const data = await obtenerCargas();
      const activos = data.filter((c: Carga) => c.activo);
      setCarga(activos);
    } catch (error) {
      console.error('Error al cargar las cargas:', error);
    }
  };
  
  const cargarAdicionales = async () => {
    try {
      const data = await obtenerAdicionales();
      const activos = data.filter((c: Adicional) => c.activo);
      setAdicionales(activos);
    } catch (error) {
      console.error('Error al cargar los adicionales:', error);
    }
  };

  const handleSubmit = async (valores: Record<string, any>) => {
    // Ejemplo de validación sencilla
    const getNumber = (key: string): number => {
      const value = valores[key];
      //console.log(`Valor de ${key}:`, value);

      if (value === undefined || isNaN(Number(value))) {
        throw new Error(`El campo ${key} es inválido o está vacío`);
      }
      return Number(value);
    };
  
    const adicionalesSeleccionados = (valores['adicionales'] || []).map((a: any) => ({
      adicional: { id: a.id },
      costoEspecifico: parseFloat(a.precio ?? '0'),
    }));

    const nuevaTarifa:  Omit<Tarifa, 'id'> = {
      transportista: { id: getNumber('transportistaId') },
      tipoVehiculo: { id: getNumber('vehiculoId') },
      zonaViaje: { id: getNumber('zona') },
      tipoCargaTarifa: { id: getNumber('cargaId') },
      valorBase: getNumber('costoBase'),
      total: getNumber('costoBase') + adicionalesSeleccionados.reduce((acc: any, a: { costoEspecifico: any; }) => acc + a.costoEspecifico, 0),
      adicionales: adicionalesSeleccionados,
    };
  
    try {
      if (editando) {
        await actualizarTarifa(editando.id, nuevaTarifa);
        setMensaje('Tarifa actualizada con éxito');
      } else {
        console.log('Payload que se envía:', nuevaTarifa);
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
      clave: 'transportistaId',
      opciones: transportistas.map(t => ({
        id: t.id,
        nombre: t.nombreEmpresa,
      })),
    },
    {
      tipo: 'select',
      nombre: 'Tipo de vehiculo',
      clave: 'vehiculoId',
      opciones: tipoVehiculos.map(t => ({
        id: t.id,
        nombre: t.nombre,
      })),
    },
    {
      tipo: 'select',
      nombre: 'Zona',
      clave: 'zona',
      opciones: zonas.map(t => ({
        id: t.id,
        nombre: t.nombre,
      })),
    },
    {
      tipo: 'select',
      nombre: 'Tipo de carga',
      clave: 'cargaId',
      opciones: cargas.map(t => ({
        id: t.id,
        nombre: t.nombre,
      })),
    },
    {
      tipo: 'adicionales',
      nombre: 'Adicionales',
      clave: 'adicionales',
      opciones: adicionales.map((a) => ({
        id: a.id,
        nombre: a.nombre,
        descripcion: a.descripcion,
        precio: a.costoDefault,
      })),
    },
    { tipo: 'costoBase', nombre: 'Costo Base', clave: 'costoBase' },
    { tipo: 'resultado', nombre: 'ADICIONALES :', clave: 'add' },
    { tipo: 'resultado', nombre: 'COSTO TOTAL :', clave: 'total' },
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
            onSubmit={handleSubmit}
            modal
            open={mostrarFormulario}
            onClose={handleCancel}
          />
          <BotonPrimario onClick={handleCancel} >Cancelar</BotonPrimario>
        </>
      )}

      {mensaje && <div className="mensaje-exito">{mensaje}</div>}
      <DataTable entidad="tarifa" rows={tarifas} handleEdit={handleEdit} handleDelete={handleDelete}></DataTable>
    </div>
  );
};