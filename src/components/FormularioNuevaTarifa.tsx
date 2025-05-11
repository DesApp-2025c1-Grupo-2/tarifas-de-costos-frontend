import React from 'react';
import '../CrearTarifa.css';
import Boton from './BotonNuevaTarifa';

let items: Array<string> = ['a', 'b', 'c', 'd'];

const FormularioNuevaTarifa: React.FC = () => (
    <div className="crear-tarifa">
        <h2>Gestionar Tarifa para nuevo viaje</h2>
        <form className="formulario-tarifa">
            <TextField nombre='Transportista' opciones={items}/>
            <div className="double-input">
                <TextField nombre='Tipo de vehiculo' opciones={items}/>
                <TextField nombre='Zona' opciones={items}/>
            </div>
            <TextField nombre='Tipo de carga' opciones={items}/>
            <ChipBlock opciones={items} />
            <Resultado nombre='COSTO BASE :'/>
            <Resultado nombre='ADICIONALES :'/>
            <Resultado nombre='COSTO TOTAL :'/>
            <Boton direccion="../" texto='Guardar'/>
        </form>
    </div>
);

/////////////// SELECTORES NORMALES ///////////////

type Props = {
    nombre: string;
    opciones: Array<string>;
};
  
const TextField: React.FC<Props> = ({ nombre }) => {
    const name = nombre;
  
    return (
      <div className='text-field'>
        <label htmlFor={name} style={{paddingBottom: '8px'}}>{name}</label>
        <select id={name}></select>
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