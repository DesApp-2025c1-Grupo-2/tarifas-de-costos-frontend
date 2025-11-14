import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import { Input, InputAdornment, Typography } from "@mui/material"; // Import Typography o InputLabel si se prefiere

type TextProps = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: "text" | "email" | "tel" | "input" | "datetime-local" | "number";
  error?: boolean;
  helperText?: string;
};

// --- MODIFICACIÓN 1: BasicTextFields ---
export const BasicTextFields: React.FC<TextProps> = ({
  label,
  value,
  onChange,
  type = "text",
  error = false,
  helperText = "",
}) => (
  <Box sx={{ mb: 2 }}>
    {" "}
    {/* Añadido un poco más de margen inferior */}
    {/* 1. Etiqueta externa */}
    <InputLabel
      htmlFor={label} // Asocia la etiqueta al campo
      sx={{
        mb: 0.5,
        fontWeight: 500,
        color: "text.primary",
        fontSize: "0.875rem",
      }}
    >
      {label}
    </InputLabel>
    <TextField
      id={label} // ID para la asociación
      fullWidth
      // label={label} // <-- Se quita la etiqueta de aquí
      value={value}
      onChange={(e) => onChange(e.target.value)}
      margin="dense"
      type={type}
      error={error}
      helperText={helperText}
      placeholder={label} // Usamos el label como placeholder
      // InputLabelProps={{ shrink: true }} // <-- Ya no es necesario
    />
  </Box>
);

export type Opcion = {
  id: string | number;
  nombre: string;
};

type AutocompleteFieldProps = {
  label: string;
  opciones: Opcion[];
  value: string;
  onChange: (val: string) => void;
  error?: boolean;
  helperText?: string;
};

// --- MODIFICACIÓN 2: BasicAutocomplete ---
export const BasicAutocomplete: React.FC<AutocompleteFieldProps> = ({
  label,
  opciones,
  value,
  onChange,
  error = false,
  helperText = "",
}) => {
  const selectedOption = opciones.find((op) => String(op.id) === value) || null;

  return (
    <Box sx={{ mb: 2 }}>
      {" "}
      {/* Añadido un poco más de margen inferior */}
      {/* 1. Etiqueta externa */}
      <InputLabel
        htmlFor={label} // Asocia la etiqueta al campo
        sx={{
          mb: 0.5,
          fontWeight: 500,
          color: "text.primary",
          fontSize: "0.875rem",
        }}
      >
        {label}
      </InputLabel>
      <Autocomplete
        id={label} // ID para la asociación
        options={opciones}
        getOptionLabel={(option: Opcion) => option.nombre}
        value={selectedOption}
        onChange={(_, newValue) => {
          onChange(newValue ? String(newValue.id) : "");
        }}
        isOptionEqualToValue={(option, val) =>
          String(option.id) === String(val.id)
        }
        renderInput={(params) => (
          <TextField
            {...params}
            // label={label} // <-- Se quita la etiqueta de aquí
            size="small"
            placeholder={`Seleccione ${label}`}
            fullWidth
            error={error}
            helperText={helperText}
            // InputLabelProps={{ shrink: true }} // <-- Ya no es necesario
          />
        )}
        renderOption={(props, option) => {
          const { key, ...restProps } = props as any;
          return (
            <li key={key} {...restProps}>
              {option.nombre}
            </li>
          );
        }}
      />
    </Box>
  );
};

// --- (El resto del archivo no cambia) ---

interface NumberFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
}

export const NumberField: React.FC<NumberFieldProps> = ({
  label,
  value,
  onChange,
}) => {
  return (
    <FormControl fullWidth sx={{ m: 1, my: 2 }} variant="standard">
      <InputLabel htmlFor="costoBase">{label}</InputLabel>
      <Input
        id="costoBase"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="number"
        startAdornment={<InputAdornment position="start">$</InputAdornment>}
      />
    </FormControl>
  );
};

type Res = {
  nombre: string;
  value: string;
  unidad?: string;
};

export const Resultado: React.FC<Res> = ({ nombre, value, unidad }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <FormControl fullWidth sx={{ m: 1, my: 2 }} variant="standard">
        <InputLabel htmlFor={`resultado-${nombre.toLowerCase()}`}>
          {nombre}
        </InputLabel>
        <Input
          id={`resultado-${nombre.toLowerCase()}`}
          value={value}
          readOnly
          startAdornment={
            unidad ? (
              <InputAdornment position="start">{unidad}</InputAdornment>
            ) : null
          }
        />
      </FormControl>
    </Box>
  );
};
