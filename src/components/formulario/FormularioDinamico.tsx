import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BasicTextFields,
  BasicAutocomplete,
  Resultado,
  NumberField,
} from "./Campos";
import { BotonGuardar } from "../Botones";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AdicionalSelector } from "./adicionales/AdicionalSelector";
import {
  ModalCrearAdicional,
  NuevoAdicional,
} from "./adicionales/ModalCrearAdicional";

export type Campo = {
  tipo:
    | "text"
    | "input"
    | "email"
    | "tel"
    | "select"
    | "adicionales"
    | "resultado"
    | "costoBase";
  nombre: string;
  clave: string;
  opciones?: any[];
};

type Props = {
  titulo: string;
  campos: Campo[];
  onSubmit: (valores: Record<string, any>) => void;
  initialValues?: Record<string, any> | null; // Para pre-cargar datos al editar

  // props para el modo modal
  modal?: boolean;
  open?: boolean;
  onClose?: () => void;
};

const FormularioDinamico: React.FC<Props> = ({
  titulo,
  campos,
  onSubmit,
  initialValues,
  modal = false,
  open = false,
  onClose,
}) => {
  const [valores, setValores] = useState<Record<string, any>>({});
  const [modalNuevoAdicional, setModalNuevoAdicional] = useState(false);

  // Efecto para sincronizar el estado del formulario con los valores iniciales
  // Se ejecuta cuando el formulario se abre o cuando cambian los datos a editar.
  useEffect(() => {
    if (open) {
      if (initialValues) {
        setValores(initialValues);
      } else {
        setValores({}); // Limpia el formulario para una nueva entrada
      }
    }
  }, [initialValues, open]);

  const handleChange = (clave: string, valor: any) => {
    setValores((prev) => ({ ...prev, [clave]: valor }));
  };

  const handleInternalSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(valores); // Envía los valores actuales al padre
    if (onClose) {
      onClose(); // Cierra el modal si aplica
    }
  };

  const contenidoFormulario = (
    <>
      <form className="formulario-tarifa" onSubmit={handleInternalSubmit}>
        {campos.map((campo) => {
          switch (campo.tipo) {
            case "text":
              return (
                <BasicTextFields
                  key={campo.clave}
                  label={campo.nombre}
                  value={valores[campo.clave] || ""}
                  onChange={(val: string) => handleChange(campo.clave, val)}
                />
              );

            case "select":
              return (
                <BasicAutocomplete
                  key={campo.clave}
                  label={campo.nombre}
                  opciones={campo.opciones || []}
                  value={valores[campo.clave] || ""}
                  onChange={(val: string) => handleChange(campo.clave, val)}
                />
              );

            case "adicionales":
              return (
                <AdicionalSelector
                  key={campo.clave}
                  adicionales={campo.opciones || []}
                  seleccionados={valores[campo.clave] || []}
                  onChange={(val) => handleChange(campo.clave, val)}
                  onCrearNuevo={() => setModalNuevoAdicional(true)}
                />
              );

            case "resultado":
              const totalAdicionales = (valores["adicionales"] || []).reduce(
                (acc: number, ad: { precio: number }) => acc + ad.precio,
                0
              );
              const costoBase = Number(valores["costoBase"] || 0);
              let displayValue = "";

              if (campo.clave === "add") {
                displayValue = totalAdicionales.toFixed(2);
              } else if (campo.clave === "total") {
                displayValue = (costoBase + totalAdicionales).toFixed(2);
              }

              return (
                <Resultado
                  key={campo.clave}
                  nombre={campo.nombre}
                  value={displayValue}
                />
              );

            case "costoBase":
              return (
                <NumberField
                  key={campo.clave}
                  label="COSTO BASE"
                  value={valores[campo.clave] || ""}
                  onChange={(val) => handleChange(campo.clave, val)}
                />
              );

            default:
              return null;
          }
        })}

        <BotonGuardar />
      </form>
      <ModalCrearAdicional
        open={modalNuevoAdicional}
        onClose={() => setModalNuevoAdicional(false)}
        onCrear={(nuevo) => {
          const nuevoAdicional = {
            id: Date.now(), // ID temporal para el cliente
            ...nuevo,
          };
          const actuales = valores["adicionales"] || [];
          handleChange("adicionales", [...actuales, nuevoAdicional]);
        }}
      />
    </>
  );

  if (modal) {
    return (
      <Dialog open={open!} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {titulo}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>{contenidoFormulario}</DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="crear-tarifa">
      <h2>{titulo}</h2>
      {contenidoFormulario}
    </div>
  );
};

export default FormularioDinamico;
