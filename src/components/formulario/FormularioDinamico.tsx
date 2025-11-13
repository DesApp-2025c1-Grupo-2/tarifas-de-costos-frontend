import React, { useState, useEffect } from "react";
import {
  BasicTextFields,
  BasicAutocomplete,
  Resultado,
  NumberField,
} from "./Campos";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  FormControlLabel,
  Switch,
  Button,
  DialogActions,
  Divider, // <-- 1. IMPORTAR DIVIDER
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
    | "datetime-local"
    | "divider"; // <-- 2. AÑADIR "divider" AL TIPO
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
  // CORRECCIÓN: Inicializa el estado con los valores iniciales.
  // Esto garantiza que el formulario se pre-llene en la primera renderización (al editar).
  const [valores, setValores] = useState<Record<string, any>>(
    initialValues || {}
  );
  const [modalNuevoAdicional, setModalNuevoAdicional] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});

  // Se mantiene el useEffect para sincronizar el estado si initialValues cambia después del montaje.
  useEffect(() => {
    setValores(initialValues || {});
  }, [initialValues]);

  useEffect(() => {
    if (campos.some((c) => c.tipo === "resultado")) {
      const costoBase = parseFloat(valores["valorBase"] || "0");
      const costoAdicionales = (valores["adicionales"] || []).reduce(
        (total: number, ad: any) =>
          total + parseFloat(ad.costoEspecifico ?? ad.precio ?? "0"),
        0
      );
      const total = costoBase + costoAdicionales;

      if (valores["total"] !== total.toFixed(2)) {
        handleChange("total", total.toFixed(2));
      }
    }
  }, [valores, campos]);

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
      esGlobal: nuevo.esGlobal,
    };
    const actuales = valores["adicionales"] || [];
    handleChange("adicionales", [...actuales, adicionalParaFormulario]);
    setModalNuevoAdicional(false);
  };

  const contenidoFormulario = (
    <Box
      component="form"
      id="formulario-dinamico"
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
          case "resultado":
            return (
              <Resultado
                key={campo.clave}
                nombre={campo.nombre}
                value={valores[campo.clave] || "0.00"}
              />
            );
          // --- 3. AÑADIR EL CASO PARA RENDERIZAR EL DIVIDER ---
          case "divider":
            return <Divider key={campo.clave} sx={{ my: 2 }} />;
          // --- FIN DE LA MODIFICACIÓN ---
          default:
            return null;
        }
      })}
      {children}
    </Box>
  );

  if (modal) {
    return (
      <>
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
        <ModalCrearAdicional
          open={modalNuevoAdicional}
          onClose={() => setModalNuevoAdicional(false)}
          onCrear={handleCrearAdicional}
        />
      </>
    );
  }
  return (
    <>
      {titulo && <h2>{titulo}</h2>}
      {contenidoFormulario}
    </>
  );
};

export default FormularioDinamico;
