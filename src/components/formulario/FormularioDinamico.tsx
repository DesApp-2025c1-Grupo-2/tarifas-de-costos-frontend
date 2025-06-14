import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectField, ChipBlock, CostoBase, Resultado, TextInput } from './Campos';
import { BotonGuardar } from '../Botones';

export type Campo =
  | { tipo: 'select'; nombre: string; opciones: string[] }
  | { tipo: 'input'; nombre: string; clase: string }
  | { tipo: 'chip'; opciones: string[] }
  | { tipo: 'costoBase'; }
  | { tipo: 'resultado'; nombre: string };

type Props = {
  titulo: string;
  campos: Campo[];
  redireccion: string;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  formRef?: React.RefObject<HTMLFormElement | null>;
};

const FormularioDinamico: React.FC<Props> = ({ titulo, campos, redireccion, onSubmit, formRef }) => {
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit(event);
    } else {
      console.log('Formulario guardado (simulado)');
      setMostrarMensaje(true);
      setTimeout(() => {
        navigate(redireccion);
      }, 1400);
    }
  };

  return (
    <div className="crear-tarifa">
      <h2>{titulo}</h2>
      <form className="formulario-tarifa" onSubmit={handleSubmit} ref={formRef}>
        {campos.map((campo, index) => {
          if (campo.tipo === 'select') {
            return <SelectField key={index} nombre={campo.nombre} opciones={campo.opciones} />;
          }
          if (campo.tipo === 'input') {
            return <TextInput key={index} nombre={campo.nombre} tipo={campo.clase} />;
          }
          if (campo.tipo === 'chip') {
            return <ChipBlock key={index} opciones={campo.opciones} />;
          }
          if (campo.tipo === 'costoBase') {
            return <CostoBase key={index} nombre={''} />;
          }
          if (campo.tipo === 'resultado') {
            return <Resultado key={index} nombre={campo.nombre} />;
          }
          return null;
        })}
        <BotonGuardar></BotonGuardar>
        
      </form>

      {mostrarMensaje && (
        <div className="mensaje-exito">Su registro se ha guardado con éxito!</div>
      )}
    </div>
  );
};

export default FormularioDinamico;