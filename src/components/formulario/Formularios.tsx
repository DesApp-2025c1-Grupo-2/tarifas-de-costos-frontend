import React from 'react';
import FormularioDinamico, { Campo } from './FormularioDinamico';

let items: Array<string> = ['a', 'b', 'c', 'd'];
let transportistas: Array<string> = ['uno', 'dos'];
let vehiculos: Array<string> = ['auto', 'camion'];
let zonas: Array<string> = ['Hurlingham', 'Ituzaingo'];
let cargas: Array<string> = ['algodon', 'madera'];


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

export const FormCrearTransportista: React.FC = () => (
    <FormularioDinamico
      titulo="Registrar nuevo transportista"
      campos={camposTransportista}
      redireccion="/"
    />
);

