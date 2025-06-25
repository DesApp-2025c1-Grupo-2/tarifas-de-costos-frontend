import React, { useState, useEffect } from "react";
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
import { ModalCrearAdicional } from "./adicionales/ModalCrearAdicional";

// --- INICIO DE LA MODIFICACIÓN 1 ---
export type Campo = {
  tipo:
    | "text"
    | "input"
    | "email" // <-- Nuevo
    | "tel" // <-- Nuevo
    | "select"
    | "number"
    | "adicionales"
    | "resultado"
    | "costoBase";
  nombre: string;
  clave: string;
  opciones?: any[];
};
// --- FIN DE LA MODIFICACIÓN 1 ---

type Props = {
  titulo: string;
  campos: Campo[];
  onSubmit: (valores: Record<string, any>) => void;
  initialValues?: Record<string, any> | null;
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

  useEffect(() => {
    if (open) {
      setValores(initialValues || {});
    }
  }, [initialValues, open]);

  const handleChange = (clave: string, valor: any) => {
    setValores((prev) => ({ ...prev, [clave]: valor }));
  };

  const handleInternalSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // --- INICIO DE LA MODIFICACIÓN 2 ---
    // Se añade la lógica de validación para email y teléfono
    for (const campo of campos) {
      const valor = valores[campo.clave];

      if (campo.tipo === "number" || campo.tipo === "costoBase") {
        if (
          valor === undefined ||
          valor === null ||
          valor === "" ||
          isNaN(Number(valor)) ||
          Number(valor) < 0
        ) {
          alert(
            `El campo "${campo.nombre}" debe ser un número válido y positivo.`
          );
          return;
        }
      }

      if (campo.tipo === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!valor || !emailRegex.test(valor)) {
          alert(
            `El campo "${campo.nombre}" no es un correo electrónico válido.`
          );
          return;
        }
      }

      if (campo.tipo === "tel") {
        const phoneRegex = /^[0-9+\-() ]{7,}$/; // Exige al menos 7 dígitos y caracteres comunes
        if (!valor || !phoneRegex.test(valor)) {
          alert(
            `El campo "${campo.nombre}" no es un número de teléfono válido.`
          );
          return;
        }
      }
    }
    // --- FIN DE LA MODIFICACIÓN 2 ---

    onSubmit(valores);
    if (onClose) {
      onClose();
    }
  };

  const contenidoFormulario = (
    <>
      <form className="formulario-tarifa" onSubmit={handleInternalSubmit}>
        {campos.map((campo) => {
          switch (campo.tipo) {
            case "text":
            case "email":
            case "tel":
              return (
                <BasicTextFields
                  key={campo.clave}
                  label={campo.nombre}
                  value={valores[campo.clave] || ""}
                  onChange={(val: string) => handleChange(campo.clave, val)}
                  type={campo.tipo}
                />
              );

            case "number":
              return (
                <NumberField
                  key={campo.clave}
                  label={campo.nombre}
                  value={valores[campo.clave] || ""}
                  onChange={(val) => handleChange(campo.clave, val)}
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
            id: Date.now(),
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
