
import '../CrearTarifa.css';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { BotonGuardar } from './Botones';

let items: Array<string> = ['a', 'b', 'c', 'd'];
let transportistas: Array<string> = ['uno', 'dos'];
let vehiculos: Array<string> = ['auto', 'camion'];
let zonas: Array<string> = ['Hurlingham', 'Ituzaingo'];
let cargas: Array<string> = ['algodon', 'madera'];

const FormularioNuevaTarifa: React.FC = () => {
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (event: React.FormEvent) => {
     event.preventDefault();
     console.log('Formulario guardado (simulado)');
     setMostrarMensaje(true);
     setTimeout(() => {
       navigate('/'); 
     }, 1400);
   };
  
  return (
    <div className="crear-tarifa" onSubmit={handleSubmit}>
        <h2>Gestionar Tarifa para nuevo viaje</h2>
         <form className="formulario-tarifa"> 
            <TextField nombre='Transportista' opciones={transportistas}/>
            <div className="double-input">
                <TextField nombre='Tipo de vehiculo' opciones={vehiculos}/>
                <TextField nombre='Zona' opciones={zonas}/>
            </div>
            <TextField nombre='Tipo de carga' opciones={cargas}/>
            <ChipBlock opciones={items} />
            <Resultado nombre='COSTO BASE :'/>
            <Resultado nombre='ADICIONALES :'/>
            <Resultado nombre='COSTO TOTAL :'/>
            <BotonGuardar />
        </form>

        {mostrarMensaje && (
        <div className="mensaje-exito">
          Su registro se ha guardado con éxito!
        </div> 
        )}
    </div>
  );
};

/////////////// SELECTORES NORMALES ///////////////

type Props = {
    nombre: string;
    opciones: Array<string>;
};
  
const TextField: React.FC<Props> = ({ nombre, opciones }) => {
    const name = nombre;
  
    return (
      <div className='text-field'>
        <label htmlFor={name} style={{paddingBottom: '8px'}}>{name}</label>
        <select id={name} className='select-field'>
            <option value='default' selected>-</option>
            {opciones.map((e) => 
                <option value={e}>{e}</option>
            )}
        </select>
      </div>
    );
};

/////////////// ADICIONALES ///////////////

type Options = {
    opciones: Array<string>;
};

const ChipBlock: React.FC<Options> = ({ opciones }) => {
    const op = opciones;

    return (
        <div>
            <label>Requisitos especiales</label>
            {opciones.map((e, index) => 
                <Chip id={e} nombre={e} key={index}/>
            )}
        </div>
    )
};

type ChipOp = {
    id: string;
    nombre: string;
};

const Chip: React.FC<ChipOp> = ({ id, nombre }) => {

    return (
        <div style={{marginTop: '10px'}}>
            <input type='checkbox' id={String(id)} name={nombre} value={nombre}/>
            <label htmlFor={nombre}>{nombre}</label>
        </div>
    )
}

/////////////// VALOR FINAL ///////////////

type Res = {
    nombre: string;
};

const Resultado: React.FC<Res> = ({ nombre }) => {
    return (
        <div className='result'>
            <p>{nombre}</p>
            <p>$$$</p>
        </div>
    )
}

export default FormularioNuevaTarifa;