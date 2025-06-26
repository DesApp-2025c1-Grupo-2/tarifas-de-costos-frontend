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
import {
  ModalCrearAdicional,
  NuevoAdicional,
} from "./adicionales/ModalCrearAdicional";
import * as adicionalService from "../../services/adicionalService";

export type Campo = {
  tipo:
    | "text"
    | "input"
    | "email"
    | "tel"
    | "select"
    | "number"
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
    onSubmit(valores);
    if (onClose) {
      onClose();
    }
  };

  // --- INICIO DE LA MODIFICACIÓN ---
  // Ahora la creación del adicional es asíncrona y guarda en la BD primero
  const handleCrearAdicional = async (nuevo: NuevoAdicional) => {
    try {
      // Llama al servicio para guardar el nuevo adicional en la base de datos
      const adicionalGuardado = await adicionalService.crearAdicional({
        nombre: nuevo.nombre,
        descripcion: nuevo.descripcion,
        costoDefault: nuevo.precio,
        activo: true,
      });

      // Prepara el objeto para el estado local del formulario
      const adicionalParaFormulario = {
        id: adicionalGuardado.id,
        nombre: adicionalGuardado.nombre,
        descripcion: adicionalGuardado.descripcion,
        precio: adicionalGuardado.costoDefault,
        costoEspecifico: adicionalGuardado.costoDefault,
      };

      // Añade el adicional recién guardado a la lista de seleccionados
      const actuales = valores["adicionales"] || [];
      handleChange("adicionales", [...actuales, adicionalParaFormulario]);

      setModalNuevoAdicional(false); // Cierra el modal
    } catch (error) {
      console.error("Error al crear el nuevo adicional:", error);
      alert("No se pudo crear el nuevo adicional.");
    }
  };
  // --- FIN DE LA MODIFICACIÓN ---

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
                (
                  acc: number,
                  ad: { costoEspecifico?: number; precio: number }
                ) => acc + (ad.costoEspecifico ?? ad.precio),
                0
              );
              const costoBase = Number(valores["valorBase"] || 0);
              let displayValue = "";

              if (campo.clave === "total") {
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
        onCrear={handleCrearAdicional}
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
