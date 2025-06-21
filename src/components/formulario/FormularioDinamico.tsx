import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BasicTextFields,
  BasicAutocomplete,
  Resultado,
  NumberField
} from './Campos';
import { BotonGuardar } from '../Botones';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export type Campo = {
  tipo: 'text' | 'input' | 'email' | 'tel' | 'select' | 'resultado' | 'costoBase';
  nombre: string;
  clave: string;
  opciones?: { id: number | string; nombre: string }[]; // solo para selects
};

type Props = {
  titulo: string;
  campos: Campo[];
  redireccion?: string;
  onSubmit?: (valores: Record<string, any>) => void;
  formRef?: React.RefObject<HTMLFormElement | null>;

  // props opcionales para el modo modal
  modal?: boolean;
  open?: boolean;
  onClose?: () => void;
};

const FormularioDinamico: React.FC<Props> = ({
  titulo,
  campos,
  redireccion,
  onSubmit,
  formRef,
  modal = false,
  open = false,
  onClose
}) => {
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [valores, setValores] = useState<Record<string, any>>({});
  const navigate = useNavigate();

  const handleChange = (clave: string, valor: any) => {
    setValores((prev) => ({ ...prev, [clave]: valor }));
  };

  const handleInternalSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(valores);
    setMostrarMensaje(true);

    if (!modal && redireccion) {
      setTimeout(() => {
        navigate(redireccion);
      }, 1500);
    }

    if (modal && onClose) {
      onClose(); // cerrar modal tras submit si aplica
    }
  };

  const contenidoFormulario = (
    <form className="formulario-tarifa" onSubmit={handleInternalSubmit} ref={formRef}>
      {campos.map((campo) => {
        switch (campo.tipo) {
          case 'text':
            return (
              <BasicTextFields
                key={campo.clave}
                label={campo.nombre}
                value={valores[campo.clave] || ''}
                onChange={(val: string) => handleChange(campo.clave, val)}
              />
            );

          case 'select':
            return (
              <BasicAutocomplete
                key={campo.clave}
                label={campo.nombre}
                opciones={campo.opciones || []}
                value={valores[campo.clave] || ''}
                onChange={(val: string) => handleChange(campo.clave, val)}
              />
            );

          case 'resultado':
            return (
              <Resultado
                key={campo.clave}
                nombre={campo.nombre}
                value={valores[campo.clave] || ''}
              />
            );

          case 'costoBase':
            return (
              <NumberField
                key={campo.clave}
                label="COSTO BASE"
                value={valores[campo.clave] || ''}
                onChange={(val) => setValores(prev => ({ ...prev, [campo.clave]: val }))}
              />
            );

          default:
            return null;
        }
      })}

      <BotonGuardar />
    </form>
  );

  if (modal) {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {titulo}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {contenidoFormulario}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="crear-tarifa">
      <h2>{titulo}</h2>
      {contenidoFormulario}

      {mostrarMensaje && (
        <div className="mensaje-exito">¡Guardado con éxito!</div>
      )}
    </div>
  );
};

export default FormularioDinamico;