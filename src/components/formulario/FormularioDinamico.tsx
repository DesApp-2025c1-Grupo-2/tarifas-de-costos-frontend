import React, { useState, useEffect } from "react";
import {
  BasicTextFields,
  BasicAutocomplete,
  Resultado,
  NumberField,
} from "./Campos";
import { BotonGuardar } from "../Botones";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  FormControlLabel, // Importado
  Switch, // Importado
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AdicionalSelector } from "./adicionales/AdicionalSelector";
import { ProvinciaSelector } from "./provincias/provinciaSelector";
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
    | "number"
    | "adicionales"
    | "provincias"
    | "resultado"
    | "costoBase"
    | "switch"; // Tipo añadido
  nombre: string;
  clave: string;
  opciones?: any[];
  requerido?: boolean;
};

type Props = {
  titulo: string;
  campos: Campo[];
  onSubmit: (valores: Record<string, any>) => void;
  initialValues?: Record<string, any> | null;
  modal?: boolean;
  open?: boolean;
  onClose?: () => void;
  children?: React.ReactNode; // Se añade para permitir hijos
};

const FormularioDinamico: React.FC<Props> = ({
  titulo,
  campos,
  onSubmit,
  initialValues,
  modal = false,
  open = false,
  onClose,
  children, // Se añade para permitir hijos
}) => {
  const [valores, setValores] = useState<Record<string, any>>({});
  const [modalNuevoAdicional, setModalNuevoAdicional] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setValores(initialValues || {});
    }
  }, [initialValues, open]);

  const handleChange = (clave: string, valor: any) => {
    setValores((prev) => ({ ...prev, [clave]: valor }));
  };

  const validarFormulario = () => {
    const nuevosErrores: Record<string, string> = {};
    campos.forEach((campo) => {
      const valor = valores[campo.clave];
      const esRequerido = campo.hasOwnProperty("requerido")
        ? campo["requerido"]
        : false;
      if (
        esRequerido &&
        (!valor || (Array.isArray(valor) && valor.length === 0))
      ) {
        nuevosErrores[campo.clave] = "Este campo es obligatorio";
      }
    });
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleInternalSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validarFormulario()) return;
    onSubmit(valores);
    if (onClose) onClose();
  };

  const handleCrearAdicional = async (nuevo: NuevoAdicional) => {
    const adicionalParaFormulario = {
      id: -Math.floor(Math.random() * 100000),
      nombre: nuevo.nombre,
      descripcion: nuevo.descripcion,
      precio: nuevo.precio,
      costoEspecifico: nuevo.precio,
      activo: true,
      esGlobal: false,
    };
    const actuales = valores["adicionales"] || [];
    handleChange("adicionales", [...actuales, adicionalParaFormulario]);
    setModalNuevoAdicional(false);
  };

  const contenidoFormulario = (
    <>
      <Box
        component="form"
        onSubmit={handleInternalSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          marginTop: "2em",
          width: "100%",
        }}
      >
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
                  error={Boolean(errores[campo.clave])}
                  helperText={errores[campo.clave]}
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
                  error={Boolean(errores[campo.clave])}
                  helperText={errores[campo.clave]}
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
            case "provincias":
            return (
              <ProvinciaSelector
                key={campo.clave}
                provincias={campo.opciones || []}
                seleccionados={valores[campo.clave] || []}
                onChange={(val) => handleChange(campo.clave, val)}
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
            case "switch":
              return (
                <FormControlLabel
                  key={campo.clave}
                  control={
                    <Switch
                      checked={!!valores[campo.clave]}
                      onChange={(e) =>
                        handleChange(campo.clave, e.target.checked)
                      }
                      name={campo.clave}
                    />
                  }
                  label={campo.nombre}
                  sx={{ mt: 1, mb: 1, alignSelf: "flex-start" }}
                />
              );
            default:
              return null;
          }
        })}
        {/* Renderiza los hijos aquí, para permitir componentes manuales como el switch */}
        {children}
        <BotonGuardar />
      </Box>
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
    <Box
      sx={{
        margin: { xs: "0 auto", md: "0 auto" },
        width: { xs: "95%", md: "80%" },
        maxWidth: "800px",
        border: "1px solid black",
        borderRadius: "8px",
        padding: { xs: "20px", md: "40px 60px" },
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2>{titulo}</h2>
      {contenidoFormulario}
    </Box>
  );
};

export default FormularioDinamico;
