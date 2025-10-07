import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import { Input, InputAdornment } from "@mui/material";

type TextProps = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  // --- INICIO DE LA MODIFICACIÓN ---
  type?: "text" | "email" | "tel" | "input" | "datetime-local" | "number"; // Se añade 'number'
  // --- FIN DE LA MODIFICACIÓN ---
  error?: boolean;
  helperText?: string;
};

export const BasicTextFields: React.FC<TextProps> = ({
  label,
  value,
  onChange,
  type = "text",
  error = false,
  helperText = "",
}) => (
  <Box sx={{ mb: 1 }}>
    <TextField
      fullWidth
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      margin="normal"
      type={type}
      error={error}
      helperText={helperText}
      InputLabelProps={type === "datetime-local" ? { shrink: true } : undefined}
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
    <Box sx={{ mb: 1 }}>
      <Autocomplete
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
            label={label}
            fullWidth
            error={error}
            helperText={helperText}
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
};

export const Resultado: React.FC<Res> = ({ nombre, value }) => {
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
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
        />
      </FormControl>
    </Box>
  );
};
