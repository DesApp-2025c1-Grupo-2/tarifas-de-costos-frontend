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
  FormControlLabel,
  Switch,
  Button,
  DialogActions, // Importar DialogActions
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AdicionalSelector } from "./adicionales/AdicionalSelector";
import { ProvinciaSelector } from "./provincias/ProvinciaSelector";
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
    | "switch"
    | "datetime-local";
  nombre: string;
  clave: string;
  opciones?: any[];
  requerido?: boolean;
};

type Props = {
  titulo?: string;
  campos: Campo[];
  onSubmit: (valores: Record<string, any>) => void;
  initialValues?: Record<string, any> | null;
  modal?: boolean;
  open?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  onValuesChange?: (valores: Record<string, any>) => void;
};

const FormularioDinamico: React.FC<Props> = ({
  titulo,
  campos,
  onSubmit,
  initialValues,
  modal = false,
  open = false,
  onClose,
  children,
  onValuesChange,
}) => {
  const [valores, setValores] = useState<Record<string, any>>({});
  const [modalNuevoAdicional, setModalNuevoAdicional] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open || initialValues) {
      setValores(initialValues || {});
    }
  }, [initialValues, open]);

  const handleChange = (clave: string, valor: any) => {
    const nuevosValores = { ...valores, [clave]: valor };
    setValores(nuevosValores);
    if (onValuesChange) {
      onValuesChange(nuevosValores);
    }
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
    <Box
      component="form"
      id="formulario-dinamico" // ID para asociar botones externos
      onSubmit={handleInternalSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        marginTop: modal ? 0 : "2em",
        width: "100%",
      }}
    >
      {campos.map((campo) => {
        switch (campo.tipo) {
          case "text":
          case "email":
          case "tel":
          case "datetime-local":
          case "input":
          case "number":
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
          case "costoBase":
            return (
              <NumberField
                key={campo.clave}
                label={campo.nombre}
                value={valores[campo.clave] || ""}
                onChange={(val) => handleChange(campo.clave, val)}
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
      {/* Si se pasan 'children', se renderizan aquí. Ideal para botones personalizados. */}
      {children}
    </Box>
  );

  if (modal) {
    return (
      <Dialog open={open!} onClose={onClose} fullWidth maxWidth="sm">
        {titulo && (
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
        )}
        <DialogContent dividers>{contenidoFormulario}</DialogContent>
        {!children && (
          <DialogActions>
            <Button onClick={onClose}>Cancelar</Button>
            <Button
              type="submit"
              form="formulario-dinamico"
              variant="contained"
            >
              Guardar
            </Button>
          </DialogActions>
        )}
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
      {titulo && <h2>{titulo}</h2>}
      {contenidoFormulario}
    </Box>
  );
};

export default FormularioDinamico;
